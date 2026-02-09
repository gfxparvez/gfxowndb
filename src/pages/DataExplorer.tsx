import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Loader2, Table2 } from "lucide-react";
import type { Tables as DBTypes, Json } from "@/integrations/supabase/types";

type DBTable = DBTypes<"database_tables">;
type TableColumn = DBTypes<"table_columns">;
type TableRowData = DBTypes<"table_rows">;

const DataExplorer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [databases, setDatabases] = useState<DBTypes<"databases">[]>([]);
  const [selectedDb, setSelectedDb] = useState("");
  const [tables, setTables] = useState<DBTable[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [rows, setRows] = useState<TableRowData[]>([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newRow, setNewRow] = useState<Record<string, string>>({});
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    if (!user) return;
    supabase.from("databases").select("*").order("name").then(({ data }) => setDatabases(data || []));
  }, [user]);

  useEffect(() => {
    if (!selectedDb) { setTables([]); return; }
    supabase.from("database_tables").select("*").eq("database_id", selectedDb).order("name").then(({ data }) => {
      setTables(data || []);
      setSelectedTable("");
    });
  }, [selectedDb]);

  useEffect(() => {
    if (!selectedTable) { setColumns([]); setRows([]); return; }
    setLoading(true);
    setPage(0);
    Promise.all([
      supabase.from("table_columns").select("*").eq("table_id", selectedTable).order("position"),
      supabase.from("table_rows").select("*").eq("table_id", selectedTable).range(0, PAGE_SIZE - 1).order("created_at"),
    ]).then(([colRes, rowRes]) => {
      setColumns(colRes.data || []);
      setRows(rowRes.data || []);
      setLoading(false);
    });
  }, [selectedTable]);

  const loadPage = async (p: number) => {
    const { data } = await supabase.from("table_rows").select("*").eq("table_id", selectedTable).range(p * PAGE_SIZE, (p + 1) * PAGE_SIZE - 1).order("created_at");
    setRows(data || []);
    setPage(p);
  };

  const handleAddRow = async () => {
    if (!selectedTable) return;
    const data: Record<string, Json> = {};
    columns.forEach((c) => { if (newRow[c.name]) data[c.name] = newRow[c.name]; });
    const { error } = await supabase.from("table_rows").insert({ table_id: selectedTable, data });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Row added" }); setNewRow({}); setAddOpen(false); loadPage(page); }
  };

  const handleSaveEdit = async (rowId: string) => {
    const data: Record<string, Json> = {};
    columns.forEach((c) => { if (editData[c.name] !== undefined) data[c.name] = editData[c.name]; });
    const { error } = await supabase.from("table_rows").update({ data }).eq("id", rowId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Row updated" }); setEditingRow(null); loadPage(page); }
  };

  const handleDeleteRow = async (rowId: string) => {
    await supabase.from("table_rows").delete().eq("id", rowId);
    toast({ title: "Row deleted" });
    loadPage(page);
  };

  const startEdit = (row: TableRowData) => {
    setEditingRow(row.id);
    const d: Record<string, string> = {};
    columns.forEach((c) => { d[c.name] = String((row.data as Record<string, Json>)?.[c.name] ?? ""); });
    setEditData(d);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Explorer</h1>
        <p className="text-muted-foreground text-sm">Browse and edit data in your tables</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Select value={selectedDb} onValueChange={setSelectedDb}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select database" /></SelectTrigger>
          <SelectContent>{databases.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedTable} onValueChange={setSelectedTable} disabled={!selectedDb}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select table" /></SelectTrigger>
          <SelectContent>{tables.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
        </Select>
        {selectedTable && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4" /> Add Row</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Row</DialogTitle>
                <DialogDescription>Enter values for each column.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {columns.map((c) => (
                  <div key={c.id} className="space-y-1">
                    <label className="text-sm font-medium">{c.name} <span className="text-muted-foreground">({c.data_type})</span></label>
                    <Input value={newRow[c.name] || ""} onChange={(e) => setNewRow({ ...newRow, [c.name]: e.target.value })} />
                  </div>
                ))}
              </div>
              <DialogFooter><Button onClick={handleAddRow} className="gradient-primary text-primary-foreground">Add</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : !selectedTable ? (
        <Card className="glass-card"><CardContent className="flex flex-col items-center py-12">
          <Table2 className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select a database and table to explore data</p>
        </CardContent></Card>
      ) : (
        <Card className="glass-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((c) => <TableHead key={c.id}>{c.name}</TableHead>)}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">No data</TableCell></TableRow>
                ) : rows.map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((c) => (
                      <TableCell key={c.id}>
                        {editingRow === row.id ? (
                          <Input className="h-8 text-sm" value={editData[c.name] || ""} onChange={(e) => setEditData({ ...editData, [c.name]: e.target.value })} />
                        ) : (
                          <span className="text-sm">{String((row.data as Record<string, Json>)?.[c.name] ?? "")}</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      {editingRow === row.id ? (
                        <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(row.id)}><Save className="w-4 h-4 text-green-600" /></Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => startEdit(row)}>Edit</Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteRow(row.id)}><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center p-4 border-t border-border">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => loadPage(page - 1)}>Previous</Button>
            <span className="text-sm text-muted-foreground">Page {page + 1}</span>
            <Button variant="outline" size="sm" disabled={rows.length < PAGE_SIZE} onClick={() => loadPage(page + 1)}>Next</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DataExplorer;

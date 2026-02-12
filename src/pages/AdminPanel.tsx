import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadDB, saveDB, MainWebDB, User, DatabaseRecord } from "@/lib/mainwebdb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, Users, Database, Key, BarChart3, LogOut, Trash2, Ban, CheckCircle2,
  Search, RefreshCw, Download, AlertTriangle, Activity, Eye, XCircle, Settings,
  Copyright, ChevronDown, ChevronRight, FileJson, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "overview" | "users" | "databases" | "api_keys" | "logs" | "copyright" | "security";

const AdminPanel = () => {
  const [db, setDb] = useState<MainWebDB>(loadDB());
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const session = localStorage.getItem("gfxdb_admin_session");
    if (!session) { navigate("/admin"); return; }
    try {
      const parsed = JSON.parse(session);
      if (Date.now() - parsed.ts > 3600000) { // 1hr session
        localStorage.removeItem("gfxdb_admin_session");
        navigate("/admin");
      }
    } catch { navigate("/admin"); }
  }, [navigate]);

  const refresh = () => { setDb(loadDB()); toast({ title: "Refreshed", description: "Data reloaded from mainwebdb.json" }); };

  const deleteUser = (userId: string) => {
    const updated = { ...db };
    updated.users = updated.users.filter(u => u.id !== userId);
    updated.databases = updated.databases.filter(d => d.user_id !== userId);
    updated.api_keys = updated.api_keys.filter(k => k.user_id !== userId);
    updated.query_logs = updated.query_logs.filter(l => l.user_id !== userId);
    updated.copyright_strikes = updated.copyright_strikes.filter(s => s.user_id !== userId);
    saveDB(updated);
    setDb(updated);
    toast({ title: "User Deleted", description: "User and all associated data removed." });
  };

  const deleteDatabase = (dbId: string) => {
    const updated = { ...db };
    updated.databases = updated.databases.filter(d => d.id !== dbId);
    updated.api_keys = updated.api_keys.filter(k => k.database_id !== dbId);
    updated.query_logs = updated.query_logs.filter(l => l.database_id !== dbId);
    saveDB(updated);
    setDb(updated);
    toast({ title: "Database Deleted" });
  };

  const toggleApiKey = (keyId: string) => {
    const updated = { ...db };
    const key = updated.api_keys.find(k => k.id === keyId);
    if (key) { key.is_active = !key.is_active; saveDB(updated); setDb(updated); }
  };

  const deleteApiKey = (keyId: string) => {
    const updated = { ...db };
    updated.api_keys = updated.api_keys.filter(k => k.id !== keyId);
    saveDB(updated);
    setDb(updated);
    toast({ title: "API Key Deleted" });
  };

  const clearLogs = () => {
    const updated = { ...db, query_logs: [] };
    saveDB(updated);
    setDb(updated);
    toast({ title: "Logs Cleared" });
  };

  const resolveStrike = (strikeId: string) => {
    const updated = { ...db };
    const strike = updated.copyright_strikes.find(s => s.id === strikeId);
    if (strike) { strike.status = "resolved"; saveDB(updated); setDb(updated); }
  };

  const dismissStrike = (strikeId: string) => {
    const updated = { ...db };
    const strike = updated.copyright_strikes.find(s => s.id === strikeId);
    if (strike) { strike.status = "dismissed"; saveDB(updated); setDb(updated); }
  };

  const logout = () => {
    localStorage.removeItem("gfxdb_admin_session");
    navigate("/admin");
  };

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "users", label: "Users", icon: Users, count: db.users.length },
    { id: "databases", label: "Databases", icon: Database, count: db.databases.length },
    { id: "api_keys", label: "API Keys", icon: Key, count: db.api_keys.length },
    { id: "logs", label: "Query Logs", icon: BarChart3, count: db.query_logs.length },
    { id: "copyright", label: "Copyright", icon: Copyright, count: db.copyright_strikes.length },
    { id: "security", label: "Security", icon: Shield },
  ];

  const getUserEmail = (userId: string) => db.users.find(u => u.id === userId)?.email || "Unknown";
  const getDbName = (dbId: string) => db.databases.find(d => d.id === dbId)?.name || "Unknown";
  const totalRows = db.databases.reduce((sum, d) => sum + d.tables.reduce((s, t) => s + t.rows.length, 0), 0);
  const totalTables = db.databases.reduce((sum, d) => sum + d.tables.length, 0);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm font-[Space_Grotesk]">GFX DB</span>
            <span className="block text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={cn("flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === t.id ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}>
              <t.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{t.label}</span>
              {t.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">{t.count}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <button onClick={refresh} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent w-full">
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </button>
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent w-full">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center gap-4">
          <h1 className="font-bold text-lg font-[Space_Grotesk]">{tabs.find(t => t.id === activeTab)?.label}</h1>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 w-56" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Shield className="w-3 h-3" /> Admin
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Users", value: db.users.length, icon: Users, color: "from-primary to-purple-400" },
                  { label: "Databases", value: db.databases.length, icon: Database, color: "from-accent to-pink-400" },
                  { label: "Tables", value: totalTables, icon: FileJson, color: "from-blue-500 to-cyan-400" },
                  { label: "Total Rows", value: totalRows, icon: Activity, color: "from-emerald-500 to-green-400" },
                  { label: "API Keys", value: db.api_keys.length, icon: Key, color: "from-amber-500 to-yellow-400" },
                  { label: "Active Keys", value: db.api_keys.filter(k => k.is_active).length, icon: CheckCircle2, color: "from-green-500 to-emerald-400" },
                  { label: "Query Logs", value: db.query_logs.length, icon: BarChart3, color: "from-indigo-500 to-violet-400" },
                  { label: "Strikes", value: db.copyright_strikes.filter(s => s.status === "active").length, icon: AlertTriangle, color: "from-red-500 to-rose-400" },
                ].map(s => (
                  <Card key={s.label} className="glass-card hover:shadow-lg transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", s.color)}>
                        <s.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-[Space_Grotesk]">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="glass-card">
                <CardHeader><CardTitle className="text-base">Recent Users</CardTitle></CardHeader>
                <CardContent>
                  {db.users.length === 0 ? <p className="text-sm text-muted-foreground">No users registered yet.</p> : (
                    <div className="space-y-2">
                      {db.users.slice(-5).reverse().map(u => (
                        <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                          <div>
                            <p className="text-sm font-medium">{u.display_name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                          <span className="text-xs text-muted-foreground"><Clock className="w-3 h-3 inline mr-1" />{new Date(u.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users */}
          {activeTab === "users" && (
            <div className="space-y-4">
              {db.users.filter(u => !search || u.email.includes(search) || u.display_name.includes(search)).map(u => {
                const userDbs = db.databases.filter(d => d.user_id === u.id);
                const userKeys = db.api_keys.filter(k => k.user_id === u.id);
                const userLogs = db.query_logs.filter(l => l.user_id === u.id);
                const expanded = expandedUser === u.id;
                return (
                  <Card key={u.id} className="glass-card">
                    <CardContent className="p-0">
                      <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedUser(expanded ? null : u.id)}>
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                          {u.display_name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{u.display_name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{userDbs.length} DBs</span>
                          <span>·</span>
                          <span>{userKeys.length} Keys</span>
                          <span>·</span>
                          <span>{userLogs.length} Logs</span>
                        </div>
                        {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      {expanded && (
                        <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div className="p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground block">ID</span><code className="text-[10px] break-all">{u.id}</code></div>
                            <div className="p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground block">Created</span>{new Date(u.created_at).toLocaleString()}</div>
                            <div className="p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground block">Databases</span>{userDbs.length}</div>
                            <div className="p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground block">API Requests</span>{userLogs.length}</div>
                          </div>
                          {userDbs.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold mb-2">User's Databases:</p>
                              {userDbs.map(d => (
                                <div key={d.id} className="flex items-center justify-between p-2 rounded bg-muted/20 mb-1 text-xs">
                                  <span><Database className="w-3 h-3 inline mr-1" />{d.name} — {d.tables.length} tables</span>
                                  <Button size="sm" variant="ghost" className="h-6 text-xs text-destructive hover:text-destructive" onClick={() => deleteDatabase(d.id)}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={() => { if (confirm(`Delete user "${u.email}" and ALL their data?`)) deleteUser(u.id); }}>
                              <Trash2 className="w-3 h-3 mr-1" /> Delete User & All Data
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              {db.users.length === 0 && <p className="text-center text-muted-foreground py-12">No users registered.</p>}
            </div>
          )}

          {/* Databases */}
          {activeTab === "databases" && (
            <div className="space-y-3">
              {db.databases.filter(d => !search || d.name.includes(search)).map(d => (
                <Card key={d.id} className="glass-card">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground">Owner: {getUserEmail(d.user_id)} · {d.tables.length} tables · {d.tables.reduce((s, t) => s + t.rows.length, 0)} rows</p>
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase", d.status === "active" ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500")}>{d.status}</span>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive h-8" onClick={() => { if (confirm(`Delete "${d.name}"?`)) deleteDatabase(d.id); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {db.databases.length === 0 && <p className="text-center text-muted-foreground py-12">No databases created.</p>}
            </div>
          )}

          {/* API Keys */}
          {activeTab === "api_keys" && (
            <div className="space-y-3">
              {db.api_keys.filter(k => !search || k.key_value.includes(search) || k.name.includes(search)).map(k => (
                <Card key={k.id} className="glass-card">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Key className="w-5 h-5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{k.name}</p>
                      <code className="text-[10px] text-muted-foreground break-all">{k.key_value}</code>
                      <p className="text-xs text-muted-foreground mt-1">Owner: {getUserEmail(k.user_id)} · DB: {getDbName(k.database_id)}</p>
                    </div>
                    <button onClick={() => toggleApiKey(k.id)} className={cn("text-xs px-2.5 py-1 rounded-full font-semibold", k.is_active ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500")}>
                      {k.is_active ? "Active" : "Disabled"}
                    </button>
                    <Button size="sm" variant="ghost" className="text-destructive h-8" onClick={() => { if (confirm("Delete this API key?")) deleteApiKey(k.id); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {db.api_keys.length === 0 && <p className="text-center text-muted-foreground py-12">No API keys.</p>}
            </div>
          )}

          {/* Query Logs */}
          {activeTab === "logs" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button size="sm" variant="outline" className="text-xs" onClick={clearLogs}>
                  <Trash2 className="w-3 h-3 mr-1" /> Clear All Logs
                </Button>
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/50 text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 text-left">Method</th>
                    <th className="px-4 py-2.5 text-left">Endpoint</th>
                    <th className="px-4 py-2.5 text-left">Status</th>
                    <th className="px-4 py-2.5 text-left">User</th>
                    <th className="px-4 py-2.5 text-left">Time</th>
                  </tr></thead>
                  <tbody>
                    {db.query_logs.filter(l => !search || l.endpoint.includes(search)).slice(-50).reverse().map(l => (
                      <tr key={l.id} className="border-t border-border/50 hover:bg-muted/20">
                        <td className="px-4 py-2"><span className={cn("text-xs font-mono font-bold px-1.5 py-0.5 rounded", l.method === "GET" ? "bg-blue-500/15 text-blue-500" : l.method === "POST" ? "bg-green-500/15 text-green-500" : l.method === "DELETE" ? "bg-red-500/15 text-red-500" : "bg-amber-500/15 text-amber-500")}>{l.method}</span></td>
                        <td className="px-4 py-2 text-xs font-mono">{l.endpoint}</td>
                        <td className="px-4 py-2"><span className={cn("text-xs font-semibold", l.status_code < 300 ? "text-green-500" : "text-red-500")}>{l.status_code}</span></td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">{getUserEmail(l.user_id)}</td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {db.query_logs.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">No logs.</p>}
              </div>
            </div>
          )}

          {/* Copyright */}
          {activeTab === "copyright" && (
            <div className="space-y-3">
              {db.copyright_strikes.filter(s => !search || s.content_name.includes(search)).map(s => (
                <Card key={s.id} className="glass-card">
                  <CardContent className="p-4 flex items-center gap-4">
                    <AlertTriangle className={cn("w-5 h-5 shrink-0", s.status === "active" ? "text-amber-500" : s.status === "resolved" ? "text-green-500" : "text-muted-foreground")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{s.content_name}</p>
                      <p className="text-xs text-muted-foreground">{s.strike_reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">User: {getUserEmail(s.user_id)} · {new Date(s.created_at).toLocaleString()}</p>
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase", s.status === "active" ? "bg-amber-500/15 text-amber-500" : s.status === "resolved" ? "bg-green-500/15 text-green-500" : "bg-muted text-muted-foreground")}>{s.status}</span>
                    {s.status === "active" && (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-green-500" onClick={() => resolveStrike(s.id)}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Resolve
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => dismissStrike(s.id)}>
                          <XCircle className="w-3 h-3 mr-1" /> Dismiss
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {db.copyright_strikes.length === 0 && <p className="text-center text-muted-foreground py-12">No copyright strikes.</p>}
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <Card className="glass-card border-green-500/30">
                <CardContent className="p-6 text-center space-y-3">
                  <Shield className="w-12 h-12 text-green-500 mx-auto" />
                  <h3 className="font-bold text-lg font-[Space_Grotesk]">Security Status: Active</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">GFX DB Auto Copyright Protection System is active. All content is monitored and protected under DMCA.</p>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {["DMCA Protection", "Auto Strike System", "Content Monitoring", "Admin Auth", "Session Security", "Rate Limiting"].map(f => (
                      <span key={f} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> {f}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-3">System Info</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground block">Storage</span>mainwebdb.json (localStorage)</div>
                    <div className="p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground block">DB Size</span>{(new Blob([JSON.stringify(db)]).size / 1024).toFixed(1)} KB</div>
                    <div className="p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground block">Admin Session</span>1 hour timeout</div>
                    <div className="p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground block">Developer</span>GFX DEVELOPER PARVEZ</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <footer className="border-t border-border p-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} GFX DB Admin Panel — <span className="font-semibold text-primary">GFX DEVELOPER PARVEZ</span> · All Rights Reserved 🛡️
        </footer>
      </main>
    </div>
  );
};

export default AdminPanel;

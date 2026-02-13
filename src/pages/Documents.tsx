import { useState } from "react";
import { Link } from "react-router-dom";
import { Database, ArrowRight, BookOpen, Copy, Check, FileJson, Key, Code2, Terminal, Shield, Layers, Table2, Zap, Globe, Search, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const CodeBlock = ({ code, lang }: { code: string; lang: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <button onClick={copy} className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/80 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="bg-muted/50 border border-border rounded-xl p-5 text-sm leading-relaxed overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const API_BASE = "YOUR_API_URL/functions/v1/db-api";

const sections = [
  {
    id: "overview",
    title: "Overview",
    icon: Layers,
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed text-base">
          <strong className="text-foreground">GFX DB</strong> is a JSON-powered database platform that stores all your data in a single <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono text-primary border border-border">mainwebdb.json</code> file via localStorage. No external database required — everything runs in the browser with a full REST API.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: FileJson, title: "JSON Storage", desc: "All data stored in mainwebdb.json via localStorage" },
            { icon: Key, title: "API Key Auth", desc: "Secure access with auto-generated API keys" },
            { icon: Code2, title: "REST API", desc: "Full CRUD via POST requests" },
            { icon: Shield, title: "Copyright Protection", desc: "Auto DMCA strike system built-in" },
          ].map(f => (
            <div key={f.title} className="glass-card rounded-xl p-5 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm font-semibold mb-3">Data Structure</p>
          <CodeBlock lang="json" code={`{
  "users": [...],
  "databases": [...],
  "api_keys": [...],
  "query_logs": [...],
  "copyright_strikes": [...]
}`} />
        </div>
      </div>
    ),
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">Follow these steps to start using GFX DB:</p>
        <div className="space-y-4">
          {[
            { step: "1", title: "Create an Account", desc: "Sign up with your email and password on the auth page." },
            { step: "2", title: "Create a Database", desc: "Go to Databases and create your first database with a name and description." },
            { step: "3", title: "Add Tables & Columns", desc: "Inside your database, create tables and define columns with types." },
            { step: "4", title: "Insert Data", desc: "Use the Data Explorer to add, edit, and delete rows in your tables." },
            { step: "5", title: "Get Your API Key", desc: "Go to API Keys to find your auto-generated key for external access." },
          ].map(s => (
            <div key={s.step} className="flex gap-4 items-start">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">{s.step}</div>
              <div>
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <CodeBlock lang="bash" code={`# Export your database anytime from Settings
# File: mainwebdb.json
# Import to restore from a backup`} />
      </div>
    ),
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: Globe,
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          All API requests are <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">POST</code> requests to the API endpoint with a JSON body containing your API key, action, table, and optional data.
        </p>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm font-semibold mb-1">Endpoint</p>
          <code className="text-sm font-mono text-primary">{API_BASE}</code>
        </div>

        <h3 className="text-lg font-bold mt-8 mb-3">Actions</h3>

        {/* SELECT */}
        <div className="glass-card rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold">SELECT</span>
            <span className="font-semibold text-sm">Read rows from a table</span>
          </div>
          <CodeBlock lang="json" code={`{
  "api_key": "gfx_your_key",
  "action": "select",
  "table": "users",
  "filters": { "name": "Parvez" }  // optional
}`} />
        </div>

        {/* INSERT */}
        <div className="glass-card rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-xs font-bold">INSERT</span>
            <span className="font-semibold text-sm">Add a new row</span>
          </div>
          <CodeBlock lang="json" code={`{
  "api_key": "gfx_your_key",
  "action": "insert",
  "table": "users",
  "data": { "name": "Parvez", "email": "parvez@gfx.dev" }
}`} />
        </div>

        {/* UPDATE */}
        <div className="glass-card rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-xs font-bold">UPDATE</span>
            <span className="font-semibold text-sm">Modify an existing row</span>
          </div>
          <CodeBlock lang="json" code={`{
  "api_key": "gfx_your_key",
  "action": "update",
  "table": "users",
  "row_id": "uuid-here",
  "data": { "name": "Updated Name" }
}`} />
        </div>

        {/* DELETE */}
        <div className="glass-card rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-xs font-bold">DELETE</span>
            <span className="font-semibold text-sm">Remove a row</span>
          </div>
          <CodeBlock lang="json" code={`{
  "api_key": "gfx_your_key",
  "action": "delete",
  "table": "users",
  "row_id": "uuid-here"
}`} />
        </div>
      </div>
    ),
  },
  {
    id: "code-examples",
    title: "Code Examples",
    icon: Terminal,
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">Ready-to-use examples in popular languages:</p>
        <Tabs defaultValue="curl" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="php">PHP</TabsTrigger>
          </TabsList>

          <TabsContent value="curl" className="mt-4">
            <CodeBlock lang="bash" code={`# Select all rows
curl -X POST "${API_BASE}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "gfx_your_key",
    "action": "select",
    "table": "users"
  }'

# Insert a row
curl -X POST "${API_BASE}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "gfx_your_key",
    "action": "insert",
    "table": "users",
    "data": { "name": "GFX", "role": "admin" }
  }'`} />
          </TabsContent>

          <TabsContent value="javascript" className="mt-4">
            <CodeBlock lang="javascript" code={`// Fetch all rows
const response = await fetch("${API_BASE}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: "gfx_your_key",
    action: "select",
    table: "users"
  })
});
const { data } = await response.json();
console.log(data);

// Insert a row
const insertRes = await fetch("${API_BASE}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: "gfx_your_key",
    action: "insert",
    table: "users",
    data: { name: "Parvez", email: "parvez@gfx.dev" }
  })
});`} />
          </TabsContent>

          <TabsContent value="python" className="mt-4">
            <CodeBlock lang="python" code={`import requests

API_URL = "${API_BASE}"

# Select all rows
response = requests.post(API_URL, json={
    "api_key": "gfx_your_key",
    "action": "select",
    "table": "users"
})
print(response.json())

# Insert a row
response = requests.post(API_URL, json={
    "api_key": "gfx_your_key",
    "action": "insert",
    "table": "users",
    "data": {"name": "Parvez", "role": "developer"}
})
print(response.json())`} />
          </TabsContent>

          <TabsContent value="php" className="mt-4">
            <CodeBlock lang="php" code={`<?php
$api_url = "${API_BASE}";

// Select all rows
$ch = curl_init($api_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "api_key" => "gfx_your_key",
    "action" => "select",
    "table" => "users"
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$data = json_decode($response, true);
print_r($data);

// Insert a row
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "api_key" => "gfx_your_key",
    "action" => "insert",
    "table" => "users",
    "data" => ["name" => "Parvez", "role" => "admin"]
]));
$response = curl_exec($ch);
curl_close($ch);`} />
          </TabsContent>
        </Tabs>
      </div>
    ),
  },
  {
    id: "database-schema",
    title: "Database Schema",
    icon: Table2,
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">The mainwebdb.json file contains these collections:</p>
        {[
          { name: "users", fields: ["id (UUID)", "email (string)", "password (hashed)", "display_name (string)", "created_at (ISO date)"] },
          { name: "databases", fields: ["id (UUID)", "user_id (UUID)", "name (string)", "description (string)", "status (string)", "tables (TableRecord[])", "created_at", "updated_at"] },
          { name: "api_keys", fields: ["id (UUID)", "user_id (UUID)", "database_id (UUID)", "key_value (string)", "name (string)", "is_active (boolean)", "last_used_at", "created_at"] },
          { name: "query_logs", fields: ["id (UUID)", "user_id (UUID)", "database_id (UUID)", "method (string)", "endpoint (string)", "status_code (number)", "response_time_ms", "request_body", "created_at"] },
          { name: "copyright_strikes", fields: ["id (UUID)", "user_id (UUID)", "content_type (string)", "content_id (UUID)", "content_name (string)", "strike_reason (string)", "status (active|resolved|dismissed)", "created_at"] },
        ].map(col => (
          <div key={col.name} className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-primary" />
              <code className="font-bold text-sm text-primary">{col.name}</code>
            </div>
            <div className="grid gap-1">
              {col.fields.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <code className="text-xs bg-muted px-2 py-0.5 rounded">{f}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "copyright",
    title: "Copyright & DMCA",
    icon: Shield,
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          All content created on GFX DB is automatically protected under copyright law. The Auto Copyright Strike System monitors for duplicate content and enforces protection.
        </p>
        <div className="glass-card rounded-xl p-6 border-primary/20">
          <p className="text-lg font-bold text-primary mb-2">© GFX DEVELOPER PARVEZ</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            GFX DB and all associated content, code, and designs are the intellectual property of GFX DEVELOPER PARVEZ.
            Unauthorized reproduction, distribution, or modification is strictly prohibited and may result in legal action.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { title: "Auto Detection", desc: "Duplicate database names across users trigger automatic copyright strikes." },
            { title: "Strike System", desc: "Strikes are tracked with status: active, resolved, or dismissed." },
            { title: "Admin Control", desc: "Administrators can review, resolve, or dismiss strikes from the Admin Panel." },
            { title: "DMCA Ready", desc: "All content is DMCA-protected with timestamped creation records." },
          ].map(item => (
            <div key={item.title} className="glass-card rounded-xl p-4 flex gap-3 items-start">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const Documents = () => {
  const [active, setActive] = useState("overview");
  const [search, setSearch] = useState("");
  const activeSection = sections.find(s => s.id === active);

  const filtered = search
    ? sections.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))
    : sections;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">GFX DB</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">Home</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gradient-primary border-0 text-white gap-1.5">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 border border-primary/20">
            <BookOpen className="w-3.5 h-3.5" /> Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            GFX DB <span className="gradient-text">Docs</span>
          </h1>
          <p className="text-lg text-muted-foreground">Complete reference for the JSON-powered database platform</p>
        </div>

        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search docs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            {filtered.map(s => (
              <button
                key={s.id}
                onClick={() => { setActive(s.id); setSearch(""); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                  active === s.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <s.icon className="w-4 h-4 shrink-0" />
                {s.title}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-6">
              {activeSection && <activeSection.icon className="w-6 h-6 text-primary" />}
              <h2 className="text-2xl font-bold">{activeSection?.title}</h2>
            </div>
            {activeSection?.content()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} GFX DB. All rights reserved.</span>
          <span>Developed by <span className="font-semibold text-primary">GFX DEVELOPER PARVEZ</span></span>
        </div>
      </footer>
    </div>
  );
};

export default Documents;

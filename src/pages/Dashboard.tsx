import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Key, Activity, Plus, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ databases: 0, apiKeys: 0, requests: 0 });
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [dbs, keys, logs, profile] = await Promise.all([
        supabase.from("databases").select("id", { count: "exact", head: true }),
        supabase.from("api_keys").select("id", { count: "exact", head: true }),
        supabase.from("query_logs").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
      ]);
      setStats({ databases: dbs.count || 0, apiKeys: keys.count || 0, requests: logs.count || 0 });
      setDisplayName(profile.data?.display_name || user.email || "");
    };
    load();
  }, [user]);

  const statCards = [
    { label: "Databases", value: stats.databases, icon: Database, color: "from-purple-500 to-indigo-600" },
    { label: "API Keys", value: stats.apiKeys, icon: Key, color: "from-pink-500 to-rose-600" },
    { label: "Total Requests", value: stats.requests, icon: Activity, color: "from-orange-400 to-amber-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div className="rounded-2xl gradient-primary p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {displayName.split("@")[0]}! 👋</h1>
        <p className="mt-2 text-white/80 max-w-xl">Manage your databases, API keys, and monitor usage from your personal dashboard.</p>
        <div className="mt-4 flex gap-3">
          <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
            <Link to="/databases"><Plus className="w-4 h-4" /> Create Database</Link>
          </Button>
          <Button asChild variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
            <Link to="/api-keys">View API Keys <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="glass-card overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Create Database", desc: "Spin up a new database in seconds", to: "/databases", icon: Database },
          { title: "View API Keys", desc: "Manage keys and connection snippets", to: "/api-keys", icon: Key },
          { title: "Query Logs", desc: "Monitor your API usage and performance", to: "/logs", icon: Activity },
        ].map((a) => (
          <Link key={a.to} to={a.to}>
            <Card className="glass-card hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <a.icon className="w-5 h-5 text-primary" />
                <CardTitle className="text-base">{a.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

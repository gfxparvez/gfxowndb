import { Link } from "react-router-dom";
import { Database, Key, BarChart3, Code2, Zap, Shield, BookOpen, ArrowRight, Terminal, Layers, FileJson, Copyright, Star, Globe, Lock, Cpu, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Database, title: "Instant Databases", desc: "Spin up a new database in seconds. Define tables and columns with a visual editor — no SQL required." },
  { icon: FileJson, title: "JSON File Storage", desc: "All data persists in mainwebdb.json via localStorage. Export, import, and manage your data file anytime." },
  { icon: Key, title: "API Key Auth", desc: "Each database gets a unique API key. Manage, rotate, and revoke keys from your dashboard." },
  { icon: Code2, title: "REST API Ready", desc: "Full CRUD via a simple JSON REST API. Works with any language — React, Node.js, Python, and more." },
  { icon: Shield, title: "Auto Copyright Protection", desc: "Built-in copyright strike system automatically protects your content with DMCA-ready notices." },
  { icon: BarChart3, title: "Usage Analytics", desc: "Track every request with real-time query logs, charts, and performance metrics." },
  { icon: Lock, title: "Admin Panel", desc: "Full admin control panel with user management, database oversight, and security monitoring." },
  { icon: Users, title: "User Management", desc: "Complete user authentication system with sign up, login, profile management, and session control." },
  { icon: Cpu, title: "Zero Config", desc: "No servers, no Docker, no cloud bills. Everything runs in your browser, ready to go instantly." },
];

const codeSnippet = `// GFX DB — Insert data with a single fetch call
const res = await fetch("https://gfxdb.lovable.app/api", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: "gfx_your-api-key",
    action: "insert",
    table: "users",
    data: { name: "Parvez", email: "parvez@gfxdev.com" }
  })
});
const { data } = await res.json();`;

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/landing" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight font-[Space_Grotesk] block leading-none">GFX DB</span>
              <span className="text-[10px] text-muted-foreground leading-none">by GFX Developer</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/docs">
              <Button variant="ghost" size="sm" className="gap-1.5"><BookOpen className="w-4 h-4" /> Docs</Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-1.5"><Shield className="w-4 h-4" /> Admin</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gradient-primary border-0 text-white gap-1.5">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(258 80% 58% / .4), transparent)" }} />
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 40% at 90% 80%, hsl(330 85% 60% / .3), transparent)" }} />
        <div className="max-w-5xl mx-auto px-6 pt-28 pb-24 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
            <Zap className="w-3.5 h-3.5" /> JSON-Powered Database Platform
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight font-[Space_Grotesk] mb-6">
            GFX <span className="gradient-text">DB</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Create databases, define schemas, and manage all your data — stored in a single{" "}
            <code className="bg-muted px-2 py-0.5 rounded text-sm font-mono text-primary border border-border">mainwebdb.json</code> file.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            By <span className="font-bold text-primary">GFX DEVELOPER PARVEZ</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary border-0 text-white text-base px-10 h-13 gap-2 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button variant="outline" size="lg" className="text-base px-8 h-13 gap-2">
                <BookOpen className="w-5 h-5" /> Documentation
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-14 text-xs text-muted-foreground">
            {[
              { icon: Shield, text: "DMCA Protected" },
              { icon: Lock, text: "Secure Auth" },
              { icon: Globe, text: "REST API" },
              { icon: Star, text: "Open Source" },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-1.5"><b.icon className="w-3.5 h-3.5 text-primary" /> {b.text}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Code preview */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 border-primary/10">
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-muted-foreground ml-2 font-mono flex items-center gap-1.5">
              <Terminal className="w-3 h-3" /> app.js
            </span>
          </div>
          <pre className="p-6 text-sm leading-relaxed overflow-x-auto text-foreground"><code>{codeSnippet}</code></pre>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-[Space_Grotesk] mb-4">
            Everything you need to ship&nbsp;<span className="gradient-text">faster</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From schema design to copyright protection — GFX DB handles everything so you can focus on building.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all group hover:border-primary/30">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold font-[Space_Grotesk] mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 py-28">
          <h2 className="text-3xl md:text-5xl font-bold font-[Space_Grotesk] text-center mb-16">
            Three steps to your&nbsp;<span className="gradient-text">database</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "1", icon: Layers, title: "Create a Database", desc: "Name it, describe it, and your database is live in localStorage." },
              { step: "2", icon: Terminal, title: "Define Your Schema", desc: "Add tables and columns with our visual editor." },
              { step: "3", icon: Code2, title: "Start Querying", desc: "Grab your API key and make your first request." },
            ].map(s => (
              <div key={s.step} className="text-center group">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold font-[Space_Grotesk] shadow-xl shadow-primary/25 group-hover:scale-110 transition-transform">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold font-[Space_Grotesk] mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Copyright notice */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="glass-card rounded-2xl p-10 text-center border-primary/10">
          <Copyright className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold font-[Space_Grotesk] mb-3">Auto Copyright Protection</h3>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
            All content created on GFX DB is automatically protected under copyright law. 
            Unauthorized reproduction, distribution, or modification of any content is strictly prohibited.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="w-4 h-4" /> DMCA Protected
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Zap className="w-4 h-4" /> Auto Strike System
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Lock className="w-4 h-4" /> Content Monitoring
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-28 text-center">
        <h2 className="text-3xl md:text-5xl font-bold font-[Space_Grotesk] mb-6">
          Ready to <span className="gradient-text">build</span>?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
          Create your first database in under a minute. No server needed — everything runs locally.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth">
            <Button size="lg" className="gradient-primary border-0 text-white text-base px-10 h-13 gap-2 shadow-xl shadow-primary/25">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline" size="lg" className="text-base px-8 h-13 gap-2">
              <Shield className="w-5 h-5" /> Admin Panel
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-foreground font-[Space_Grotesk]">GFX DB</span>
              </div>
              <p className="text-sm text-muted-foreground">JSON-powered database platform with full CRUD API, admin panel, and auto copyright protection.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link to="/docs" className="hover:text-foreground transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Documentation</Link>
                <Link to="/auth" className="hover:text-foreground transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Get Started</Link>
                <Link to="/admin" className="hover:text-foreground transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Admin Panel</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Security</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" /> DMCA Protected</span>
                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-primary" /> Auto Copyright System</span>
                <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-primary" /> API Key Authentication</span>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} GFX DB. All rights reserved.</span>
            <span>Developed by <span className="font-semibold text-primary">GFX DEVELOPER PARVEZ</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

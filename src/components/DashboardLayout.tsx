import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Database, Key, BarChart3, Settings, LogOut, Menu, X, Home, Table2, ChevronLeft, Shield, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportDB } from "@/lib/mainwebdb";

const navItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Databases", icon: Database, path: "/databases" },
  { label: "API Keys", icon: Key, path: "/api-keys" },
  { label: "Data Explorer", icon: Table2, path: "/explorer" },
  { label: "Query Logs", icon: BarChart3, path: "/logs" },
  { label: "Copyright", icon: Shield, path: "/settings" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-[68px]" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Database className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-lg tracking-tight font-[Space_Grotesk]">GFX DB</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto hidden md:block text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path + item.label}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Export DB button */}
        <div className="px-3 pb-2">
          <button
            onClick={() => exportDB()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full"
          >
            <Download className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Export DB</span>}
          </button>
        </div>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => { signOut(); navigate("/auth"); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main content */}
      <main className={cn("flex-1 transition-all duration-300", collapsed ? "md:ml-[68px]" : "md:ml-60")}>
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="md:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm text-muted-foreground truncate">{user?.email}</div>
          <div className="ml-auto text-xs text-muted-foreground">📁 mainwebdb.json</div>
        </header>
        <div className="p-4 md:p-6 max-w-7xl mx-auto">{children}</div>
        <footer className="border-t border-border p-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} GFX DB — All Rights Reserved. Developed by <span className="font-semibold text-primary">GFX DEVELOPER PARVEZ</span>. 
          Auto Copyright Protection System Active 🛡️
        </footer>
      </main>
    </div>
  );
};

export default DashboardLayout;

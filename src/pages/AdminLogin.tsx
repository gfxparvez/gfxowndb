import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2, Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "gfxleader";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) {
      toast({ title: "Account Locked", description: "Too many failed attempts. Try again in 60 seconds.", variant: "destructive" });
      return;
    }

    setLoading(true);
    // Simulate network delay for security
    await new Promise(r => setTimeout(r, 800));

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("gfxdb_admin_session", JSON.stringify({ email, ts: Date.now() }));
      toast({ title: "Welcome Admin", description: "Access granted to admin panel." });
      navigate("/admin/dashboard");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setLocked(true);
        setTimeout(() => { setLocked(false); setAttempts(0); }, 60000);
        toast({ title: "Account Locked", description: "5 failed attempts. Locked for 60 seconds.", variant: "destructive" });
      } else {
        toast({ title: "Access Denied", description: `Invalid credentials. ${5 - newAttempts} attempts remaining.`, variant: "destructive" });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, hsl(258 80% 58% / .5), transparent)" }} />
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(ellipse 40% 30% at 80% 80%, hsl(330 85% 60% / .4), transparent)" }} />

      <Card className="w-full max-w-md glass-card shadow-2xl border-primary/20 relative z-10">
        <CardHeader className="text-center space-y-3 pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold font-[Space_Grotesk]">Admin Panel</CardTitle>
          <CardDescription className="text-muted-foreground">
            Restricted access — authorized personnel only
          </CardDescription>
          {locked && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
              <Lock className="w-4 h-4 inline mr-1.5" />
              Account locked. Please wait 60 seconds.
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-sm font-semibold">Admin Email</Label>
              <Input id="admin-email" type="email" placeholder="admin@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required disabled={locked} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pass" className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <Input id="admin-pass" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required disabled={locked} className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 gradient-primary text-white border-0 font-semibold" disabled={loading || locked}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {locked ? "Locked" : "Access Admin Panel"}
            </Button>
          </form>
          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              🛡️ Protected by GFX Security System
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © {new Date().getFullYear()} GFX DEVELOPER PARVEZ
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please enter email and password"); return; }
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      toast.success("Welcome back, Manager");
      setLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/30 glow-primary mb-4">
            <ShieldAlert className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">ZUG</h1>
          <p className="text-xs text-muted-foreground mt-1">Manager Command Center</p>
        </div>
        <form onSubmit={handleSubmit} className="card-glass p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@zug.io"
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors pr-10" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
          <div className="relative my-1 flex items-center">
            <div className="flex-1 border-t border-border" />
            <span className="mx-2 text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground/50 mt-6">Enter any email & password to access the demo</p>
      </motion.div>
    </div>
  );
}
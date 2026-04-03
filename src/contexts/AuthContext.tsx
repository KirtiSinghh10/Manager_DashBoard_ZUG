"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; role: string } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (status === "loading") return; // wait — don't do anything yet

    if (session?.user) {
      setUser({ name: session.user.name ?? "Manager", role: "admin" });
      setHydrated(true);
      return;
    }

    const stored = sessionStorage.getItem("zug_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setHydrated(true);
  }, [session, status]);

  const login = (email: string, password: string) => {
    if (email && password) {
      const u = { name: "Admin Manager", role: "admin" };
      setUser(u);
      sessionStorage.setItem("zug_user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("zug_user");
  };

  if (!hydrated) return null; // render nothing until we know auth state

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
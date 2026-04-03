"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
                <span className="text-xs font-mono text-muted-foreground">LIVE</span>
              </div>
              <span className="text-xs text-muted-foreground">{user?.name}</span>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={logout} className="text-xs text-muted-foreground hover:text-destructive gap-1.5">
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto scrollbar-thin">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

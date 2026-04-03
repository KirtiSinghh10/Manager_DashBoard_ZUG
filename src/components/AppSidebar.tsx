"use client";
import Link from "next/link";
import { LayoutDashboard, Users, ShieldAlert, BarChart3, Activity, Settings, LayoutGrid } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Workers", url: "/workers", icon: Users },
  { title: "Fraud Alerts", url: "/fraud", icon: ShieldAlert },
  { title: "Heatmap", url: "/heatmap", icon: LayoutGrid },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Live Events", url: "/events", icon: Activity },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-4">
        <div className={`px-4 pb-6 ${collapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
              <ShieldAlert className="h-4 w-4 text-primary" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-sm font-semibold text-foreground">ZUG</h1>
                <p className="text-[10px] text-muted-foreground">Command Center</p>
              </div>
            )}
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={cn("hover:bg-sidebar-accent/50 transition-colors", isActive && "bg-sidebar-accent text-primary font-medium")}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {!collapsed && (
          <div className="mt-auto px-4 pb-4">
            <div className="card-glass p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
                <span className="text-[10px] font-mono text-muted-foreground">SYSTEM ONLINE</span>
              </div>
              <p className="text-[10px] text-muted-foreground">All services operational</p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

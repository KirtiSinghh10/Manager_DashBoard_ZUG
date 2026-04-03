"use client";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "primary" | "warning" | "danger" | "success";
}

const variantStyles = {
  default: "border-border",
  primary: "border-primary/30 glow-primary",
  warning: "border-accent/30 glow-accent",
  danger: "border-destructive/30 glow-destructive",
  success: "border-success/30 glow-success",
};

const iconVariants = {
  default: "bg-secondary text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  warning: "bg-accent/15 text-accent",
  danger: "bg-destructive/15 text-destructive",
  success: "bg-success/15 text-success",
};

export function KpiCard({ title, value, subtitle, icon: Icon, trend, trendValue, variant = "default" }: KpiCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`card-glass p-4 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${iconVariants[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {trend && trendValue && (
          <span className={`text-xs font-mono ${trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold font-mono text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{title}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}

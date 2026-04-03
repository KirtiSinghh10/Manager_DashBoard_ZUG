import { cn } from "@/lib/utils";

type BadgeVariant = "approved" | "rejected" | "pending" | "active" | "idle" | "flagged" | "pass" | "fail" | "review" | "investigating" | "cleared" | "confirmed";

const styles: Record<BadgeVariant, string> = {
  approved: "bg-success/15 text-success border-success/30",
  pass: "bg-success/15 text-success border-success/30",
  active: "bg-success/15 text-success border-success/30",
  cleared: "bg-success/15 text-success border-success/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  fail: "bg-destructive/15 text-destructive border-destructive/30",
  flagged: "bg-destructive/15 text-destructive border-destructive/30",
  confirmed: "bg-destructive/15 text-destructive border-destructive/30",
  pending: "bg-accent/15 text-accent border-accent/30",
  review: "bg-accent/15 text-accent border-accent/30",
  investigating: "bg-accent/15 text-accent border-accent/30",
  idle: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: BadgeVariant }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase border", styles[status])}>
      {status}
    </span>
  );
}

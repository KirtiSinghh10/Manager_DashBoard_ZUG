"use client";
import { motion } from "framer-motion";
import { liveEvents } from "@/data/mockData";

const typeStyles = {
  trigger: "border-l-primary bg-primary/5",
  claim: "border-l-success bg-success/5",
  fraud: "border-l-destructive bg-destructive/5",
  system: "border-l-accent bg-accent/5",
};
const typeLabels = {
  trigger: { icon: "🌧", label: "TRIGGER" },
  claim: { icon: "💰", label: "CLAIM" },
  fraud: { icon: "🚨", label: "FRAUD" },
  system: { icon: "⚙️", label: "SYSTEM" },
};

export default function Events() {
  const zones = [...new Set(liveEvents.map((e) => e.zone))].sort();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Real-Time Events</h1>
          <p className="text-sm text-muted-foreground">Live system activity feed by zone</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
          <span className="text-xs font-mono text-muted-foreground">STREAMING</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {zones.map((zone, zi) => {
          const zoneEvents = liveEvents.filter((e) => e.zone === zone);
          return (
            <motion.div key={zone} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: zi * 0.1 }} className="card-glass p-4">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-sm font-medium text-foreground">{zone}</h2>
                <span className="text-[10px] font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">{zoneEvents.length} events</span>
              </div>
              <div className="space-y-1.5">
                {zoneEvents.map((evt) => (
                  <div key={evt.id} className={`p-2.5 rounded border-l-2 ${typeStyles[evt.type]}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{typeLabels[evt.type].icon}</span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">{typeLabels[evt.type].label}</span>
                      <span className="text-[11px] text-foreground flex-1 truncate">{evt.message}</span>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">{evt.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

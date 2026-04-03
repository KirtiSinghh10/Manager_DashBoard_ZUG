"use client";
import { motion } from "framer-motion";
import { workers } from "@/data/mockData";

export default function Workers() {
  const zones = [...new Set(workers.map((w) => w.zone))].sort();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Workers</h1>
        <p className="text-sm text-muted-foreground">{workers.length} registered workers across {zones.length} zones</p>
      </div>
      <div className="grid gap-6">
        {zones.map((zone, zi) => {
          const zoneWorkers = workers.filter((w) => w.zone === zone);
          return (
            <motion.div key={zone} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: zi * 0.1 }} className="card-glass p-5">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-medium text-foreground">{zone}</h2>
                <span className="text-[10px] font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">{zoneWorkers.length} workers</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-muted-foreground border-b border-border">
                      <th className="text-left py-2 px-3 font-medium">ID</th>
                      <th className="text-left py-2 px-3 font-medium">Name</th>
                      <th className="text-left py-2 px-3 font-medium">e-Shram ID</th>
                      <th className="text-left py-2 px-3 font-medium">Zone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zoneWorkers.map((w) => (
                      <tr key={w.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-primary">{w.id}</td>
                        <td className="py-2.5 px-3 font-medium">{w.name}</td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{w.eshramId}</td>
                        <td className="py-2.5 px-3">{w.zone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { claims } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { X, MapPin, Cloud, Car, Package, Brain, Shield } from "lucide-react";
import type { Claim } from "@/data/mockData";

export default function Claims() {
  const [selected, setSelected] = useState<Claim | null>(null);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Claims Management</h1>
        <p className="text-sm text-muted-foreground">{claims.length} total claims</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`card-glass p-5 ${selected ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  {["ID","Worker","Event","Trigger","Amount","Status","Time"].map(h => (
                    <th key={h} className="text-left py-2 px-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {claims.map((c) => (
                  <tr key={c.id} onClick={() => setSelected(c)}
                    className={`border-b border-border/50 cursor-pointer transition-colors ${selected?.id === c.id ? "bg-primary/5" : "hover:bg-secondary/20"}`}>
                    <td className="py-2.5 px-3 font-mono text-primary">{c.id}</td>
                    <td className="py-2.5 px-3">{c.workerName}</td>
                    <td className="py-2.5 px-3 font-mono uppercase">{c.eventType === "rain" ? "🌧" : c.eventType === "rto" ? "📦" : "⏱"} {c.eventType}</td>
                    <td className="py-2.5 px-3">{c.triggerMet ? <span className="text-success">✓ Yes</span> : <span className="text-destructive">✗ No</span>}</td>
                    <td className="py-2.5 px-3 font-mono">₹{c.payoutAmount}</td>
                    <td className="py-2.5 px-3"><StatusBadge status={c.status} /></td>
                    <td className="py-2.5 px-3 text-muted-foreground font-mono">{c.timestamp.split(" ")[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card-glass p-5 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Evidence Panel</h3>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-3">
                {[
                  { icon: MapPin, label: "Location", value: selected.location },
                  { icon: Cloud, label: "Weather Data", value: selected.weatherData },
                  { icon: Car, label: "Traffic Data", value: selected.trafficData },
                  { icon: Package, label: "RTO Count", value: String(selected.rtoCount) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-xs">
                    <p className="text-muted-foreground mb-1 flex items-center gap-1"><Icon className="h-3 w-3" /> {label}</p>
                    <p className="font-mono text-foreground bg-secondary/30 p-2 rounded">{value}</p>
                  </div>
                ))}
                <div className="text-xs">
                  <p className="text-muted-foreground mb-1 flex items-center gap-1"><Brain className="h-3 w-3" /> ML Risk Score</p>
                  <p className={`font-mono p-2 rounded ${selected.mlRiskScore > 0.6 ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>{selected.mlRiskScore.toFixed(2)}</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground mb-1 flex items-center gap-1"><Shield className="h-3 w-3" /> Fraud Check</p>
                  <StatusBadge status={selected.fraudCheckResult} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface ConfigItem { key: string; label: string; value: number; unit: string; min: number; max: number; }

const defaultConfig: ConfigItem[] = [
  { key: "rainThreshold", label: "Rain Threshold", value: 25, unit: "mm/hr", min: 5, max: 100 },
  { key: "rtoThreshold", label: "RTO Threshold", value: 3, unit: "returns", min: 1, max: 10 },
  { key: "delayThreshold", label: "Delay Threshold", value: 30, unit: "minutes", min: 10, max: 120 },
  { key: "maxPayout", label: "Max Payout", value: 500, unit: "₹", min: 50, max: 2000 },
  { key: "premiumCap", label: "Premium Cap", value: 100, unit: "₹/week", min: 20, max: 500 },
  { key: "fraudScoreThreshold", label: "Fraud Score Threshold", value: 0.7, unit: "score", min: 0.1, max: 1.0 },
  { key: "riskScoreThreshold", label: "Risk Score Threshold", value: 0.6, unit: "score", min: 0.1, max: 1.0 },
  { key: "claimCooldown", label: "Claim Cooldown", value: 24, unit: "hours", min: 1, max: 72 },
];

const zones = ["Zone A", "Zone B", "Zone C", "Zone D"];

const zoneDefaults: Record<string, ConfigItem[]> = {
  "Zone A": defaultConfig.map((c) => ({ ...c, value: c.key === "rainThreshold" ? 20 : c.key === "maxPayout" ? 600 : c.key === "fraudScoreThreshold" ? 0.6 : c.value })),
  "Zone B": defaultConfig.map((c) => ({ ...c, value: c.key === "rtoThreshold" ? 4 : c.key === "premiumCap" ? 120 : c.value })),
  "Zone C": defaultConfig.map((c) => ({ ...c, value: c.key === "delayThreshold" ? 45 : c.key === "riskScoreThreshold" ? 0.5 : c.value })),
  "Zone D": defaultConfig,
};

export default function SettingsPage() {
  const [activeZone, setActiveZone] = useState(zones[0]);
  const [configs, setConfigs] = useState<Record<string, ConfigItem[]>>(
    () => Object.fromEntries(zones.map((z) => [z, zoneDefaults[z].map((c) => ({ ...c }))]))
  );

  const update = (key: string, value: number) => {
    setConfigs((prev) => ({ ...prev, [activeZone]: prev[activeZone].map((c) => (c.key === key ? { ...c, value } : c)) }));
  };

  const reset = () => {
    setConfigs((prev) => ({ ...prev, [activeZone]: zoneDefaults[activeZone].map((c) => ({ ...c })) }));
    toast.info(`${activeZone} reset to defaults`);
  };

  const config = configs[activeZone];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Configuration</h1>
          <p className="text-sm text-muted-foreground">Zone-wise thresholds, caps, and system parameters</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3 w-3 mr-1" /> Reset</Button>
          <Button size="sm" onClick={() => toast.success(`${activeZone} configuration saved!`)}><Save className="h-3 w-3 mr-1" /> Save</Button>
        </div>
      </div>
      <div className="flex gap-2">
        {zones.map((zone) => (
          <button key={zone} onClick={() => setActiveZone(zone)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${activeZone === zone ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
            {zone}
          </button>
        ))}
      </div>
      <motion.div key={activeZone} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="grid md:grid-cols-2 gap-4">
        {config.map((item) => (
          <div key={item.key} className="card-glass p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-foreground">{item.label}</label>
              <span className="text-xs font-mono text-primary">{typeof item.value === "number" && item.value < 1 ? item.value.toFixed(1) : item.value} {item.unit}</span>
            </div>
            <input type="range" min={item.min} max={item.max} step={item.max <= 1 ? 0.1 : 1} value={item.value}
              onChange={(e) => update(item.key, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary" />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground font-mono">{item.min}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{item.max}</span>
            </div>
          </div>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card-glass p-5">
        <h2 className="text-sm font-medium text-foreground mb-4">System Status</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {["Weather API","Traffic API","ML Service","Redis Cache"].map((name) => (
            <div key={name} className="flex items-center gap-2 bg-secondary/30 p-3 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
              <span className="text-xs text-foreground">{name}</span>
              <span className="text-[10px] font-mono text-success ml-auto uppercase">operational</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

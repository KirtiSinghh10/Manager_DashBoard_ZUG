"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

const zones = [
  "Whitefield",
  "Koramangala",
  "Indiranagar",
  "HSR Layout",
  "Electronic City",
  "Marathahalli",
  "Jayanagar",
  "BTM Layout",
];

const metrics = ["Claims", "Fraud %", "Avg Payout", "Risk Score", "RTO Rate", "Rain Triggers", "Delay Triggers", "Trust Score"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateData() {
  return zones.map((zone, zi) => {
    const vals = metrics.map((metric, mi) => {
      const seed = zi * 17 + mi * 31;
      const r = seededRandom(seed);
      switch (mi) {
        case 0: return Math.round(12 + r * 35); // Claims count
        case 1: return Math.round(3 + r * 25);  // Fraud %
        case 2: return Math.round(80 + r * 140); // Avg Payout ₹
        case 3: return Math.round(10 + r * 80);  // Risk Score 0-100
        case 4: return Math.round(5 + r * 30);   // RTO Rate %
        case 5: return Math.round(2 + r * 20);   // Rain Triggers
        case 6: return Math.round(3 + r * 18);   // Delay Triggers
        case 7: return Math.round(20 + r * 75);  // Trust Score 0-100
        default: return 0;
      }
    });
    return { zone, values: vals };
  });
}

// Each metric has its own scale — define what's "good" vs "bad"
const metricConfig: { min: number; max: number; invertColor?: boolean; format: (v: number) => string }[] = [
  { min: 10, max: 45, format: (v) => `${v}` },                    // Claims — neutral, higher = more activity
  { min: 0, max: 28, format: (v) => `${v}%` },                     // Fraud % — high is bad
  { min: 80, max: 220, format: (v) => `₹${v}` },                  // Avg Payout — neutral
  { min: 10, max: 90, format: (v) => `${v}` },                     // Risk Score — high is bad
  { min: 5, max: 35, format: (v) => `${v}%` },                     // RTO Rate — high is bad
  { min: 2, max: 22, format: (v) => `${v}` },                      // Rain Triggers — neutral
  { min: 3, max: 21, format: (v) => `${v}` },                      // Delay Triggers — neutral
  { min: 20, max: 95, invertColor: true, format: (v) => `${v}` },  // Trust Score — high is good
];

function getCellColor(value: number, metricIdx: number): string {
  const cfg = metricConfig[metricIdx];
  let ratio = (value - cfg.min) / (cfg.max - cfg.min);
  ratio = Math.max(0, Math.min(1, ratio));
  if (cfg.invertColor) ratio = 1 - ratio; // Flip for "high is good"

  // Green (good) → Yellow → Orange → Red (bad)
  if (ratio <= 0.25) return `hsl(142, 55%, ${38 + ratio * 30}%)`;
  if (ratio <= 0.5) return `hsl(${142 - (ratio - 0.25) * 320}, 55%, 45%)`;
  if (ratio <= 0.75) return `hsl(${62 - (ratio - 0.5) * 160}, 65%, 48%)`;
  return `hsl(${22 - (ratio - 0.75) * 88}, 72%, ${50 - (ratio - 0.75) * 10}%)`;
}

export default function Heatmap() {
  const data = useMemo(() => generateData(), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Zone Performance Heatmap</h1>
        <p className="text-sm text-muted-foreground">
          Cross-metric comparison across Bengaluru zones — green is favorable, red needs attention
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass p-5 overflow-x-auto"
      >
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="text-left py-2.5 px-3 text-muted-foreground font-semibold min-w-[130px] bg-muted/40 rounded-tl-lg border-b border-border/30">
                Zone
              </th>
              {metrics.map((m, i) => (
                <th
                  key={m}
                  className={`text-center py-2.5 px-2 text-muted-foreground font-semibold min-w-[85px] bg-muted/40 border-b border-border/30 ${i === metrics.length - 1 ? "rounded-tr-lg" : ""}`}
                >
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <motion.tr
                key={row.zone}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ri * 0.05, type: "spring", stiffness: 200 }}
                className="border-b border-border/20 last:border-0 hover:bg-muted/10 transition-colors"
              >
                <td className="py-2 px-3 font-medium text-foreground whitespace-nowrap">
                  {row.zone}
                </td>
                {row.values.map((val, mi) => (
                  <td key={mi} className="py-1.5 px-1 text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: ri * 0.05 + mi * 0.03 }}
                      className="mx-auto rounded py-2 px-1.5 font-mono font-semibold text-[11px] cursor-default transition-transform hover:scale-110 hover:shadow-md"
                      style={{
                        backgroundColor: getCellColor(val, mi),
                        color: "white",
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                      title={`${row.zone} — ${metrics[mi]}: ${metricConfig[mi].format(val)}`}
                    >
                      {metricConfig[mi].format(val)}
                    </motion.div>
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-wrap items-center gap-5 mt-5 pt-4 border-t border-border/30">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Scale:</span>
          {[
            { label: "Favorable", color: "hsl(142, 55%, 40%)" },
            { label: "Moderate", color: "hsl(62, 55%, 45%)" },
            { label: "Elevated", color: "hsl(32, 65%, 48%)" },
            { label: "Critical", color: "hsl(0, 72%, 48%)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
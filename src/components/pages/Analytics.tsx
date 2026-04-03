"use client";
import { motion } from "framer-motion";
import { zoneRiskData, riskDistributionData, payoutChartData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["hsl(0, 85%, 60%)", "hsl(38, 100%, 60%)", "hsl(170, 90%, 50%)", "hsl(160, 70%, 48%)"];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Risk & Analytics</h1>
        <p className="text-sm text-muted-foreground">Zone analysis, weather impact, and risk distribution</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-glass p-5">
          <h2 className="text-sm font-medium text-foreground mb-4">Zone Risk Analysis</h2>
          <div className="space-y-3">
            {zoneRiskData.map((z) => (
              <div key={z.zone} className="flex items-center gap-3">
                <span className="text-xs font-mono w-16 text-muted-foreground">{z.zone}</span>
                <div className="flex-1 h-6 bg-secondary/30 rounded overflow-hidden">
                  <div className="h-full rounded transition-all" style={{ width: `${z.risk * 100}%`, backgroundColor: z.risk > 0.6 ? "hsl(0, 85%, 60%)" : z.risk > 0.4 ? "hsl(38, 100%, 60%)" : "hsl(160, 70%, 48%)" }} />
                </div>
                <span className="text-xs font-mono w-10 text-right">{(z.risk * 100).toFixed(0)}%</span>
                <span className="text-[10px] text-muted-foreground w-20">{z.workers} workers</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card-glass p-5">
          <h2 className="text-sm font-medium text-foreground mb-4">Risk Score Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 20%, 20%)" />
              <XAxis dataKey="range" stroke="hsl(220, 15%, 55%)" fontSize={10} />
              <YAxis stroke="hsl(220, 15%, 55%)" fontSize={10} />
              <Tooltip contentStyle={{ background: "hsl(230, 25%, 11%)", border: "1px solid hsl(230, 20%, 20%)", borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="count" fill="hsl(170, 90%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card-glass p-5">
          <h2 className="text-sm font-medium text-foreground mb-4">Auto-Triggers vs Payouts</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={payoutChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 20%, 20%)" />
              <XAxis dataKey="date" stroke="hsl(220, 15%, 55%)" fontSize={10} />
              <YAxis yAxisId="left" stroke="hsl(170, 90%, 50%)" fontSize={10} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(38, 100%, 60%)" fontSize={10} />
              <Tooltip contentStyle={{ background: "hsl(230, 25%, 11%)", border: "1px solid hsl(230, 20%, 20%)", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar yAxisId="left" dataKey="payouts" name="Payouts (₹)" fill="hsl(170, 90%, 50%)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="claims" name="Auto-Triggers" fill="hsl(38, 100%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="card-glass p-5">
          <h2 className="text-sm font-medium text-foreground mb-4">Triggers by Zone</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={zoneRiskData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="claims" nameKey="zone">
                {zoneRiskData.map((_, idx) => (<Cell key={idx} fill={COLORS[idx % COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(230, 25%, 11%)", border: "1px solid hsl(230, 20%, 20%)", borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {zoneRiskData.map((z, i) => (
              <div key={z.zone} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {z.zone}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

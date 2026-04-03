"use client";
import { DollarSign, AlertTriangle, BarChart3, ShieldAlert, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { KpiCard } from "@/components/KpiCard";
import { payoutChartData, liveEvents, claims, fraudAlerts } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const eventIcons = { trigger: "🌧", claim: "💰", fraud: "🚨", system: "⚙️" };
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } } };

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200 }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 glow-primary">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
            <p className="text-sm text-muted-foreground">Real-time overview of payouts, risks, and fraud detection</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <motion.div variants={itemVariants}><KpiCard icon={DollarSign} title="Payouts Today" value="₹19,800" trend="up" trendValue="8%" variant="success" /></motion.div>
        <motion.div variants={itemVariants}><KpiCard icon={AlertTriangle} title="Active Incidents" value={fraudAlerts.filter((f) => f.status !== "cleared").length} variant="warning" /></motion.div>
        <motion.div variants={itemVariants}><KpiCard icon={BarChart3} title="Avg Risk Score" value="0.38" trend="down" trendValue="5%" variant="default" /></motion.div>
        <motion.div variants={itemVariants}><KpiCard icon={ShieldAlert} title="Fraud Alerts" value={fraudAlerts.length} variant="danger" /></motion.div>
        <motion.div variants={itemVariants}><KpiCard icon={TrendingUp} title="Auto-Triggers" value={claims.length} trend="up" trendValue="15%" variant="primary" /></motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-2 card-glass p-5">
          <h2 className="text-sm font-medium text-foreground mb-4">Payouts Over Time</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={payoutChartData}>
              <defs>
                <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(170, 90%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(170, 90%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 20%, 20%)" />
              <XAxis dataKey="date" stroke="hsl(220, 15%, 55%)" fontSize={11} />
              <YAxis stroke="hsl(220, 15%, 55%)" fontSize={11} />
              <Tooltip contentStyle={{ background: "hsl(230, 25%, 11%)", border: "1px solid hsl(230, 20%, 20%)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="payouts" stroke="hsl(170, 90%, 50%)" fill="url(#payoutGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="card-glass p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
            <h2 className="text-sm font-medium text-foreground">Live Events</h2>
          </div>
          <div className="space-y-2 max-h-[240px] overflow-auto scrollbar-thin">
            {liveEvents.slice(0, 8).map((evt) => (
              <div key={evt.id} className="flex items-start gap-2 p-2 rounded bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <span className="text-sm mt-0.5">{eventIcons[evt.type]}</span>
                <div className="min-w-0">
                  <p className="text-[11px] text-foreground leading-snug">{evt.message}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{evt.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="card-glass p-5">
        <h2 className="text-sm font-medium text-foreground mb-4">Recent Auto-Triggered Claims</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-2 px-3 font-medium">ID</th>
                <th className="text-left py-2 px-3 font-medium">Worker</th>
                <th className="text-left py-2 px-3 font-medium">Trigger</th>
                <th className="text-left py-2 px-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {claims.slice(0, 5).map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.06 }}
                  className="border-b border-border/50 hover:bg-primary/5 transition-colors group">
                  <td className="py-2.5 px-3 font-mono text-primary">{c.id}</td>
                  <td className="py-2.5 px-3 group-hover:text-foreground transition-colors">{c.workerName}</td>
                  <td className="py-2.5 px-3 uppercase font-mono">{c.eventType === "rain" ? "🌧" : c.eventType === "rto" ? "📦" : "⏱"} {c.eventType}</td>
                  <td className="py-2.5 px-3 font-mono text-success">₹{c.payoutAmount}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

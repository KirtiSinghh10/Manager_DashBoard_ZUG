"use client";
import { motion } from "framer-motion";
import { zoneRiskData, riskDistributionData, payoutChartData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend, Line } from "recharts";
import { TrendingDown, TrendingUp, ArrowRight } from "lucide-react";

const COLORS = ["hsl(0, 85%, 60%)", "hsl(38, 100%, 60%)", "hsl(170, 90%, 50%)", "hsl(160, 70%, 48%)"];

const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11, color: "hsl(var(--foreground))" };

const weeklyHistorical = [
  { week: "W1", premiums: 14200, payouts: 8900, net: 5300 },
  { week: "W2", premiums: 15100, payouts: 11200, net: 3900 },
  { week: "W3", premiums: 14800, payouts: 9600, net: 5200 },
  { week: "W4", premiums: 15400, payouts: 12800, net: 2600 },
  { week: "W5", premiums: 15000, payouts: 10400, net: 4600 },
  { week: "W6", premiums: 15600, payouts: 13100, net: 2500 },
];

const forecastNext = (data: number[]) => {
  const n = data.length;
  const xMean = (n - 1) / 2;
  const yMean = data.reduce((a, b) => a + b, 0) / n;
  const slope = data.reduce((acc, y, x) => acc + (x - xMean) * (y - yMean), 0) / data.reduce((acc, _, x) => acc + (x - xMean) ** 2, 0);
  return Math.round(yMean + slope * n);
};

const forecastedPayouts = forecastNext(weeklyHistorical.map(w => w.payouts));
const forecastedPremiums = forecastNext(weeklyHistorical.map(w => w.premiums));
const forecastedNet = forecastedPremiums - forecastedPayouts;

const forecastData = [
  ...weeklyHistorical,
  { week: "W7 (Forecast)", premiums: forecastedPremiums, payouts: forecastedPayouts, net: forecastedNet },
];

const zoneLossData = zoneRiskData.map(z => ({
  zone: z.zone,
  premiumsCollected: Math.round(z.workers * 48 * 7),
  payoutsIssued: Math.round(z.claims * 95),
  netPosition: Math.round(z.workers * 48 * 7 - z.claims * 95),
  lossRatio: ((z.claims * 95) / (z.workers * 48 * 7) * 100).toFixed(1),
}));

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Risk & Analytics</h1>
        <p className="text-sm text-muted-foreground">Zone analysis, weather impact, and risk distribution</p>
      </div>

      {/* Forecast KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            Forecasted Losses (W7)
          </div>
          <p className="text-xl font-bold text-destructive">&#8377;{forecastedPayouts.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Based on 6-week regression</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-glass p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            Forecasted Gains (W7)
          </div>
          <p className="text-xl font-bold text-success">&#8377;{forecastedPremiums.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Premium collections</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <ArrowRight className="h-3.5 w-3.5 text-accent" />
            Forecasted Net (W7)
          </div>
          <p className={`text-xl font-bold ${forecastedNet >= 0 ? "text-success" : "text-destructive"}`}>
            {forecastedNet >= 0 ? "+" : ""}&#8377;{forecastedNet.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Gains minus Losses</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Weekly Loss Forecast */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-glass p-5">
          <h2 className="text-sm font-medium text-foreground mb-4">Weekly Loss Forecast</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="gradPayouts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 85%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 85%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradPremiums" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 70%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 70%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 20%, 20%)" />
              <XAxis dataKey="week" stroke="hsl(220, 15%, 55%)" fontSize={10} />
              <YAxis stroke="hsl(220, 15%, 55%)" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="premiums" name="Premiums" stroke="hsl(160, 70%, 48%)" fill="url(#gradPremiums)" strokeWidth={2} />
              <Area type="monotone" dataKey="payouts" name="Payouts" stroke="hsl(0, 85%, 60%)" fill="url(#gradPayouts)" strokeWidth={2} />
              <Line type="monotone" dataKey="net" name="Net" stroke="hsl(38, 100%, 60%)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Zone Loss Ratio */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card-glass p-5">
          <h2 className="text-sm font-medium text-foreground mb-4">Zone-Wise Loss Ratio</h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left py-2 font-medium">Zone</th>
                <th className="text-right py-2 font-medium">Premiums</th>
                <th className="text-right py-2 font-medium">Payouts</th>
                <th className="text-right py-2 font-medium">Net</th>
                <th className="text-right py-2 font-medium">Loss %</th>
              </tr>
            </thead>
            <tbody>
              {zoneLossData.map(z => (
                <tr key={z.zone} className="border-b border-border/50">
                  <td className="py-2 font-mono">{z.zone}</td>
                  <td className="py-2 text-right text-success">&#8377;{z.premiumsCollected.toLocaleString()}</td>
                  <td className="py-2 text-right text-destructive">&#8377;{z.payoutsIssued.toLocaleString()}</td>
                  <td className={`py-2 text-right font-semibold ${z.netPosition >= 0 ? "text-success" : "text-destructive"}`}>
                    {z.netPosition >= 0 ? "+" : ""}&#8377;{z.netPosition.toLocaleString()}
                  </td>
                  <td className="py-2 text-right">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${parseFloat(z.lossRatio) > 60 ? "bg-destructive/20 text-destructive" : parseFloat(z.lossRatio) > 40 ? "bg-accent/20 text-accent" : "bg-success/20 text-success"}`}>
                      {z.lossRatio}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Zone Risk Analysis — original */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card-glass p-5">
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

        {/* Risk Score Distribution — original */}
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

        {/* Auto-Triggers vs Payouts — original */}
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

        {/* Triggers by Zone — original */}
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
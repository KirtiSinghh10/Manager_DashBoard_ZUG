"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { zoneRiskData, riskDistributionData, payoutChartData } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, Legend, Line
} from "recharts";
import { TrendingDown, TrendingUp, ArrowRight } from "lucide-react";

const COLORS = [
  "hsl(0, 85%, 60%)",
  "hsl(38, 100%, 60%)",
  "hsl(170, 90%, 50%)",
  "hsl(160, 70%, 48%)"
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 11,
  color: "hsl(var(--foreground))"
};

export default function Analytics() {

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [forecast, setForecast] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
       const dashboardRes = await fetch(`${BASE_URL}/dashboard`);

        const dashboard = await dashboardRes.json();

       const forecastRes = await fetch(`${BASE_URL}/forecast`);
        const forecastData = await forecastRes.json();

        setWeeklyData(dashboard.weekly || []);
        setForecast(forecastData.next_week_prediction);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }

    loadData();
  }, [BASE_URL]);

  // 🔥 Transform backend → chart format
  const chartData = weeklyData.map((w, i) => ({
    week: `W${i + 1}`,
    premiums: w.revenue,
    payouts: 0,
    net: w.profit,
  }));

  const finalChartData = forecast
    ? [
        ...chartData,
        {
          week: `W${chartData.length + 1} (Forecast)`,
          premiums: forecast,
          payouts: 0,
          net: forecast,
        },
      ]
    : chartData;

  const zoneLossData = zoneRiskData.map(z => ({
    zone: z.zone,
    premiumsCollected: Math.round(z.workers * 48 * 7),
    payoutsIssued: Math.round(z.claims * 95),
    netPosition: Math.round(z.workers * 48 * 7 - z.claims * 95),
    lossRatio: ((z.claims * 95) / (z.workers * 48 * 7) * 100).toFixed(1),
  }));

  if (!weeklyData.length) {
  return <div className="p-6 text-sm text-muted-foreground">Loading analytics...</div>;
}

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold text-foreground">Risk & Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Zone analysis, weather impact, and risk distribution
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-3 gap-4">

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            Forecasted Losses
          </div>
          <p className="text-xl font-bold text-destructive">
            ₹{forecast ? forecast.toLocaleString() : "..."}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-glass p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            Forecasted Gains
          </div>
          <p className="text-xl font-bold text-success">
            ₹{forecast ? forecast.toLocaleString() : "..."}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <ArrowRight className="h-3.5 w-3.5 text-accent" />
            Forecasted Net
          </div>
          <p className="text-xl font-bold text-accent">
            ₹{forecast ? forecast.toLocaleString() : "..."}
          </p>
        </motion.div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* CHART */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-glass p-5">
          <h2 className="text-sm font-medium text-foreground mb-4">Weekly Loss Forecast</h2>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={finalChartData}>

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
              <XAxis dataKey="week" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 10 }} />

              <Area type="monotone" dataKey="premiums" stroke="hsl(160, 70%, 48%)" fill="url(#gradPremiums)" />
              <Area type="monotone" dataKey="payouts" stroke="hsl(0, 85%, 60%)" fill="url(#gradPayouts)" />
              <Line type="monotone" dataKey="net" stroke="hsl(38, 100%, 60%)" strokeDasharray="5 5" />

            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* KEEP REST AS IS */}
        <motion.div className="card-glass p-5">
          <h2 className="text-sm font-medium mb-4">Zone-Wise Loss Ratio</h2>
          <table className="w-full text-xs">
            <tbody>
              {zoneLossData.map(z => (
                <tr key={z.zone}>
                  <td>{z.zone}</td>
                  <td>₹{z.premiumsCollected}</td>
                  <td>₹{z.payoutsIssued}</td>
                  <td>₹{z.netPosition}</td>
                  <td>{z.lossRatio}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

      </div>
    </div>
  );
}
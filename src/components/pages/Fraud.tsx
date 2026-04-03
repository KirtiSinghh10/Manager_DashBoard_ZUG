"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { fraudAlerts, claims, workers } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldX, Search as SearchIcon, MapPin, Clock, AlertTriangle, User, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FraudAlert } from "@/data/mockData";

export default function Fraud() {
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const getRelatedClaim = (claimId: string) => claims.find((c) => c.id === claimId);
  const getRelatedWorker = (workerId: string) => workers.find((w) => w.id === workerId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Fraud Detection</h1>
        <p className="text-sm text-muted-foreground">{fraudAlerts.length} active alerts</p>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-glass p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                {["ID","Worker","Score","Reason","Claim","Time","Status","Actions"].map(h => (
                  <th key={h} className="text-left py-1.5 px-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fraudAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-2 px-2 font-mono text-primary text-[11px]">{alert.id}</td>
                  <td className="py-2 px-2 text-[11px]">
                    <span className="text-foreground">{alert.workerName}</span>
                    <span className="text-muted-foreground font-mono text-[10px] ml-1">({alert.workerId})</span>
                  </td>
                  <td className="py-2 px-2">
                    <span className={`font-mono font-semibold text-[11px] ${alert.fraudScore >= 0.7 ? "text-destructive" : alert.fraudScore >= 0.4 ? "text-accent" : "text-success"}`}>
                      {alert.fraudScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-muted-foreground text-[11px] max-w-[200px] truncate">{alert.reason}</td>
                  <td className="py-2 px-2 font-mono text-primary text-[11px]">{alert.claimId}</td>
                  <td className="py-2 px-2 font-mono text-muted-foreground text-[10px] whitespace-nowrap">{alert.timestamp.split(" ")[1]}</td>
                  <td className="py-2 px-2"><StatusBadge status={alert.status} /></td>
                  <td className="py-2 px-2">
                    <div className="flex gap-0.5">
                      <Button size="sm" variant="ghost" className="h-6 px-1.5 text-[10px] text-success hover:text-success hover:bg-success/10"><ShieldCheck className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" className="h-6 px-1.5 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10"><ShieldX className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" className="h-6 px-1.5 text-[10px]" onClick={() => setSelectedAlert(alert)}><SearchIcon className="h-3 w-3" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Fraud Investigation — {selectedAlert?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedAlert && (() => {
            const claim = getRelatedClaim(selectedAlert.claimId);
            const worker = getRelatedWorker(selectedAlert.workerId);
            return (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-foreground">Fraud Score</span>
                    <span className={`text-lg font-mono font-bold ${selectedAlert.fraudScore >= 0.7 ? "text-destructive" : "text-accent"}`}>{selectedAlert.fraudScore.toFixed(2)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${selectedAlert.fraudScore >= 0.7 ? "bg-destructive" : "bg-accent"}`} style={{ width: `${selectedAlert.fraudScore * 100}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex items-center gap-1.5 mb-1"><User className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-[10px] text-muted-foreground uppercase font-medium">Worker</span></div>
                    <p className="text-sm font-medium text-foreground">{selectedAlert.workerName}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{selectedAlert.workerId}</p>
                    {worker && (<><p className="text-[11px] text-muted-foreground mt-1">e-Shram: {worker.eshramId}</p><p className="text-[11px] text-muted-foreground">Trust Score: <span className="font-mono text-foreground">{worker.trustScore.toFixed(2)}</span></p></>)}
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="flex items-center gap-1.5 mb-1"><FileText className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-[10px] text-muted-foreground uppercase font-medium">Linked Claim</span></div>
                    <p className="text-sm font-mono font-medium text-primary">{selectedAlert.claimId}</p>
                    {claim && (<><p className="text-[11px] text-muted-foreground mt-1">Type: <span className="uppercase font-mono text-foreground">{claim.eventType}</span></p><p className="text-[11px] text-muted-foreground">Payout: <span className="font-mono text-success">₹{claim.payoutAmount}</span></p></>)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border">
                    <AlertTriangle className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                    <div><span className="text-[10px] text-muted-foreground uppercase font-medium">Reason</span><p className="text-xs text-foreground">{selectedAlert.reason}</p></div>
                  </div>
                  {claim && (<>
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border">
                      <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <div><span className="text-[10px] text-muted-foreground uppercase font-medium">Location</span><p className="text-xs text-foreground">{claim.location}</p></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[["Weather", claim.weatherData], ["Traffic", claim.trafficData], ["RTO Count", String(claim.rtoCount)]].map(([label, val]) => (
                        <div key={label} className="p-2 rounded-lg bg-secondary/30 border border-border text-center">
                          <span className="text-[10px] text-muted-foreground block">{label}</span>
                          <span className="text-[11px] font-mono text-foreground">{val}</span>
                        </div>
                      ))}
                    </div>
                  </>)}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /><span>Flagged at {selectedAlert.timestamp}</span>
                  <span className="ml-auto"><StatusBadge status={selectedAlert.status} /></span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground text-xs gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Clear Alert</Button>
                  <Button size="sm" variant="destructive" className="flex-1 text-xs gap-1.5"><ShieldX className="h-3.5 w-3.5" /> Confirm Fraud</Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export interface Worker {
  id: string;
  name: string;
  eshramId: string;
  status: "active" | "idle" | "flagged";
  riskScore: number;
  fraudScore: number;
  trustScore: number;
  weeklyPremium: number;
  totalClaims: number;
  zone: string;
}

export interface Claim {
  id: string;
  workerId: string;
  workerName: string;
  eventType: "rain" | "rto" | "delay";
  triggerMet: boolean;
  payoutAmount: number;
  status: "approved" | "rejected" | "pending";
  timestamp: string;
  location: string;
  weatherData: string;
  trafficData: string;
  rtoCount: number;
  mlRiskScore: number;
  fraudCheckResult: "pass" | "fail" | "review";
}

export interface FraudAlert {
  id: string;
  workerId: string;
  workerName: string;
  fraudScore: number;
  reason: string;
  claimId: string;
  timestamp: string;
  status: "pending" | "investigating" | "cleared" | "confirmed";
}

export interface LiveEvent {
  id: string;
  timestamp: string;
  type: "trigger" | "claim" | "fraud" | "system";
  message: string;
  zone: string;
}

export const workers: Worker[] = [
  { id: "W-001", name: "Rajesh Kumar", eshramId: "ESH-2024-001", status: "active", riskScore: 0.23, fraudScore: 0.12, trustScore: 0.88, weeklyPremium: 45, totalClaims: 12, zone: "Whitefield" },
  { id: "W-002", name: "Priya Sharma", eshramId: "ESH-2024-002", status: "active", riskScore: 0.15, fraudScore: 0.05, trustScore: 0.95, weeklyPremium: 40, totalClaims: 8, zone: "Koramangala" },
  { id: "W-003", name: "Amit Patel", eshramId: "ESH-2024-003", status: "flagged", riskScore: 0.78, fraudScore: 0.87, trustScore: 0.22, weeklyPremium: 65, totalClaims: 34, zone: "Indiranagar" },
  { id: "W-004", name: "Sunita Devi", eshramId: "ESH-2024-004", status: "idle", riskScore: 0.31, fraudScore: 0.18, trustScore: 0.72, weeklyPremium: 50, totalClaims: 15, zone: "HSR Layout" },
  { id: "W-005", name: "Mohammed Ali", eshramId: "ESH-2024-005", status: "active", riskScore: 0.42, fraudScore: 0.35, trustScore: 0.65, weeklyPremium: 55, totalClaims: 21, zone: "Electronic City" },
  { id: "W-006", name: "Kavita Singh", eshramId: "ESH-2024-006", status: "active", riskScore: 0.19, fraudScore: 0.08, trustScore: 0.91, weeklyPremium: 42, totalClaims: 6, zone: "Marathahalli" },
  { id: "W-007", name: "Vikram Rao", eshramId: "ESH-2024-007", status: "flagged", riskScore: 0.82, fraudScore: 0.91, trustScore: 0.15, weeklyPremium: 70, totalClaims: 42, zone: "Jayanagar" },
  { id: "W-008", name: "Deepa Nair", eshramId: "ESH-2024-008", status: "active", riskScore: 0.27, fraudScore: 0.14, trustScore: 0.83, weeklyPremium: 48, totalClaims: 10, zone: "BTM Layout" },
];

export const claims: Claim[] = [
  { id: "CLM-001", workerId: "W-001", workerName: "Rajesh Kumar", eventType: "rain", triggerMet: true, payoutAmount: 180, status: "approved", timestamp: "2024-03-25 10:32:00", location: "Bengaluru - Whitefield", weatherData: "Rainfall: 45mm/hr", trafficData: "Heavy congestion on ITPL Road", rtoCount: 0, mlRiskScore: 0.18, fraudCheckResult: "pass" },
  { id: "CLM-002", workerId: "W-003", workerName: "Amit Patel", eventType: "rto", triggerMet: true, payoutAmount: 120, status: "pending", timestamp: "2024-03-25 10:45:00", location: "Bengaluru - Indiranagar", weatherData: "Clear", trafficData: "Moderate on 100 Feet Road", rtoCount: 5, mlRiskScore: 0.72, fraudCheckResult: "review" },
  { id: "CLM-003", workerId: "W-002", workerName: "Priya Sharma", eventType: "delay", triggerMet: true, payoutAmount: 90, status: "approved", timestamp: "2024-03-25 11:00:00", location: "Bengaluru - Koramangala", weatherData: "Overcast", trafficData: "Severe congestion on Hosur Road", rtoCount: 1, mlRiskScore: 0.15, fraudCheckResult: "pass" },
  { id: "CLM-004", workerId: "W-007", workerName: "Vikram Rao", eventType: "rain", triggerMet: false, payoutAmount: 0, status: "rejected", timestamp: "2024-03-25 11:15:00", location: "Bengaluru - Jayanagar", weatherData: "Light drizzle: 5mm/hr", trafficData: "Normal on South End Circle", rtoCount: 0, mlRiskScore: 0.88, fraudCheckResult: "fail" },
  { id: "CLM-005", workerId: "W-005", workerName: "Mohammed Ali", eventType: "rto", triggerMet: true, payoutAmount: 150, status: "pending", timestamp: "2024-03-25 11:30:00", location: "Bengaluru - Electronic City", weatherData: "Clear", trafficData: "Light on Hosur Road", rtoCount: 3, mlRiskScore: 0.38, fraudCheckResult: "pass" },
  { id: "CLM-006", workerId: "W-004", workerName: "Sunita Devi", eventType: "delay", triggerMet: true, payoutAmount: 110, status: "approved", timestamp: "2024-03-25 12:00:00", location: "Bengaluru - HSR Layout", weatherData: "Partly cloudy", trafficData: "Heavy on Outer Ring Road", rtoCount: 2, mlRiskScore: 0.28, fraudCheckResult: "pass" },
];

export const fraudAlerts: FraudAlert[] = [
  { id: "FRD-001", workerId: "W-003", workerName: "Amit Patel", fraudScore: 0.87, reason: "High claim frequency + abnormal GPS movement in Indiranagar", claimId: "CLM-002", timestamp: "2024-03-25 10:48:00", status: "pending" },
  { id: "FRD-002", workerId: "W-007", workerName: "Vikram Rao", fraudScore: 0.91, reason: "Sensor data mismatch + claim during non-working hours in Jayanagar", claimId: "CLM-004", timestamp: "2024-03-25 11:18:00", status: "investigating" },
  { id: "FRD-003", workerId: "W-005", workerName: "Mohammed Ali", fraudScore: 0.45, reason: "Unusual RTO pattern in Electronic City low-return zone", claimId: "CLM-005", timestamp: "2024-03-25 11:35:00", status: "pending" },
];

export const liveEvents: LiveEvent[] = [
  { id: "EVT-001", timestamp: "10:32 AM", type: "trigger", message: "Rain trigger detected → User W-001 (Rajesh Kumar) → Whitefield", zone: "Whitefield" },
  { id: "EVT-002", timestamp: "10:33 AM", type: "claim", message: "Claim processed → ₹180 → CLM-001", zone: "Whitefield" },
  { id: "EVT-003", timestamp: "10:35 AM", type: "fraud", message: "Fraud flagged → User W-003 (Amit Patel) → Score: 0.87", zone: "Indiranagar" },
  { id: "EVT-004", timestamp: "10:45 AM", type: "claim", message: "RTO claim submitted → User W-003 → ₹120", zone: "Indiranagar" },
  { id: "EVT-005", timestamp: "10:48 AM", type: "fraud", message: "GPS anomaly detected → User W-003 → Indiranagar", zone: "Indiranagar" },
  { id: "EVT-006", timestamp: "11:00 AM", type: "trigger", message: "Delay trigger detected → User W-002 (Priya Sharma) → Koramangala", zone: "Koramangala" },
  { id: "EVT-007", timestamp: "11:01 AM", type: "claim", message: "Claim auto-approved → ₹90 → CLM-003", zone: "Koramangala" },
  { id: "EVT-008", timestamp: "11:15 AM", type: "system", message: "Weather API refreshed → Bengaluru zones updated", zone: "HSR Layout" },
  { id: "EVT-009", timestamp: "11:18 AM", type: "fraud", message: "Sensor mismatch → User W-007 (Vikram Rao) → Score: 0.91", zone: "Jayanagar" },
  { id: "EVT-010", timestamp: "11:30 AM", type: "trigger", message: "RTO trigger detected → User W-005 (Mohammed Ali) → E-City", zone: "Electronic City" },
  { id: "EVT-011", timestamp: "11:35 AM", type: "system", message: "ML model recalibrated → Bengaluru risk scores updated", zone: "Marathahalli" },
  { id: "EVT-012", timestamp: "12:00 PM", type: "claim", message: "Claim processed → ₹110 → CLM-006", zone: "HSR Layout" },
];

export const payoutChartData = [
  { date: "Mon", payouts: 2400, claims: 18 },
  { date: "Tue", payouts: 1800, claims: 14 },
  { date: "Wed", payouts: 3200, claims: 24 },
  { date: "Thu", payouts: 2800, claims: 21 },
  { date: "Fri", payouts: 4100, claims: 31 },
  { date: "Sat", payouts: 3500, claims: 26 },
  { date: "Sun", payouts: 2100, claims: 16 },
];

export const zoneRiskData = [
  { zone: "Whitefield", risk: 0.72, workers: 45, claims: 128, color: "hsl(0, 72%, 55%)" },
  { zone: "Koramangala", risk: 0.35, workers: 62, claims: 89, color: "hsl(45, 93%, 58%)" },
  { zone: "Electronic City", risk: 0.58, workers: 38, claims: 104, color: "hsl(45, 93%, 58%)" },
  { zone: "HSR Layout", risk: 0.21, workers: 55, claims: 45, color: "hsl(152, 60%, 45%)" },
];

export const riskDistributionData = [
  { range: "0-0.2", count: 45 },
  { range: "0.2-0.4", count: 32 },
  { range: "0.4-0.6", count: 18 },
  { range: "0.6-0.8", count: 8 },
  { range: "0.8-1.0", count: 3 },
];

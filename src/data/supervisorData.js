// Dummy data for the Supervisor Dashboard.
// Shapes mirror what a real fleet-telemetry API would likely return,
// so swapping this for a live data source later is a drop-in change.

export const KPI_SUMMARY = {
  productionToday: {
    value: 18420,
    unit: "tonnes",
    target: 20000,
    deltaPct: 4.2,
    trend: "up",
  },
  peiScore: {
    // Production Efficiency Index
    value: 87.3,
    unit: "pts",
    deltaPct: 2.1,
    trend: "up",
  },
  fleetUtilization: {
    value: 82,
    unit: "%",
    deltaPct: -1.4,
    trend: "down",
  },
  fuelEfficiency: {
    value: 3.42,
    unit: "L/t",
    deltaPct: 0.8,
    trend: "up",
  },
};

export const PRODUCTION_TREND = [
  { day: "Mon", tonnes: 16800, target: 20000 },
  { day: "Tue", tonnes: 17950, target: 20000 },
  { day: "Wed", tonnes: 15200, target: 20000 },
  { day: "Thu", tonnes: 19100, target: 20000 },
  { day: "Fri", tonnes: 18420, target: 20000 },
  { day: "Sat", tonnes: 20650, target: 20000 },
  { day: "Sun", tonnes: 19880, target: 20000 },
];

export const PRODUCTION_LOSS_BREAKDOWN = [
  {
    reason: "Unplanned maintenance",
    hours: 4.2,
    color: "var(--color-destructive)",
    affectedUnits: ["HT-041", "DR-004"],
    detail: "HT-041 brake fault and DR-004 hydraulic line issue both required emergency stoppage mid-shift.",
  },
  {
    reason: "Shift change idle",
    hours: 2.6,
    color: "var(--color-warning)",
    affectedUnits: ["HT-029", "HT-033", "EX-103"],
    detail: "Handover briefing ran long at the 14:00 shift change, leaving 3 units idle for 12-18 minutes each.",
  },
  {
    reason: "Weather delay",
    hours: 1.8,
    color: "var(--color-chart-2)",
    affectedUnits: ["All Pit A units"],
    detail: "Pit A haul road closed for 2 hours after heavy rain made the grade unsafe for loaded haul trucks.",
  },
  {
    reason: "Material congestion",
    hours: 1.1,
    color: "var(--color-chart-4)",
    affectedUnits: ["HT-029", "HT-052"],
    detail: "Queue backup at the crusher feed during peak production hours, two haul trucks waiting to dump.",
  },
  {
    reason: "Planned downtime",
    hours: 3.0,
    color: "var(--color-muted-foreground)",
    affectedUnits: ["EX-107", "DZ-008"],
    detail: "Scheduled 250-hour service interval for two units — anticipated and budgeted into today's plan.",
  },
];

export const FLEET_UNITS = [
  { id: "EX-107", type: "excavator", status: "active", zone: "Pit A — North Bench", load: 92, x: 28, y: 34, operator: "Andi Pratama", hoursToday: 7.4, fuelPct: 68, model: "Komatsu PC2000" },
  { id: "HT-033", type: "haul-truck", status: "active", zone: "Pit A — Haul Road 2", load: 78, x: 41, y: 46, operator: "Siti Rahma", hoursToday: 6.9, fuelPct: 54, model: "Caterpillar 793F" },
  { id: "HT-029", type: "haul-truck", status: "active", zone: "Pit B — Ramp 3", load: 65, x: 63, y: 28, operator: "Budi Santoso", hoursToday: 8.1, fuelPct: 41, model: "Caterpillar 793F" },
  { id: "EX-112", type: "excavator", status: "idle", zone: "Pit B — South Bench", load: 0, x: 70, y: 40, operator: "—", hoursToday: 2.1, fuelPct: 88, model: "Komatsu PC2000" },
  { id: "DZ-008", type: "dozer", status: "active", zone: "Waste Dump 1", load: 54, x: 18, y: 62, operator: "Rudi Hartono", hoursToday: 5.6, fuelPct: 72, model: "Caterpillar D11" },
  { id: "HT-041", type: "haul-truck", status: "maintenance", zone: "Workshop Bay 2", load: 0, x: 50, y: 78, operator: "—", hoursToday: 0, fuelPct: 23, model: "Caterpillar 793F" },
  { id: "DR-004", type: "drill", status: "active", zone: "Pit A — Bench 4", load: 88, x: 35, y: 22, operator: "Joko Wibowo", hoursToday: 7.0, fuelPct: 59, model: "Epiroc Pit Viper 271" },
  { id: "HT-017", type: "haul-truck", status: "active", zone: "Crusher Route", load: 71, x: 80, y: 58, operator: "Dewi Lestari", hoursToday: 6.3, fuelPct: 47, model: "Caterpillar 793F" },
  { id: "EX-103", type: "excavator", status: "active", zone: "Pit C — Bench 2", load: 95, x: 58, y: 65, operator: "Eko Saputro", hoursToday: 8.4, fuelPct: 64, model: "Komatsu PC2000" },
  { id: "HT-052", type: "haul-truck", status: "offline", zone: "Parking — North", load: 0, x: 12, y: 82, operator: "—", hoursToday: 0, fuelPct: 12, model: "Caterpillar 793F" },
  { id: "DZ-011", type: "dozer", status: "active", zone: "Waste Dump 2", load: 61, x: 25, y: 70, operator: "Hadi Kusuma", hoursToday: 6.7, fuelPct: 55, model: "Caterpillar D11" },
  { id: "DR-009", type: "drill", status: "idle", zone: "Pit C — Bench 1", load: 0, x: 52, y: 50, operator: "—", hoursToday: 3.2, fuelPct: 81, model: "Epiroc Pit Viper 271" },
];

export const MACHINE_HEALTH = [
  {
    id: "EX-107",
    name: "Excavator 107",
    health: 94,
    nextService: "12 days",
    risk: "low",
    trend: [91, 92, 93, 93, 94, 94, 94],
    recommendation: "No action needed. Operating within optimal parameters.",
  },
  {
    id: "HT-033",
    name: "Haul Truck 033",
    health: 88,
    nextService: "8 days",
    risk: "low",
    trend: [90, 89, 89, 88, 88, 87, 88],
    recommendation: "Monitor tire wear — slight increase in vibration sensor readings.",
  },
  {
    id: "HT-041",
    name: "Haul Truck 041",
    health: 41,
    nextService: "Overdue",
    risk: "high",
    trend: [68, 61, 55, 49, 45, 42, 41],
    recommendation: "Schedule immediate inspection. Brake pressure trending toward failure threshold.",
  },
  {
    id: "DZ-008",
    name: "Dozer 008",
    health: 76,
    nextService: "21 days",
    risk: "medium",
    trend: [80, 79, 78, 77, 77, 76, 76],
    recommendation: "Track tension check recommended within 2 weeks.",
  },
  {
    id: "DR-004",
    name: "Drill Rig 004",
    health: 67,
    nextService: "5 days",
    risk: "medium",
    trend: [74, 72, 71, 69, 68, 67, 67],
    recommendation: "Hydraulic line inspection due — degradation rate accelerating.",
  },
  {
    id: "EX-103",
    name: "Excavator 103",
    health: 91,
    nextService: "18 days",
    risk: "low",
    trend: [89, 90, 90, 91, 91, 91, 91],
    recommendation: "No action needed. Trending stable to improving.",
  },
];

export const AI_RECOMMENDATIONS = [
  {
    id: 1,
    priority: "high",
    title: "Reroute HT-041 to Workshop Bay 2",
    detail: "Brake-pressure sensor trending toward failure threshold within 48 hours. Schedule preventive service now to avoid unplanned downtime.",
    impact: "Avoids ~6.5h unplanned downtime",
  },
  {
    id: 2,
    priority: "medium",
    title: "Rebalance haul cycle, Pit A → Crusher",
    detail: "Queue wait time at the crusher feed increased 14% this shift. Shifting one truck from Pit B to Pit A route would smooth throughput.",
    impact: "+3.1% fleet utilization",
  },
  {
    id: 3,
    priority: "low",
    title: "Adjust drill pattern at Bench 4",
    detail: "Fragmentation analysis suggests a 5% spacing increase would reduce secondary breakage without affecting dig rate.",
    impact: "Est. fuel savings 2.4%",
  },
];

export const STATUS_META = {
  active: { label: "Active", color: "var(--color-status-active)" },
  idle: { label: "Idle", color: "var(--color-status-idle)" },
  maintenance: { label: "Maintenance", color: "var(--color-status-maintenance)" },
  offline: { label: "Offline", color: "var(--color-status-offline)" },
};

export const FLEET_STATUS_COUNTS = FLEET_UNITS.reduce((acc, unit) => {
  acc[unit.status] = (acc[unit.status] ?? 0) + 1;
  return acc;
}, {});

// ============================================================
// Production page data
// ============================================================

export const PRODUCTION_MONTHLY_TREND = [
  { month: "Jan", tonnes: 512000, target: 560000 },
  { month: "Feb", tonnes: 487000, target: 560000 },
  { month: "Mar", tonnes: 538000, target: 560000 },
  { month: "Apr", tonnes: 561000, target: 560000 },
  { month: "May", tonnes: 549000, target: 560000 },
  { month: "Jun", tonnes: 574000, target: 560000 },
];

export const PRODUCTION_BY_ZONE = [
  {
    zone: "Pit A",
    tonnes: 6840,
    share: 37,
    color: "var(--color-chart-1)",
    activeUnits: 4,
    topPerformer: "EX-107",
    trend: "up",
    deltaPct: 5.2,
    note: "North Bench dig face running ahead of plan; drill pattern adjustment paying off.",
  },
  {
    zone: "Pit B",
    tonnes: 5120,
    share: 28,
    color: "var(--color-chart-2)",
    activeUnits: 3,
    topPerformer: "HT-029",
    trend: "down",
    deltaPct: -2.1,
    note: "South Bench excavator idle since 10:40 — awaiting relocation.",
  },
  {
    zone: "Pit C",
    tonnes: 4380,
    share: 24,
    color: "var(--color-chart-4)",
    activeUnits: 2,
    topPerformer: "EX-103",
    trend: "up",
    deltaPct: 3.8,
    note: "Steady output, no incidents reported this shift.",
  },
  {
    zone: "Waste Dump",
    tonnes: 2080,
    share: 11,
    color: "var(--color-chart-5)",
    activeUnits: 2,
    topPerformer: "DZ-008",
    trend: "down",
    deltaPct: -1.4,
    note: "Haul cycle slightly longer due to wet patch on access road.",
  },
];

export const SHIFT_COMPARISON = [
  { shift: "Morning (06–14)", tonnes: 6850, target: 6700, units: 9, pei: 89.1 },
  { shift: "Afternoon (14–22)", tonnes: 6420, target: 6700, units: 8, pei: 84.6 },
  { shift: "Night (22–06)", tonnes: 5150, target: 6600, units: 7, pei: 78.2 },
];

export const TARGET_VS_ACTUAL_WEEK = [
  { day: "Mon", actual: 16800, target: 20000, gapReason: "Drill rig DR-004 down for 3.5h — hydraulic line fault." },
  { day: "Tue", actual: 17950, target: 20000, gapReason: "Shift-change idle ran long; queue backed up at Pit B ramp." },
  { day: "Wed", actual: 15200, target: 20000, gapReason: "Heavy rain delay, Pit A haul road closed 2h for safety." },
  { day: "Thu", actual: 19100, target: 20000, gapReason: "Minor congestion at crusher feed during peak hours." },
  { day: "Fri", actual: 18420, target: 20000, gapReason: "One haul truck (HT-041) pulled for unplanned maintenance." },
  { day: "Sat", actual: 20650, target: 20000, gapReason: "Target exceeded — full fleet availability, no delays." },
  { day: "Sun", actual: 19880, target: 20000, gapReason: "Slightly under target; otherwise smooth operations." },
];

// ============================================================
// Maintenance page data
// ============================================================

export const WORK_ORDERS = [
  { id: "WO-2291", unit: "HT-041", title: "Brake pressure sensor replacement", priority: "high", status: "in-progress", assignee: "Wahyu Setiawan", eta: "Today, 16:00" },
  { id: "WO-2290", unit: "DR-004", title: "Hydraulic line inspection", priority: "medium", status: "scheduled", assignee: "Fajar Nugroho", eta: "Tomorrow, 08:00" },
  { id: "WO-2288", unit: "DZ-008", title: "Undercarriage track tension check", priority: "medium", status: "scheduled", assignee: "Wahyu Setiawan", eta: "Jun 22, 09:00" },
  { id: "WO-2285", unit: "EX-103", title: "500-hour service interval", priority: "low", status: "scheduled", assignee: "Sri Mulyani", eta: "Jun 24, 07:00" },
  { id: "WO-2280", unit: "HT-017", title: "Tire pressure & tread inspection", priority: "low", status: "completed", assignee: "Fajar Nugroho", eta: "Completed Jun 18" },
  { id: "WO-2277", unit: "EX-107", title: "Engine oil & filter change", priority: "low", status: "completed", assignee: "Sri Mulyani", eta: "Completed Jun 17" },
];

export const PARTS_INVENTORY = [
  { part: "Brake pads (HT-series)", stock: 6, minStock: 8, status: "low" },
  { part: "Hydraulic filters", stock: 24, minStock: 10, status: "ok" },
  { part: "Track shoes (DZ-series)", stock: 3, minStock: 4, status: "low" },
  { part: "Engine oil 15W-40 (drum)", stock: 18, minStock: 6, status: "ok" },
  { part: "Drill bits (DR-series)", stock: 11, minStock: 5, status: "ok" },
];

export const MAINTENANCE_COST_TREND = [
  { month: "Jan", planned: 84, unplanned: 22 },
  { month: "Feb", planned: 79, unplanned: 31 },
  { month: "Mar", planned: 88, unplanned: 18 },
  { month: "Apr", planned: 91, unplanned: 14 },
  { month: "May", planned: 86, unplanned: 26 },
  { month: "Jun", planned: 93, unplanned: 12 },
];

// ============================================================
// Reports page data
// ============================================================

export const AVAILABLE_REPORTS = [
  { id: 1, title: "Daily Production Summary", period: "Jun 20, 2026", type: "Production", size: "1.2 MB" },
  { id: 2, title: "Weekly Fleet Utilization", period: "Jun 14–20, 2026", type: "Fleet", size: "3.4 MB" },
  { id: 3, title: "Monthly Maintenance Report", period: "May 2026", type: "Maintenance", size: "2.8 MB" },
  { id: 4, title: "Safety Incident Log", period: "Jun 2026 (MTD)", type: "Safety", size: "640 KB" },
  { id: 5, title: "Fuel Consumption Analysis", period: "Jun 2026 (MTD)", type: "Fleet", size: "1.7 MB" },
  { id: 6, title: "Quarterly Production Review", period: "Q2 2026", type: "Production", size: "5.1 MB" },
];

export const SAFETY_METRICS = [
  { label: "Days without LTI", value: "47", trend: "up" },
  { label: "Near-miss reports", value: "3", trend: "down" },
  { label: "Safety compliance", value: "98.2%", trend: "up" },
  { label: "Training completion", value: "94%", trend: "up" },
];

// ============================================================
// Map landmarks & fuel stations (for the Live Mine Map)
// Coordinates are percentages of the 100 x 62.5 map viewport.
// ============================================================

export const MAP_LANDMARKS = [
  { id: "lm-workshop", name: "Workshop", kind: "workshop", x: 50, y: 80 },
  { id: "lm-crusher", name: "Crusher Station 2", kind: "crusher", x: 86, y: 56 },
  { id: "lm-office", name: "Site Office", kind: "office", x: 36, y: 68 },
  { id: "lm-stockpile", name: "ROM Stockpile", kind: "stockpile", x: 88, y: 80 },
  { id: "lm-pond", name: "Sediment Pond", kind: "pond", x: 14, y: 40 },
];

export const FUEL_STATIONS = [
  { id: "spbu-1", name: "SPBU Hauling A", x: 44, y: 64, available: true, dieselPct: 78 },
  { id: "spbu-2", name: "SPBU Workshop", x: 64, y: 84, available: true, dieselPct: 41 },
];

// ============================================================
// Per-unit telemetry for the Fleet detail panel.
// Generated deterministically from the unit id so values are
// realistic, stable across renders, and type-aware. Mirrors the
// shape a CAN-bus / VIMS telemetry API would return per machine.
// ============================================================

function seededRandom(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };
}

const PAYLOAD_CAPACITY = {
  "Caterpillar 793F": 227,
  "Komatsu PC2000": 0,
  "Caterpillar D11": 0,
  "Epiroc Pit Viper 271": 0,
};

const DUTY_LABEL = {
  excavator: "Bucket 12 m³",
  dozer: "Blade 34 m³",
  drill: "Rotary 271 mm",
};

function rangeStatus(value, okMax, warnMax) {
  if (value <= okMax) return "ok";
  if (value <= warnMax) return "warning";
  return "critical";
}

function buildTelemetry(unit) {
  const rand = seededRandom(unit.id);
  const between = (min, max) => min + rand() * (max - min);
  const isOn = unit.status === "active" || unit.status === "idle";
  const isHaul = unit.type === "haul-truck";
  const tracked = unit.type !== "haul-truck";

  const oilPct = Math.round(
    unit.status === "maintenance" ? between(28, 46) : between(58, 96)
  );
  const engineTempC = Math.round(
    unit.status === "active"
      ? between(86, 97)
      : unit.status === "idle"
        ? between(74, 84)
        : between(30, 38)
  );
  const engineHoursLifetime = Math.round(between(4200, 20800));
  const capacity = PAYLOAD_CAPACITY[unit.model] ?? 0;
  const payloadTonnes = isHaul ? Math.round((unit.load / 100) * capacity) : null;

  const hydraulicPressureBar = Math.round(
    isOn ? (isHaul ? between(160, 210) : between(255, 340)) : between(8, 24)
  );
  const suspensionPressureBar = Math.round(isHaul ? between(150, 195) : between(95, 140));
  const batteryVoltage = Number(
    (isOn ? between(27.4, 28.6) : between(24.1, 25.2)).toFixed(1)
  );
  const batteryCurrentA = Math.round(isOn ? between(18, 64) : between(-9, -2));
  const avgSpeedKph = Math.round(
    unit.status === "active" ? (isHaul ? between(18, 31) : between(2, 9)) : 0
  );
  const tireFront = Math.round(between(102, 116));
  const tireRear = Math.round(between(108, 122));

  return {
    oilPct,
    oilStatus: oilPct >= 55 ? "ok" : oilPct >= 35 ? "warning" : "critical",
    fuelPct: unit.fuelPct,
    fuelStatus: unit.fuelPct >= 50 ? "ok" : unit.fuelPct >= 25 ? "warning" : "critical",
    engineTempC,
    engineTempStatus: rangeStatus(engineTempC, 95, 102),
    engineHoursLifetime,
    engineHoursToday: unit.hoursToday,
    suspensionId: `SUS-${unit.id.split("-")[1]}${tracked ? "T" : "H"}`,
    suspensionStatus: rand() > 0.78 ? "warning" : "ok",
    suspensionPressureBar,
    tracked,
    payloadTonnes,
    payloadCapacityTonnes: capacity,
    payloadPct: isHaul && capacity ? Math.round((payloadTonnes / capacity) * 100) : null,
    dutyLabel: DUTY_LABEL[unit.type] ?? null,
    tirePressureFrontPsi: tracked ? null : tireFront,
    tirePressureRearPsi: tracked ? null : tireRear,
    hydraulicPressureBar,
    hydraulicStatus: rangeStatus(hydraulicPressureBar, isHaul ? 215 : 345, isHaul ? 235 : 365),
    batteryVoltage,
    batteryCurrentA,
    batteryStatus: batteryVoltage >= 26 || !isOn ? "ok" : "warning",
    avgSpeedKph,
  };
}

export const FLEET_TELEMETRY = FLEET_UNITS.reduce((acc, unit) => {
  acc[unit.id] = buildTelemetry(unit);
  return acc;
}, {});

// Dummy data for the Operator Dashboard (in-cab UI).
// Shapes mirror what a real telemetry/dispatch API would return.

export const CURRENT_OPERATOR = {
  name: "Andi Pratama",
  unitId: "EX-107",
  unitModel: "Komatsu PC2000",
  shift: "Morning Shift",
  shiftStart: "06:00",
  shiftEnd: "14:00",
};

export const CURRENT_MISSION = {
  id: "MSN-4471",
  task: "Load & haul — Pit A, North Bench",
  destination: "Crusher Station 2",
  priority: "high",
  status: "in-progress",
  progress: 64,
  targetLoads: 18,
  completedLoads: 11,
  estimatedCompletion: "12:40",
  instructions:
    "Dig face has shifted 4m east since last shift. Confirm bench stability before full-depth cuts.",
};

export const UPCOMING_MISSIONS = [
  { id: "MSN-4472", task: "Reposition to Bench 4", destination: "Pit A — Bench 4", eta: "13:00" },
  { id: "MSN-4473", task: "Load & haul — Waste Dump 1", destination: "Waste Dump 1", eta: "13:45" },
];

export const ROUTE_STEPS = [
  { id: 1, label: "Pit A — North Bench", status: "done", note: "Loading point" },
  { id: 2, label: "Haul Road 2", status: "current", note: "Caution: grade 8%, wet patch reported" },
  { id: 3, label: "Junction — Checkpoint 3", status: "upcoming", note: "Yield to oncoming haul trucks" },
  { id: 4, label: "Crusher Station 2", status: "upcoming", note: "Dump point" },
];

export const ROUTE_STATS = {
  distanceKm: 3.4,
  etaMinutes: 9,
  avgSpeedKph: 22,
  nextTurn: "Bear right at Checkpoint 3 in 480m",
};

export const PERFORMANCE_SCORE = {
  overall: 91,
  trend: "up",
  deltaPts: 3,
  breakdown: [
    { label: "Cycle efficiency", value: 94 },
    { label: "Fuel economy", value: 86 },
    { label: "Safety compliance", value: 98 },
    { label: "Idle time control", value: 82 },
  ],
};

export const SHIFT_HISTORY = [
  { day: "Mon", score: 84, loads: 16, fuelUsed: 142, note: "Slower start due to equipment pre-check delay." },
  { day: "Tue", score: 88, loads: 17, fuelUsed: 138, note: "Solid, consistent cycle times all shift." },
  { day: "Wed", score: 79, loads: 14, fuelUsed: 151, note: "Weather delay reduced active digging time by ~40 min." },
  { day: "Thu", score: 90, loads: 18, fuelUsed: 133, note: "Best cycle efficiency of the week." },
  { day: "Fri", score: 91, loads: 18, fuelUsed: 131, note: "Strong finish — fuel economy improved further." },
];

export const LEADERBOARD = [
  { rank: 1, name: "Eko Saputro", unit: "EX-103", score: 96, isCurrentUser: false },
  { rank: 2, name: "Dewi Lestari", unit: "HT-017", score: 93, isCurrentUser: false },
  { rank: 3, name: "Andi Pratama", unit: "EX-107", score: 91, isCurrentUser: true },
  { rank: 4, name: "Siti Rahma", unit: "HT-033", score: 89, isCurrentUser: false },
  { rank: 5, name: "Budi Santoso", unit: "HT-029", score: 85, isCurrentUser: false },
];

export const ACHIEVEMENT_BADGES = [
  { id: 1, label: "Fuel Saver", description: "Top 10% fuel efficiency, 4 weeks running", earned: true, tier: "gold" },
  { id: 2, label: "Zero Incidents", description: "90 days without a safety violation", earned: true, tier: "platinum" },
  { id: 3, label: "Cycle Master", description: "Beat target cycle time 20 shifts straight", earned: true, tier: "silver" },
  { id: 4, label: "Early Bird", description: "On-site 15 min before shift, 10 times", earned: true, tier: "bronze" },
  { id: 5, label: "Perfect Week", description: "100% PEI score for 5 consecutive days", earned: false, tier: "platinum" },
  { id: 6, label: "Night Owl", description: "50 night shifts completed", earned: false, tier: "gold" },
];

export const AI_COACHING_TIPS = [
  {
    id: 1,
    category: "Fuel efficiency",
    tip: "Reduce idle time during loading queue — your average idle is 4.2 min/cycle, top performers average 2.1 min.",
    impact: "Potential savings: 1.8 L/shift",
  },
  {
    id: 2,
    category: "Cycle time",
    tip: "Your swing-to-dump angle on Bench 4 is wider than necessary. A tighter turn radius could shave 6 seconds per cycle.",
    impact: "Potential gain: +4 loads/shift",
  },
  {
    id: 3,
    category: "Technique",
    tip: "Bucket fill factor has been consistently above 95% this week — excellent digging technique, keep it up.",
    impact: "Already optimal",
  },
];

export const SAFETY_ALERTS = [
  {
    id: 1,
    severity: "critical",
    title: "Wet patch reported — Haul Road 2",
    detail: "Reduce speed to 15 km/h through the marked section. Reported 12 minutes ago.",
    time: "12:18",
  },
  {
    id: 2,
    severity: "warning",
    title: "Proximity alert zone — Checkpoint 3",
    detail: "Multiple haul trucks converging. Maintain 50m following distance.",
    time: "12:05",
  },
  {
    id: 3,
    severity: "info",
    title: "Shift safety briefing acknowledged",
    detail: "You confirmed today's site safety briefing at 05:52.",
    time: "05:52",
  },
];

export const SAFETY_CHECKLIST = [
  { id: 1, label: "Pre-shift vehicle inspection", done: true },
  { id: 2, label: "Seatbelt and ROPS check", done: true },
  { id: 3, label: "Two-way radio test", done: true },
  { id: 4, label: "PPE confirmation", done: true },
  { id: 5, label: "Site hazard briefing", done: true },
  { id: 6, label: "Fire extinguisher check", done: false },
];

// ============================================================
// Production cycle process (operator view)
// One full load-haul-dump cycle, broken into stages.
// ============================================================

export const PRODUCTION_PROCESS = {
  cycleNumber: 12,
  cycleTimeMin: 9.4,
  targetCycleMin: 8.5,
  currentStage: "haul",
  stages: [
    { id: "spot", label: "Spot", description: "Position under excavator", icon: "spot", status: "done", durationMin: 0.8 },
    { id: "load", label: "Load", description: "5 passes · 218 t", icon: "load", status: "done", durationMin: 2.6 },
    { id: "haul", label: "Haul", description: "To Crusher Station 2", icon: "haul", status: "current", durationMin: 3.1 },
    { id: "queue", label: "Queue", description: "Dump-point wait", icon: "queue", status: "upcoming", durationMin: 0.9 },
    { id: "dump", label: "Dump", description: "Tip at crusher", icon: "dump", status: "upcoming", durationMin: 0.6 },
    { id: "return", label: "Return", description: "Back to dig face", icon: "return", status: "upcoming", durationMin: 2.4 },
  ],
};

// ============================================================
// Idle-time status (operator view)
// ============================================================

export const IDLE_STATUS = {
  state: "moving", // "moving" | "idle"
  currentIdleMin: 0,
  idleTodayMin: 38,
  targetIdleMin: 45,
  shiftElapsedMin: 372,
  idlePctOfShift: 10.2,
  lastIdleEvent: { reason: "Loading queue at dig face", durationMin: 4.2, time: "11:52" },
  breakdown: [
    { reason: "Loading queue", min: 16 },
    { reason: "Dump-point wait", min: 11 },
    { reason: "Shift handover", min: 7 },
    { reason: "Refuel", min: 4 },
  ],
};

// ============================================================
// Route waypoints (operator route map)
// Coordinates are percentages of a 100 x 60 map viewport.
// ============================================================

export const ROUTE_WAYPOINTS = [
  { id: "wp-1", label: "Pit A — North Bench", kind: "load", status: "done", x: 14, y: 24, note: "Loading point" },
  { id: "wp-2", label: "Haul Road 2", kind: "checkpoint", status: "current", x: 36, y: 40, note: "Grade 8% · wet patch" },
  { id: "wp-3", label: "Checkpoint 3", kind: "checkpoint", status: "upcoming", x: 58, y: 30, note: "Yield to haul trucks" },
  { id: "wp-4", label: "Crusher Station 2", kind: "dump", status: "upcoming", x: 86, y: 46, note: "Dump point" },
];

export const ROUTE_FUEL_STATION = { id: "spbu-route", name: "SPBU Hauling A", x: 48, y: 52, dieselPct: 78 };

// Truck current position along the route (percent of viewport).
export const ROUTE_TRUCK_POSITION = { x: 30, y: 36, headingDeg: 38 };

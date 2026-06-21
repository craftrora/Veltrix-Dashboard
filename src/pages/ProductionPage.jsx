import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, TrendingDown, Target, Layers, Clock3, Users, Award, X } from "lucide-react";
import DashboardShell from "../components/DashboardShell";
import SectionHeader from "../components/SectionHeader";
import InsightPanel from "../components/InsightPanel";
import { generateProductionInsights } from "../lib/insightEngine";
import {
  PRODUCTION_MONTHLY_TREND,
  PRODUCTION_BY_ZONE,
  SHIFT_COMPARISON,
  TARGET_VS_ACTUAL_WEEK,
} from "../data/supervisorData";
import { cn } from "../lib/utils";

function MonthlyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated rounded-lg px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      <p className="font-mono-data text-foreground">{(payload[0].value / 1000).toFixed(0)}K t</p>
    </div>
  );
}

function ZoneTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="glass-elevated rounded-lg px-3 py-2 text-xs">
      <p className="mb-0.5 font-medium text-foreground">{item.zone}</p>
      <p className="font-mono-data text-muted-foreground">{item.tonnes.toLocaleString()} t · {item.share}%</p>
      <p className="mt-1 text-[10px] text-primary">Click for details</p>
    </div>
  );
}

function WeekTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated rounded-lg px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      <p className="font-mono-data text-foreground">Actual: {payload[0].value.toLocaleString()} t</p>
      <p className="font-mono-data text-muted-foreground">Target: {payload[1].value.toLocaleString()} t</p>
      <p className="mt-1 text-[10px] text-primary">Click bar for details</p>
    </div>
  );
}

export default function ProductionPage() {
  const ytdTotal = PRODUCTION_MONTHLY_TREND.reduce((s, m) => s + m.tonnes, 0);
  const monthsAboveTarget = PRODUCTION_MONTHLY_TREND.filter((m) => m.tonnes >= m.target).length;

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const insights = generateProductionInsights(PRODUCTION_MONTHLY_TREND, PRODUCTION_BY_ZONE, TARGET_VS_ACTUAL_WEEK);

  return (
    <DashboardShell title="Production" subtitle="Site 4 — output, targets, and shift performance">
          {/* Summary strip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="glass hover-lift animate-fade-up rounded-xl p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-primary" /> YTD Production
              </div>
              <p className="font-display font-mono-data text-2xl font-bold text-foreground">{(ytdTotal / 1000).toFixed(0)}K t</p>
            </div>
            <div className="glass hover-lift animate-fade-up rounded-xl p-5" style={{ animationDelay: "60ms" }}>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Target className="h-3.5 w-3.5 text-success" /> Months at/above Target
              </div>
              <p className="font-display font-mono-data text-2xl font-bold text-foreground">{monthsAboveTarget} / {PRODUCTION_MONTHLY_TREND.length}</p>
            </div>
            <div className="glass hover-lift animate-fade-up rounded-xl p-5" style={{ animationDelay: "120ms" }}>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Layers className="h-3.5 w-3.5 text-sky-400" /> Active Zones
              </div>
              <p className="font-display font-mono-data text-2xl font-bold text-foreground">{PRODUCTION_BY_ZONE.length}</p>
            </div>
          </div>

          {/* Auto-generated insights */}
          <InsightPanel title="Production Insights" insights={insights} delay={150} />

          {/* Monthly trend + zone breakdown */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="glass animate-fade-up rounded-xl p-5 lg:col-span-2" style={{ animationDelay: "260ms" }}>
              <SectionHeader title="Monthly Production Trend" description="Tonnes extracted vs monthly target, last 6 months" />
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PRODUCTION_MONTHLY_TREND} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="monthly-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `${v / 1000}K`} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
                    <Tooltip content={<MonthlyTooltip />} cursor={{ stroke: "rgba(249,115,22,0.3)" }} />
                    <Area type="monotone" dataKey="tonnes" stroke="#f97316" strokeWidth={2} fill="url(#monthly-fill)" animationDuration={900} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass animate-fade-up rounded-xl p-5" style={{ animationDelay: "300ms" }}>
              <SectionHeader title="Production by Zone" description="Today's tonnage share — click a slice for details" />
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PRODUCTION_BY_ZONE}
                      dataKey="tonnes"
                      nameKey="zone"
                      innerRadius={42}
                      outerRadius={64}
                      paddingAngle={3}
                      animationDuration={800}
                      onClick={(entry) => setSelectedZone(selectedZone?.zone === entry.zone ? null : entry)}
                      className="cursor-pointer"
                    >
                      {PRODUCTION_BY_ZONE.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.color}
                          stroke={selectedZone?.zone === entry.zone ? "var(--foreground)" : "none"}
                          strokeWidth={selectedZone?.zone === entry.zone ? 2 : 0}
                          opacity={selectedZone && selectedZone.zone !== entry.zone ? 0.45 : 1}
                          style={{ transition: "opacity 0.2s ease, stroke 0.2s ease" }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ZoneTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1">
                {PRODUCTION_BY_ZONE.map((zone) => (
                  <button
                    key={zone.zone}
                    onClick={() => setSelectedZone(selectedZone?.zone === zone.zone ? null : zone)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-xs transition-colors duration-150",
                      selectedZone?.zone === zone.zone ? "bg-foreground/[0.05]" : "hover:bg-foreground/[0.03]"
                    )}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: zone.color }} />
                    <span className="text-muted-foreground">{zone.zone}</span>
                    <span className="ml-auto font-mono-data font-medium text-foreground">{zone.share}%</span>
                  </button>
                ))}
              </div>

              {/* Drill-down detail panel */}
              {selectedZone && (
                <div className="animate-fade-up mt-3 rounded-lg border border-border bg-foreground/[0.02] p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: selectedZone.color }} />
                      <span className="text-sm font-semibold text-foreground">{selectedZone.zone}</span>
                    </div>
                    <button
                      onClick={() => setSelectedZone(null)}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Close detail"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" /> {selectedZone.activeUnits} active units
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Award className="h-3 w-3" /> Top: {selectedZone.topPerformer}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      selectedZone.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {selectedZone.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(selectedZone.deltaPct)}% vs yesterday
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/80">{selectedZone.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shift comparison + target vs actual */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="glass animate-fade-up rounded-xl p-5" style={{ animationDelay: "360ms" }}>
              <SectionHeader title="Shift Comparison" description="Today's output by shift window" actions={<Clock3 className="h-4 w-4 text-muted-foreground" />} />
              <div className="space-y-4">
                {SHIFT_COMPARISON.map((shift) => {
                  const pct = Math.min(100, Math.round((shift.tonnes / shift.target) * 100));
                  const onTarget = shift.tonnes >= shift.target;
                  return (
                    <div key={shift.shift}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground/90">{shift.shift}</span>
                        <span className="font-mono-data text-xs text-muted-foreground">
                          {shift.tonnes.toLocaleString()} / {shift.target.toLocaleString()} t · PEI {shift.pei}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full surface-track">
                        <div
                          className={cn("h-full rounded-full transition-all duration-700 ease-out", onTarget ? "bg-success" : "bg-primary")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass animate-fade-up rounded-xl p-5" style={{ animationDelay: "420ms" }}>
              <SectionHeader title="Target vs Actual — Last 7 Days" description="Click a bar to see what happened that day" />
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={TARGET_VS_ACTUAL_WEEK}
                    margin={{ left: -16, right: 8, top: 8, bottom: 0 }}
                    onClick={(state) => {
                      const day = state?.activePayload?.[0]?.payload;
                      if (day) setSelectedDay(selectedDay?.day === day.day ? null : day);
                    }}
                  >
                    <CartesianGrid stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `${v / 1000}K`} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={42} />
                    <Tooltip content={<WeekTooltip />} cursor={{ fill: "rgba(249,115,22,0.06)" }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
                    <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]} barSize={18} animationDuration={800} className="cursor-pointer">
                      {TARGET_VS_ACTUAL_WEEK.map((entry, i) => (
                        <Cell
                          key={i}
                          fill="#f97316"
                          opacity={selectedDay && selectedDay.day !== entry.day ? 0.4 : 1}
                          style={{ transition: "opacity 0.2s ease" }}
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="target" name="Target" fill="var(--border)" radius={[4, 4, 0, 0]} barSize={18} animationDuration={800} className="cursor-pointer" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Drill-down detail panel */}
              {selectedDay && (
                <div className="animate-fade-up mt-3 rounded-lg border border-border bg-foreground/[0.02] p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{selectedDay.day}</span>
                    <button
                      onClick={() => setSelectedDay(null)}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Close detail"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mb-2 flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">
                      Actual: <span className="font-mono-data font-semibold text-foreground">{selectedDay.actual.toLocaleString()} t</span>
                    </span>
                    <span className="text-muted-foreground">
                      Target: <span className="font-mono-data font-semibold text-foreground">{selectedDay.target.toLocaleString()} t</span>
                    </span>
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-0.5 font-medium",
                        selectedDay.actual >= selectedDay.target ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      )}
                    >
                      {selectedDay.actual >= selectedDay.target ? "On target" : "Below target"}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/80">{selectedDay.gapReason}</p>
                </div>
              )}
            </div>
          </div>
    </DashboardShell>
  );
}

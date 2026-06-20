import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Wrench, AlertCircle, PackageCheck, Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import DashboardTopBar from "../components/DashboardTopBar";
import SectionHeader from "../components/SectionHeader";
import StatusBadge from "../components/StatusBadge";
import { WORK_ORDERS, PARTS_INVENTORY, MAINTENANCE_COST_TREND } from "../data/supervisorData";
import { cn } from "../lib/utils";

const PRIORITY_TONE = { high: "destructive", medium: "warning", low: "neutral" };
const STATUS_TONE = { "in-progress": "primary", scheduled: "warning", completed: "success" };
const STATUS_LABEL = { "in-progress": "In Progress", scheduled: "Scheduled", completed: "Completed" };

function CostTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated rounded-lg px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      <p className="font-mono-data text-foreground">Planned: ${payload[0].value}K</p>
      <p className="font-mono-data text-destructive">Unplanned: ${payload[1].value}K</p>
    </div>
  );
}

export default function MaintenancePage() {
  const openOrders = WORK_ORDERS.filter((w) => w.status !== "completed").length;
  const lowStockParts = PARTS_INVENTORY.filter((p) => p.status === "low").length;

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="pointer-events-none fixed left-1/4 top-0 h-[420px] w-[600px] rounded-full bg-primary/[0.06] blur-[160px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[360px] w-[480px] rounded-full bg-sky-500/[0.04] blur-[150px]" />

      <Sidebar />

      <div className="relative z-10 min-w-0 flex-1">
        <DashboardTopBar title="Maintenance" subtitle="Work orders, parts, and service cost tracking" />

        <main className="space-y-6 px-8 py-6">
          {/* Summary strip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="glass hover-lift animate-fade-up rounded-xl p-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Wrench className="h-3.5 w-3.5 text-primary" /> Open Work Orders
              </div>
              <p className="font-display font-mono-data text-2xl font-bold text-foreground">{openOrders}</p>
            </div>
            <div className="glass hover-lift animate-fade-up rounded-xl p-5" style={{ animationDelay: "60ms" }}>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <AlertCircle className="h-3.5 w-3.5 text-destructive" /> Low-Stock Parts
              </div>
              <p className="font-display font-mono-data text-2xl font-bold text-foreground">{lowStockParts}</p>
            </div>
            <div className="glass hover-lift animate-fade-up rounded-xl p-5" style={{ animationDelay: "120ms" }}>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <PackageCheck className="h-3.5 w-3.5 text-success" /> Planned Ratio (Jun)
              </div>
              <p className="font-display font-mono-data text-2xl font-bold text-foreground">
                {Math.round(
                  (MAINTENANCE_COST_TREND.at(-1).planned /
                    (MAINTENANCE_COST_TREND.at(-1).planned + MAINTENANCE_COST_TREND.at(-1).unplanned)) *
                    100
                )}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Work orders */}
            <div className="glass animate-fade-up rounded-xl xl:col-span-2" style={{ animationDelay: "180ms" }}>
              <div className="flex items-center justify-between border-b border-border p-5">
                <SectionHeader title="Work Orders" description="Active and recently completed service tickets" />
                <button className="mb-5 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5">
                  <Plus className="h-3.5 w-3.5" />
                  New Order
                </button>
              </div>
              <div className="divide-y divide-border/60">
                {WORK_ORDERS.map((wo) => (
                  <div key={wo.id} className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors duration-200 hover:bg-foreground/[0.02]">
                    <div className="w-20 shrink-0">
                      <span className="font-mono-data text-xs font-semibold text-muted-foreground">{wo.id}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{wo.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {wo.unit} · {wo.assignee}
                      </p>
                    </div>
                    <StatusBadge tone={PRIORITY_TONE[wo.priority]} className="capitalize">
                      {wo.priority}
                    </StatusBadge>
                    <StatusBadge tone={STATUS_TONE[wo.status]}>{STATUS_LABEL[wo.status]}</StatusBadge>
                    <span className="w-32 shrink-0 text-right text-xs text-muted-foreground">{wo.eta}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parts inventory */}
            <div className="glass animate-fade-up rounded-xl p-5" style={{ animationDelay: "220ms" }}>
              <SectionHeader title="Parts Inventory" description="Critical spares stock level" />
              <div className="space-y-4">
                {PARTS_INVENTORY.map((part) => {
                  const pct = Math.min(100, Math.round((part.stock / (part.minStock * 2)) * 100));
                  return (
                    <div key={part.part}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-foreground/90">{part.part}</span>
                        <span className={cn("font-mono-data font-medium", part.status === "low" ? "text-destructive" : "text-success")}>
                          {part.stock} / min {part.minStock}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full surface-track">
                        <div
                          className={cn("h-full rounded-full transition-all duration-700 ease-out", part.status === "low" ? "bg-destructive" : "bg-success")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cost trend */}
          <div className="glass animate-fade-up rounded-xl p-5" style={{ animationDelay: "280ms" }}>
            <SectionHeader title="Maintenance Cost — Planned vs Unplanned" description="Monthly spend, USD thousands" />
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MAINTENANCE_COST_TREND} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `$${v}K`} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip content={<CostTooltip />} cursor={{ fill: "rgba(249,115,22,0.06)" }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }} />
                  <Bar dataKey="planned" name="Planned" stackId="cost" fill="#38bdf8" radius={[0, 0, 0, 0]} barSize={28} animationDuration={800} />
                  <Bar dataKey="unplanned" name="Unplanned" stackId="cost" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={28} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

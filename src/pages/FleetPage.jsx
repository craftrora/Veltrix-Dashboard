import { useMemo, useState } from "react";
import { ArrowUpDown, Search, Download, Truck, Mountain, Drill as DrillIcon, X, Gauge, Clock, Fuel, User } from "lucide-react";
import Sidebar from "../components/Sidebar";
import DashboardTopBar from "../components/DashboardTopBar";
import StatusBadge from "../components/StatusBadge";
import { FLEET_UNITS, STATUS_META } from "../data/supervisorData";
import { cn } from "../lib/utils";

const STATUS_TONE = {
  active: "success",
  idle: "warning",
  maintenance: "destructive",
  offline: "neutral",
};

const TYPE_META = {
  excavator: { label: "Excavator", icon: Mountain },
  "haul-truck": { label: "Haul Truck", icon: Truck },
  dozer: { label: "Dozer", icon: Mountain },
  drill: { label: "Drill Rig", icon: DrillIcon },
};

const COLUMNS = [
  { key: "id", label: "Unit ID" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "zone", label: "Location" },
  { key: "operator", label: "Operator" },
  { key: "hoursToday", label: "Hours Today" },
  { key: "fuelPct", label: "Fuel" },
  { key: "load", label: "Load" },
];

function fuelTone(pct) {
  if (pct >= 50) return "text-success";
  if (pct >= 25) return "text-warning";
  return "text-destructive";
}

function fuelBarTone(pct) {
  if (pct >= 50) return "bg-success";
  if (pct >= 25) return "bg-warning";
  return "bg-destructive";
}

export default function FleetPage() {
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [detailUnit, setDetailUnit] = useState(null);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const rows = useMemo(() => {
    let result = [...FLEET_UNITS];

    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.id.toLowerCase().includes(q) ||
          u.zone.toLowerCase().includes(q) ||
          u.operator.toLowerCase().includes(q) ||
          u.model.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [sortKey, sortDir, statusFilter, query]);

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="pointer-events-none fixed left-1/4 top-0 h-[420px] w-[600px] rounded-full bg-primary/[0.06] blur-[160px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[360px] w-[480px] rounded-full bg-sky-500/[0.04] blur-[150px]" />

      <Sidebar />

      <div className="relative z-10 min-w-0 flex-1">
        <DashboardTopBar title="Fleet" subtitle={`${FLEET_UNITS.length} units across Site 4`} />

        <main className="px-8 py-6">
          <div className="glass animate-fade-up rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search unit, operator, model…"
                  className="w-56 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                    statusFilter === "all" ? "bg-primary text-primary-foreground" : "surface-chip text-muted-foreground hover:text-foreground"
                  )}
                >
                  All ({FLEET_UNITS.length})
                </button>
                {Object.entries(STATUS_META).map(([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                      statusFilter === key ? "bg-primary text-primary-foreground" : "surface-chip text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusFilter === key ? "currentColor" : meta.color }} />
                    {meta.label}
                  </button>
                ))}
                <button className="ml-1 flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    {COLUMNS.map((col) => (
                      <th key={col.key} className="px-5 py-3 font-medium">
                        <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1.5 transition-colors hover:text-foreground">
                          {col.label}
                          <ArrowUpDown className={cn("h-3 w-3", sortKey === col.key ? "text-primary" : "opacity-40")} />
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((unit) => {
                    const TypeIcon = TYPE_META[unit.type].icon;
                    return (
                      <tr
                        key={unit.id}
                        onClick={() => setDetailUnit(unit)}
                        className="cursor-pointer border-b border-border/60 transition-colors duration-200 last:border-0 hover:bg-foreground/[0.02]"
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono-data font-semibold text-foreground">{unit.id}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-2 text-foreground/90">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            {TYPE_META[unit.type].label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge tone={STATUS_TONE[unit.status]}>{STATUS_META[unit.status].label}</StatusBadge>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground">{unit.zone}</td>
                        <td className="px-5 py-3.5 text-foreground/90">{unit.operator}</td>
                        <td className="px-5 py-3.5 font-mono-data text-foreground/90">{unit.hoursToday.toFixed(1)}h</td>
                        <td className={cn("px-5 py-3.5 font-mono-data font-medium", fuelTone(unit.fuelPct))}>{unit.fuelPct}%</td>
                        <td className="px-5 py-3.5">
                          {unit.status === "active" ? (
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 overflow-hidden rounded-full surface-track">
                                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${unit.load}%` }} />
                              </div>
                              <span className="font-mono-data text-xs text-muted-foreground">{unit.load}%</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={COLUMNS.length} className="px-5 py-10 text-center text-sm text-muted-foreground">
                        No units match your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Slide-over detail panel */}
      {detailUnit && (
        <>
          <div
            className="animate-fade-in fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            onClick={() => setDetailUnit(null)}
          />
          <div className="glass-elevated animate-fade-up fixed right-0 top-0 z-40 h-screen w-full max-w-sm overflow-y-auto p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-mono-data text-xs text-muted-foreground">{TYPE_META[detailUnit.type].label}</p>
                <h2 className="font-display text-xl font-bold text-foreground">{detailUnit.id}</h2>
              </div>
              <button
                onClick={() => setDetailUnit(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-6">
              <StatusBadge tone={STATUS_TONE[detailUnit.status]}>{STATUS_META[detailUnit.status].label}</StatusBadge>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-foreground/[0.02] p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <User className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] text-muted-foreground">Operator</p>
                  <p className="text-sm font-medium text-foreground">{detailUnit.operator}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-foreground/[0.02] p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] text-muted-foreground">Hours today</p>
                  <p className="font-mono-data text-sm font-medium text-foreground">{detailUnit.hoursToday.toFixed(1)}h</p>
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Fuel className="h-3.5 w-3.5" /> Fuel level
                  </span>
                  <span className={cn("font-mono-data font-semibold", fuelTone(detailUnit.fuelPct))}>{detailUnit.fuelPct}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full surface-track">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", fuelBarTone(detailUnit.fuelPct))}
                    style={{ width: `${detailUnit.fuelPct}%` }}
                  />
                </div>
              </div>

              {detailUnit.status === "active" && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Gauge className="h-3.5 w-3.5" /> Current load
                    </span>
                    <span className="font-mono-data font-semibold text-foreground">{detailUnit.load}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full surface-track">
                    <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${detailUnit.load}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-foreground/[0.02] p-4">
              <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Location</p>
              <p className="text-sm text-foreground/90">{detailUnit.zone}</p>
              <p className="mt-3 mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Model</p>
              <p className="text-sm text-foreground/90">{detailUnit.model}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

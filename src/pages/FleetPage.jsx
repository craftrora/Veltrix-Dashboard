import { useMemo, useState } from "react";
import { ArrowUpDown, Search, Download, Truck, Mountain, Drill as DrillIcon, LayoutGrid, List } from "lucide-react";
import DashboardShell from "../components/DashboardShell";
import StatusBadge from "../components/StatusBadge";
import FleetUnitCard from "../components/FleetUnitCard";
import FleetDetailPanel from "../components/FleetDetailPanel";
import { FLEET_UNITS, FLEET_TELEMETRY, STATUS_META } from "../data/supervisorData";
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

export default function FleetPage() {
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [detailUnit, setDetailUnit] = useState(null);
  const [view, setView] = useState("grid");

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
    <DashboardShell title="Fleet" subtitle={`${FLEET_UNITS.length} units across Site 4`} mainClassName="">
      <div className="glass animate-fade-up rounded-xl">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search unit, operator, model…"
              className="w-44 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60 sm:w-56"
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

            {/* View toggle */}
            <div className="ml-1 flex items-center gap-0.5 rounded-lg border border-border p-0.5">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                  view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                  view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>

            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Empty state */}
        {rows.length === 0 && (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">No units match your search or filters.</div>
        )}

        {/* Grid view */}
        {view === "grid" && rows.length > 0 && (
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((unit, i) => (
              <FleetUnitCard
                key={unit.id}
                unit={unit}
                telemetry={FLEET_TELEMETRY[unit.id]}
                onSelect={() => setDetailUnit(unit)}
                delay={i * 45}
              />
            ))}
          </div>
        )}

        {/* List view */}
        {view === "list" && rows.length > 0 && (
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
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {detailUnit && (
        <FleetDetailPanel
          unit={detailUnit}
          telemetry={FLEET_TELEMETRY[detailUnit.id]}
          onClose={() => setDetailUnit(null)}
        />
      )}
    </DashboardShell>
  );
}

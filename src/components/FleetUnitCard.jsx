import { Fuel, Gauge, User, Clock, ArrowRight } from "lucide-react";
import haulTruckImg from "../assets/haul-truck.png";
import StatusBadge from "./StatusBadge";
import { STATUS_META } from "../data/supervisorData";
import { cn } from "../lib/utils";

const STATUS_TONE = {
  active: "success",
  idle: "warning",
  maintenance: "destructive",
  offline: "neutral",
};

const TYPE_LABEL = {
  excavator: "Excavator",
  "haul-truck": "Haul Truck",
  dozer: "Dozer",
  drill: "Drill Rig",
};

function fuelTone(pct) {
  if (pct >= 50) return "text-success";
  if (pct >= 25) return "text-warning";
  return "text-destructive";
}
function fuelBar(pct) {
  if (pct >= 50) return "bg-success";
  if (pct >= 25) return "bg-warning";
  return "bg-destructive";
}

/**
 * @param {{ unit: any, telemetry: any, onSelect: () => void, delay?: number }} props
 */
export default function FleetUnitCard({ unit, telemetry, onSelect, delay = 0 }) {
  const meta = STATUS_META[unit.status];
  const isActive = unit.status === "active";

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{ animationDelay: `${delay}ms` }}
      className="group glass glass-hover animate-fade-up hover-lift relative flex w-full flex-col overflow-hidden rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      {/* Equipment art panel */}
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-foreground/[0.02]">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        {/* status pill */}
        <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            {isActive && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: meta.color }} />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: meta.color }} />
          </span>
          <span style={{ color: meta.color }}>{meta.label}</span>
        </span>
        <span className="absolute right-3 top-3 z-10 rounded-full bg-background/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-sm">
          {TYPE_LABEL[unit.type]}
        </span>

        <img
          src={haulTruckImg}
          alt={`${unit.id} haul truck`}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain p-5 drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-[1.05]"
        />

        {/* Hover summary overlay (desktop) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-background via-background/90 to-transparent p-3.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-3 w-3" /> {unit.operator}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3 w-3" /> {unit.hoursToday.toFixed(1)}h
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge className="h-3 w-3" /> {telemetry.avgSpeedKph} km/h
            </span>
          </div>
          <div className="mt-2 flex items-center justify-end gap-1 text-[11px] font-medium text-primary">
            View details <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono-data text-base font-bold text-foreground">{unit.id}</p>
            <p className="truncate text-xs text-muted-foreground">{unit.model}</p>
          </div>
          <StatusBadge tone={STATUS_TONE[unit.status]}>{meta.label}</StatusBadge>
        </div>

        {/* Mini metrics */}
        <div className="mt-auto space-y-2.5">
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Fuel className="h-3 w-3" /> Fuel
              </span>
              <span className={cn("font-mono-data font-semibold", fuelTone(unit.fuelPct))}>{unit.fuelPct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full surface-track">
              <div className={cn("h-full rounded-full transition-all duration-700", fuelBar(unit.fuelPct))} style={{ width: `${unit.fuelPct}%` }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Gauge className="h-3 w-3" /> Load
              </span>
              <span className="font-mono-data font-semibold text-foreground">{isActive ? `${unit.load}%` : "—"}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full surface-track">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${isActive ? unit.load : 0}%` }} />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

import {
  X, Fuel, Droplet, Clock, Thermometer, Gauge, Weight, CircleGauge,
  Waves, Battery, Zap, User, MapPin, Activity,
} from "lucide-react";
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

const HEALTH_COLOR = {
  ok: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
};
const HEALTH_BAR = {
  ok: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
};
const HEALTH_LABEL = { ok: "Nominal", warning: "Monitor", critical: "Critical" };

function StatTile({ icon: Icon, label, value, unit, sub, status }) {
  return (
    <div className="rounded-xl border border-border bg-foreground/[0.02] p-3.5">
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className={cn("font-mono-data text-lg font-bold leading-none", status ? HEALTH_COLOR[status] : "text-foreground")}>
        {value}
        {unit && <span className="ml-0.5 text-xs font-medium text-muted-foreground">{unit}</span>}
      </p>
      {sub && <p className="mt-1.5 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function BarRow({ icon: Icon, label, pct, valueText, barClass }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" /> {label}
        </span>
        <span className="font-mono-data font-semibold text-foreground">{valueText}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full surface-track">
        <div className={cn("h-full rounded-full transition-all duration-700", barClass)} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
      </div>
    </div>
  );
}

function fuelTone(pct) {
  if (pct >= 50) return "bg-success";
  if (pct >= 25) return "bg-warning";
  return "bg-destructive";
}

function SectionLabel({ children }) {
  return <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</p>;
}

/**
 * @param {{ unit: any, telemetry: any, onClose: () => void }} props
 */
export default function FleetDetailPanel({ unit, telemetry: t, onClose }) {
  const hydMax = unit.type === "haul-truck" ? 250 : 400;
  const isActive = unit.status === "active";

  return (
    <>
      <div className="animate-fade-in fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-elevated animate-fade-up fixed right-0 top-0 z-40 flex h-screen w-full max-w-md flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border p-6 pb-5">
          <div className="flex items-center gap-3.5">
            <span className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-foreground/[0.03]">
              <img src={haulTruckImg} alt={`${unit.id} haul truck`} draggable={false} className="h-full w-full object-contain p-1.5" />
            </span>
            <div>
              <p className="font-mono-data text-xs text-muted-foreground">{unit.id} · {TYPE_LABEL[unit.type]}</p>
              <h2 className="font-display text-xl font-bold leading-tight text-foreground">{unit.model}</h2>
              <div className="mt-1.5">
                <StatusBadge tone={STATUS_TONE[unit.status]}>{STATUS_META[unit.status].label}</StatusBadge>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Operator + location */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-foreground/[0.02] p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <User className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Operator</p>
                <p className="truncate text-sm font-medium text-foreground">{unit.operator}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-foreground/[0.02] p-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400">
                <MapPin className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Location</p>
                <p className="truncate text-sm font-medium text-foreground">{unit.zone}</p>
              </div>
            </div>
          </div>

          {/* Engine status: oil & fuel */}
          <div>
            <SectionLabel>Engine status</SectionLabel>
            <div className="space-y-3.5">
              <BarRow icon={Droplet} label="Oil level" pct={t.oilPct} valueText={`${t.oilPct}%`} barClass={HEALTH_BAR[t.oilStatus]} />
              <BarRow icon={Fuel} label="Fuel level" pct={t.fuelPct} valueText={`${t.fuelPct}%`} barClass={fuelTone(t.fuelPct)} />
            </div>
          </div>

          {/* Core telemetry tiles */}
          <div>
            <SectionLabel>Engine &amp; drivetrain</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <StatTile
                icon={Clock}
                label="Engine runtime"
                value={t.engineHoursLifetime.toLocaleString()}
                unit="h"
                sub={`${t.engineHoursToday.toFixed(1)}h this shift`}
              />
              <StatTile
                icon={Thermometer}
                label="Engine temp"
                value={t.engineTempC}
                unit="°C"
                sub={HEALTH_LABEL[t.engineTempStatus]}
                status={t.engineTempStatus}
              />
              <StatTile icon={Gauge} label="Avg speed" value={t.avgSpeedKph} unit="km/h" sub={isActive ? "This shift" : "Stationary"} />
              <StatTile
                icon={Weight}
                label="Payload"
                value={t.payloadTonnes != null ? t.payloadTonnes : "—"}
                unit={t.payloadTonnes != null ? "t" : ""}
                sub={t.payloadTonnes != null ? `of ${t.payloadCapacityTonnes}t · ${t.payloadPct}%` : t.dutyLabel}
              />
            </div>
          </div>

          {/* Hydraulics & pressure */}
          <div>
            <SectionLabel>Hydraulics &amp; pressure</SectionLabel>
            <div className="space-y-3.5">
              <BarRow
                icon={CircleGauge}
                label="Hydraulic pressure (RAM)"
                pct={(t.hydraulicPressureBar / hydMax) * 100}
                valueText={`${t.hydraulicPressureBar} bar`}
                barClass={HEALTH_BAR[t.hydraulicStatus]}
              />
              <div className="grid grid-cols-2 gap-3">
                <StatTile
                  icon={Waves}
                  label="Suspension / Shock"
                  value={t.suspensionId}
                  sub={`${t.suspensionPressureBar} bar · ${HEALTH_LABEL[t.suspensionStatus]}`}
                  status={t.suspensionStatus}
                />
                <StatTile
                  icon={Activity}
                  label="Tire pressure"
                  value={t.tracked ? "Tracked" : `${t.tirePressureFrontPsi}/${t.tirePressureRearPsi}`}
                  unit={t.tracked ? "" : "psi"}
                  sub={t.tracked ? "No tires — undercarriage" : "Front / Rear"}
                />
              </div>
            </div>
          </div>

          {/* Battery */}
          <div>
            <SectionLabel>Battery condition</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <StatTile
                icon={Battery}
                label="Voltage"
                value={t.batteryVoltage.toFixed(1)}
                unit="V"
                sub={HEALTH_LABEL[t.batteryStatus]}
                status={t.batteryStatus}
              />
              <StatTile
                icon={Zap}
                label="Current"
                value={t.batteryCurrentA > 0 ? `+${t.batteryCurrentA}` : t.batteryCurrentA}
                unit="A"
                sub={t.batteryCurrentA > 0 ? "Charging" : "Resting draw"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

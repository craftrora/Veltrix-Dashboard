import { MapPin, Clock, Package, AlertTriangle, ChevronRight } from "lucide-react";
import OperatorShell from "../components/OperatorShell";
import StatusBadge from "../components/StatusBadge";
import ProductionProcess from "../components/ProductionProcess";
import IdleTimeIndicator from "../components/IdleTimeIndicator";
import { CURRENT_MISSION, UPCOMING_MISSIONS, CURRENT_OPERATOR } from "../data/operatorData";

export default function OperatorMissionPage() {
  return (
    <OperatorShell>
      <div className="animate-fade-in">
        <p className="text-sm text-muted-foreground">Good shift, {CURRENT_OPERATOR.name.split(" ")[0]}</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Current Mission</h1>
      </div>

      {/* Current mission card */}
      <div className="glass-elevated animate-fade-up rounded-2xl p-6" style={{ animationDelay: "60ms" }}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <span className="font-mono-data text-xs text-muted-foreground">{CURRENT_MISSION.id}</span>
            <h2 className="mt-0.5 font-display text-lg font-bold text-foreground">{CURRENT_MISSION.task}</h2>
          </div>
          <StatusBadge tone="primary">In Progress</StatusBadge>
        </div>

        <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          Destination: <span className="text-foreground/90">{CURRENT_MISSION.destination}</span>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground/90">
              {CURRENT_MISSION.completedLoads} / {CURRENT_MISSION.targetLoads} loads
            </span>
            <span className="font-mono-data text-xs text-muted-foreground">{CURRENT_MISSION.progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full surface-track">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-primary transition-all duration-1000 ease-out"
              style={{ width: `${CURRENT_MISSION.progress}%` }}
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="hover-lift rounded-xl border border-border bg-foreground/[0.02] p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Est. completion
            </div>
            <p className="font-mono-data text-base font-bold text-foreground">{CURRENT_MISSION.estimatedCompletion}</p>
          </div>
          <div className="hover-lift rounded-xl border border-border bg-foreground/[0.02] p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Package className="h-3.5 w-3.5" /> Remaining
            </div>
            <p className="font-mono-data text-base font-bold text-foreground">
              {CURRENT_MISSION.targetLoads - CURRENT_MISSION.completedLoads} loads
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/[0.07] p-3.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p className="text-xs leading-relaxed text-foreground/90">{CURRENT_MISSION.instructions}</p>
        </div>
      </div>

      {/* Production process + idle time */}
      <ProductionProcess />
      <IdleTimeIndicator />

      {/* Upcoming missions */}
      <div className="animate-fade-up" style={{ animationDelay: "140ms" }}>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Up Next</h3>
        <div className="space-y-2.5">
          {UPCOMING_MISSIONS.map((mission, i) => (
            <div
              key={mission.id}
              className="glass glass-hover flex items-center gap-3 rounded-xl p-4 transition-transform duration-200 active:scale-[0.99]"
              style={{ animationDelay: `${180 + i * 60}ms` }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{mission.task}</p>
                <p className="truncate text-xs text-muted-foreground">{mission.destination}</p>
              </div>
              <div className="text-right">
                <p className="font-mono-data text-xs font-semibold text-foreground">{mission.eta}</p>
                <p className="text-[10px] text-muted-foreground">ETA</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </OperatorShell>
  );
}

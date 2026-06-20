import { Navigation2, Gauge, Clock3, Route as RouteIcon, Check, AlertCircle } from "lucide-react";
import OperatorShell from "../components/OperatorShell";
import { ROUTE_STEPS, ROUTE_STATS } from "../data/operatorData";
import { cn } from "../lib/utils";

const STEP_STYLES = {
  done: { dot: "bg-success border-success", line: "bg-success/40", text: "text-muted-foreground" },
  current: { dot: "bg-primary border-primary animate-pulse-dot", line: "surface-divider", text: "text-foreground" },
  upcoming: { dot: "bg-transparent border-border", line: "surface-divider", text: "text-muted-foreground" },
};

export default function OperatorRoutePage() {
  return (
    <OperatorShell>
      <div className="animate-fade-in">
        <p className="text-sm text-muted-foreground">Active mission MSN-4471</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Route Guidance</h1>
      </div>

      {/* Next turn banner */}
      <div className="glass-elevated animate-fade-up flex items-center gap-4 rounded-2xl p-5" style={{ animationDelay: "60ms" }}>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Navigation2 className="h-7 w-7" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Next instruction</p>
          <p className="font-display text-base font-bold text-foreground">{ROUTE_STATS.nextTurn}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass hover-lift animate-fade-up rounded-xl p-4 text-center" style={{ animationDelay: "110ms" }}>
          <RouteIcon className="mx-auto mb-1.5 h-4 w-4 text-primary" />
          <p className="font-mono-data text-lg font-bold text-foreground">{ROUTE_STATS.distanceKm} km</p>
          <p className="text-[11px] text-muted-foreground">Remaining</p>
        </div>
        <div className="glass hover-lift animate-fade-up rounded-xl p-4 text-center" style={{ animationDelay: "150ms" }}>
          <Clock3 className="mx-auto mb-1.5 h-4 w-4 text-primary" />
          <p className="font-mono-data text-lg font-bold text-foreground">{ROUTE_STATS.etaMinutes} min</p>
          <p className="text-[11px] text-muted-foreground">ETA</p>
        </div>
        <div className="glass hover-lift animate-fade-up rounded-xl p-4 text-center" style={{ animationDelay: "190ms" }}>
          <Gauge className="mx-auto mb-1.5 h-4 w-4 text-primary" />
          <p className="font-mono-data text-lg font-bold text-foreground">{ROUTE_STATS.avgSpeedKph} km/h</p>
          <p className="text-[11px] text-muted-foreground">Avg speed</p>
        </div>
      </div>

      {/* Route steps */}
      <div className="glass animate-fade-up rounded-2xl p-5" style={{ animationDelay: "240ms" }}>
        <h3 className="mb-4 text-sm font-semibold text-foreground">Route Checkpoints</h3>
        <div className="space-y-0">
          {ROUTE_STEPS.map((step, i) => {
            const style = STEP_STYLES[step.status];
            const isLast = i === ROUTE_STEPS.length - 1;
            return (
              <div key={step.id} className="flex gap-3.5">
                <div className="flex flex-col items-center">
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300", style.dot)}>
                    {step.status === "done" && <Check className="h-3.5 w-3.5 text-foreground animate-scale-in" />}
                  </span>
                  {!isLast && <span className={cn("w-0.5 flex-1 transition-colors duration-300", style.line)} style={{ minHeight: 32 }} />}
                </div>
                <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
                  <p className={cn("text-sm font-semibold", style.text, step.status === "current" && "text-foreground")}>
                    {step.label}
                  </p>
                  <p className="mt-0.5 flex items-start gap-1.5 text-xs text-muted-foreground">
                    {step.status === "current" && <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />}
                    {step.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </OperatorShell>
  );
}

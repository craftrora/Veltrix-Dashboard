import { Crosshair, Shovel, Truck, Hourglass, ArrowDownToLine, RotateCcw, Repeat } from "lucide-react";
import { PRODUCTION_PROCESS } from "../data/operatorData";
import { cn } from "../lib/utils";

const STAGE_ICON = {
  spot: Crosshair,
  load: Shovel,
  haul: Truck,
  queue: Hourglass,
  dump: ArrowDownToLine,
  return: RotateCcw,
};

const STATE_STYLE = {
  done: { ring: "border-success bg-success/15 text-success", line: "bg-success/50" },
  current: { ring: "border-primary bg-primary/15 text-primary animate-pulse-dot", line: "surface-divider" },
  upcoming: { ring: "border-border bg-foreground/[0.03] text-muted-foreground", line: "surface-divider" },
};

export default function ProductionProcess() {
  const p = PRODUCTION_PROCESS;
  const onTarget = p.cycleTimeMin <= p.targetCycleMin;

  return (
    <div className="glass animate-fade-up rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Production Process</h3>
          <p className="text-xs text-muted-foreground">Load–haul–dump cycle</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full surface-chip px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <Repeat className="h-3 w-3" /> Cycle #{p.cycleNumber}
        </span>
      </div>

      {/* Stage flow */}
      <div className="flex items-start">
        {p.stages.map((stage, i) => {
          const Icon = STAGE_ICON[stage.icon] ?? Crosshair;
          const style = STATE_STYLE[stage.status];
          const isLast = i === p.stages.length - 1;
          return (
            <div key={stage.id} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <span className="flex-1" />
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300", style.ring)}>
                  <Icon className="h-4 w-4" />
                </span>
                {!isLast ? (
                  <span className={cn("h-0.5 flex-1 rounded-full transition-colors duration-300", STATE_STYLE[stage.status].line)} />
                ) : (
                  <span className="flex-1" />
                )}
              </div>
              <p className={cn("mt-1.5 text-center text-[11px] font-semibold", stage.status === "upcoming" ? "text-muted-foreground" : "text-foreground")}>
                {stage.label}
              </p>
              <p className="text-center text-[9px] leading-tight text-muted-foreground">{stage.durationMin}m</p>
            </div>
          );
        })}
      </div>

      {/* Current stage detail + cycle time */}
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-foreground/[0.02] p-3.5">
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">Current stage</p>
          <p className="truncate text-sm font-semibold text-foreground">
            {p.stages.find((s) => s.status === "current")?.label} —{" "}
            <span className="font-normal text-muted-foreground">{p.stages.find((s) => s.status === "current")?.description}</span>
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11px] text-muted-foreground">Cycle time</p>
          <p className={cn("font-mono-data text-sm font-bold", onTarget ? "text-success" : "text-warning")}>
            {p.cycleTimeMin}m <span className="text-[10px] font-medium text-muted-foreground">/ {p.targetCycleMin}m</span>
          </p>
        </div>
      </div>
    </div>
  );
}

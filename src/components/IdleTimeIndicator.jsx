import { Timer, Pause, Play, TrendingDown } from "lucide-react";
import { IDLE_STATUS } from "../data/operatorData";
import { cn } from "../lib/utils";

export default function IdleTimeIndicator() {
  const s = IDLE_STATUS;
  const isIdle = s.state === "idle";
  const pct = Math.min(100, Math.round((s.idleTodayMin / s.targetIdleMin) * 100));
  const underTarget = s.idleTodayMin <= s.targetIdleMin;
  const maxBar = Math.max(...s.breakdown.map((b) => b.min));

  return (
    <div className="glass animate-fade-up rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              isIdle ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
            )}
          >
            {isIdle ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Idle Time</h3>
            <p className={cn("text-xs font-medium", isIdle ? "text-warning" : "text-success")}>
              {isIdle ? `Idle now · ${s.currentIdleMin} min` : "Moving — engine under load"}
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full surface-chip px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          {s.idlePctOfShift}% of shift
        </span>
      </div>

      {/* Today vs target */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Timer className="h-3.5 w-3.5" /> Idle today
          </span>
          <span className={cn("font-mono-data font-semibold", underTarget ? "text-success" : "text-warning")}>
            {s.idleTodayMin} min <span className="text-[10px] font-medium text-muted-foreground">/ {s.targetIdleMin} target</span>
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full surface-track">
          <div
            className={cn("h-full rounded-full transition-all duration-700", underTarget ? "bg-success" : "bg-warning")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {s.breakdown.map((b) => (
          <div key={b.reason} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-[11px] text-muted-foreground">{b.reason}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full surface-track">
              <div className="h-full rounded-full bg-primary/70" style={{ width: `${(b.min / maxBar) * 100}%` }} />
            </div>
            <span className="w-10 shrink-0 text-right font-mono-data text-[11px] text-foreground">{b.min}m</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-foreground/[0.02] p-3">
        <TrendingDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Last idle: <span className="text-foreground/90">{s.lastIdleEvent.reason}</span> · {s.lastIdleEvent.durationMin} min at {s.lastIdleEvent.time}.
          Tracking under the {s.targetIdleMin}-min shift target.
        </p>
      </div>
    </div>
  );
}

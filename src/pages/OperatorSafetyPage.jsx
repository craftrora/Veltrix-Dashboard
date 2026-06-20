import { ShieldAlert, AlertOctagon, AlertTriangle, Info, CheckSquare, Square } from "lucide-react";
import OperatorShell from "../components/OperatorShell";
import { SAFETY_ALERTS, SAFETY_CHECKLIST } from "../data/operatorData";
import { cn } from "../lib/utils";

const SEVERITY_META = {
  critical: { icon: AlertOctagon, color: "text-destructive", bg: "bg-destructive/[0.07] border-destructive/25" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/[0.07] border-warning/25" },
  info: { icon: Info, color: "text-sky-400", bg: "bg-sky-500/[0.07] border-sky-500/25" },
};

export default function OperatorSafetyPage() {
  const completedCount = SAFETY_CHECKLIST.filter((c) => c.done).length;

  return (
    <OperatorShell>
      <div className="animate-fade-in">
        <p className="text-sm text-muted-foreground">Site 4 — real-time alerts</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Safety Guardian</h1>
      </div>

      {/* Critical banner if any */}
      {SAFETY_ALERTS.some((a) => a.severity === "critical") && (
        <div className="animate-fade-up flex items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4" style={{ animationDelay: "40ms" }}>
          <ShieldAlert className="h-6 w-6 shrink-0 animate-pulse-dot text-destructive" />
          <p className="text-sm font-semibold text-destructive">
            Active hazard nearby — review alert below before proceeding.
          </p>
        </div>
      )}

      {/* Alerts feed */}
      <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Recent Alerts</h3>
        <div className="space-y-3">
          {SAFETY_ALERTS.map((alert, i) => {
            const meta = SEVERITY_META[alert.severity];
            return (
              <div
                key={alert.id}
                className={cn("hover-lift animate-fade-up rounded-2xl border p-4", meta.bg)}
                style={{ animationDelay: `${140 + i * 70}ms` }}
              >
                <div className="flex items-start gap-3">
                  <meta.icon className={cn("mt-0.5 h-5 w-5 shrink-0", meta.color)} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                      <span className="shrink-0 font-mono-data text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{alert.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pre-shift checklist */}
      <div className="glass animate-fade-up rounded-2xl p-5" style={{ animationDelay: "360ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Pre-Shift Checklist</h3>
          <span className="font-mono-data text-xs text-muted-foreground">
            {completedCount}/{SAFETY_CHECKLIST.length} complete
          </span>
        </div>
        <div className="space-y-1">
          {SAFETY_CHECKLIST.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-foreground/[0.02]">
              {item.done ? (
                <CheckSquare className="h-5 w-5 shrink-0 animate-scale-in text-success" />
              ) : (
                <Square className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <span className={cn("text-sm transition-colors duration-200", item.done ? "text-muted-foreground line-through" : "text-foreground/90")}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </OperatorShell>
  );
}

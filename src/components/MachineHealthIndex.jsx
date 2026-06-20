import { useState } from "react";
import { HeartPulse, ChevronDown, Wrench } from "lucide-react";
import { MACHINE_HEALTH } from "../data/supervisorData";
import { cn } from "../lib/utils";

const RISK_META = {
  low: { label: "Low risk", color: "var(--color-success)" },
  medium: { label: "Watch", color: "var(--color-warning)" },
  high: { label: "Critical", color: "var(--color-destructive)" },
};

function healthColor(score) {
  if (score >= 80) return "var(--color-success)";
  if (score >= 55) return "var(--color-warning)";
  return "var(--color-destructive)";
}

/** Tiny inline sparkline built from a 0-100 trend array — no chart library needed. */
function Sparkline({ trend, color }) {
  const w = 160;
  const h = 36;
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const range = max - min || 1;
  const points = trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {trend.map((v, i) => {
        const x = (i / (trend.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        const isLast = i === trend.length - 1;
        return isLast ? <circle key={i} cx={x} cy={y} r="3" fill={color} /> : null;
      })}
    </svg>
  );
}

export default function MachineHealthIndex() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="glass rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <HeartPulse className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-sm font-bold text-foreground">Machine Health Index</h3>
          <p className="text-xs text-muted-foreground">Predictive condition score per unit — click a row for the 7-day trend</p>
        </div>
      </div>

      <div className="space-y-1">
        {MACHINE_HEALTH.map((m) => {
          const color = healthColor(m.health);
          const risk = RISK_META[m.risk];
          const isExpanded = expandedId === m.id;
          return (
            <div key={m.id}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : m.id)}
                className="flex w-full items-center gap-3.5 rounded-lg px-1.5 py-2 transition-colors duration-150 hover:bg-foreground/[0.03]"
              >
                <div className="w-28 shrink-0 text-left">
                  <p className="font-mono-data text-xs font-semibold text-foreground">{m.id}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{m.name}</p>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 overflow-hidden rounded-full surface-track">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${m.health}%`, background: color }}
                    />
                  </div>
                </div>
                <span className="w-9 shrink-0 text-right font-mono-data text-xs font-semibold text-foreground">
                  {m.health}
                </span>
                <span
                  className="hidden w-20 shrink-0 rounded-full px-2 py-0.5 text-center text-[10px] font-semibold sm:block"
                  style={{ background: `${risk.color}1f`, color: risk.color }}
                >
                  {risk.label}
                </span>
                <ChevronDown
                  className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200", isExpanded && "rotate-180")}
                />
              </button>

              {isExpanded && (
                <div className="animate-fade-up ml-1.5 mb-2 mt-1 rounded-lg border border-border bg-foreground/[0.02] p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">7-day health trend</p>
                      <Sparkline trend={m.trend} color={color} />
                    </div>
                    <div className="max-w-xs flex-1">
                      <p className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        <Wrench className="h-3 w-3" /> Recommendation
                      </p>
                      <p className="text-xs leading-relaxed text-foreground/85">{m.recommendation}</p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        Next service: <span className="font-medium text-foreground/80">{m.nextService}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

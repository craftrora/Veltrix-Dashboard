import { useState } from "react";
import { Scale, ArrowRight, Check, ChevronDown } from "lucide-react";
import { STATUS_META, FLEET_STATUS_COUNTS, FLEET_UNITS } from "../data/supervisorData";
import { cn } from "../lib/utils";

export default function FleetBalancer() {
  const total = FLEET_UNITS.length;
  const [expandedStatus, setExpandedStatus] = useState(null);
  const [suggestionApplied, setSuggestionApplied] = useState(false);

  return (
    <div className="glass rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Scale className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-sm font-bold text-foreground">AI Fleet Balancer</h3>
          <p className="text-xs text-muted-foreground">Live allocation across {total} units — click a status to see units</p>
        </div>
      </div>

      <div className="mb-4 flex h-2.5 overflow-hidden rounded-full surface-track">
        {Object.entries(STATUS_META).map(([key, meta]) => {
          const count = FLEET_STATUS_COUNTS[key] ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setExpandedStatus(expandedStatus === key ? null : key)}
              style={{ width: `${(count / total) * 100}%`, background: meta.color }}
              className={cn(
                "h-full cursor-pointer transition-opacity duration-150 first:rounded-l-full last:rounded-r-full hover:opacity-80",
                expandedStatus && expandedStatus !== key && "opacity-50"
              )}
            />
          );
        })}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2.5">
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setExpandedStatus(expandedStatus === key ? null : key)}
            className={cn(
              "flex items-center gap-2 rounded-md px-1.5 py-1 text-xs transition-colors duration-150",
              expandedStatus === key ? "bg-foreground/[0.05]" : "hover:bg-foreground/[0.03]"
            )}
          >
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: meta.color }} />
            <span className="text-muted-foreground">{meta.label}</span>
            <span className="ml-auto font-mono-data font-medium text-foreground">
              {FLEET_STATUS_COUNTS[key] ?? 0}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200",
                expandedStatus === key && "rotate-180"
              )}
            />
          </button>
        ))}
      </div>

      {expandedStatus && (
        <div className="animate-fade-up mb-4 rounded-lg border border-border bg-foreground/[0.02] p-3">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            {STATUS_META[expandedStatus].label} units
          </p>
          <div className="flex flex-wrap gap-1.5">
            {FLEET_UNITS.filter((u) => u.status === expandedStatus).map((u) => (
              <span
                key={u.id}
                className="rounded-md px-2 py-1 font-mono-data text-[11px] font-medium"
                style={{ background: `${STATUS_META[expandedStatus].color}1a`, color: STATUS_META[expandedStatus].color }}
              >
                {u.id}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-primary/20 bg-primary/[0.06] p-3.5">
        <p className="mb-2 text-xs leading-relaxed text-foreground/90">
          Moving <span className="font-semibold text-primary">HT-029</span> from Pit B to
          Pit A would reduce average queue time by an estimated 6.2 minutes per cycle.
        </p>
        <button
          onClick={() => setSuggestionApplied(true)}
          disabled={suggestionApplied}
          className={cn(
            "flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200",
            suggestionApplied ? "text-success" : "text-primary hover:text-primary-hover"
          )}
        >
          {suggestionApplied ? (
            <>
              <Check className="h-3 w-3 animate-scale-in" /> Suggestion applied
            </>
          ) : (
            <>
              Apply suggestion <ArrowRight className="h-3 w-3" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

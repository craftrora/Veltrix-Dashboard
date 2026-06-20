import { BrainCircuit, ChevronRight } from "lucide-react";
import { AI_RECOMMENDATIONS } from "../data/supervisorData";
import { cn } from "../lib/utils";

const PRIORITY_META = {
  high: { label: "High priority", color: "var(--color-destructive)" },
  medium: { label: "Medium", color: "var(--color-warning)" },
  low: { label: "Low", color: "var(--color-chart-2)" },
};

export default function AiRecommendationPanel() {
  return (
    <div className="glass rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <BrainCircuit className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-sm font-bold text-foreground">AI Recommendations</h3>
          <p className="text-xs text-muted-foreground">Ranked by estimated impact</p>
        </div>
      </div>

      <div className="space-y-3">
        {AI_RECOMMENDATIONS.map((rec) => {
          const meta = PRIORITY_META[rec.priority];
          return (
            <button
              key={rec.id}
              className="group w-full rounded-lg border border-border bg-foreground/[0.02] p-3.5 text-left transition-colors hover:border-primary/30 hover:bg-foreground/[0.04]"
            >
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span
                  className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide")}
                  style={{ background: `${meta.color}1f`, color: meta.color }}
                >
                  {meta.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mb-1 text-sm font-medium text-foreground">{rec.title}</p>
              <p className="mb-2 text-xs leading-relaxed text-muted-foreground">{rec.detail}</p>
              <p className="text-[11px] font-medium text-primary">{rec.impact}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

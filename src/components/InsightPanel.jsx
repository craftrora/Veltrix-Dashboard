import { Sparkles, TrendingUp, TrendingDown, Info } from "lucide-react";

const TYPE_META = {
  positive: { icon: TrendingUp, color: "var(--color-success)" },
  negative: { icon: TrendingDown, color: "var(--color-destructive)" },
  neutral: { icon: Info, color: "var(--color-chart-2)" },
};

/**
 * Renders a list of auto-generated insight sentences (from insightEngine.js)
 * with a small colored icon indicating whether each point is positive,
 * negative, or neutral.
 * @param {{ title?: string, insights: { type: "positive"|"negative"|"neutral", text: string }[], delay?: number }} props
 */
export default function InsightPanel({ title = "Auto-Generated Insights", insights, delay = 0 }) {
  if (!insights?.length) return null;

  return (
    <div className="glass animate-fade-up rounded-xl p-5" style={{ animationDelay: `${delay}ms` }}>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-sm font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">Computed live from current data</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, i) => {
          const meta = TYPE_META[insight.type] ?? TYPE_META.neutral;
          return (
            <div
              key={i}
              className="animate-fade-up flex items-start gap-2.5 rounded-lg border border-border bg-foreground/[0.02] p-3"
              style={{ animationDelay: `${delay + 80 + i * 70}ms` }}
            >
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                style={{ background: `${meta.color}1f`, color: meta.color }}
              >
                <meta.icon className="h-3 w-3" />
              </span>
              <p className="text-xs leading-relaxed text-foreground/85">{insight.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

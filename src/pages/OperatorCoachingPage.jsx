import { Sparkles, Fuel, Timer, Target as TargetIcon, CheckCircle2 } from "lucide-react";
import OperatorShell from "../components/OperatorShell";
import { AI_COACHING_TIPS } from "../data/operatorData";
import { cn } from "../lib/utils";

const CATEGORY_META = {
  "Fuel efficiency": { icon: Fuel, color: "text-emerald-400 bg-emerald-500/15" },
  "Cycle time": { icon: Timer, color: "text-sky-400 bg-sky-500/15" },
  Technique: { icon: TargetIcon, color: "text-primary bg-primary/15" },
};

export default function OperatorCoachingPage() {
  return (
    <OperatorShell>
      <div className="animate-fade-in">
        <p className="text-sm text-muted-foreground">Personalized for your driving style</p>
        <h1 className="font-display text-2xl font-bold text-foreground">AI Coaching</h1>
      </div>

      <div className="glass-elevated animate-fade-up flex items-center gap-4 rounded-2xl p-5" style={{ animationDelay: "60ms" }}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-6 w-6" />
        </span>
        <p className="text-sm leading-relaxed text-foreground/90">
          Based on your last 5 shifts, here are the highest-impact ways to improve your score.
        </p>
      </div>

      <div className="space-y-3.5">
        {AI_COACHING_TIPS.map((tip, i) => {
          const meta = CATEGORY_META[tip.category];
          const isOptimal = tip.impact === "Already optimal";
          return (
            <div
              key={tip.id}
              className="glass glass-hover animate-fade-up rounded-2xl p-5"
              style={{ animationDelay: `${120 + i * 70}ms` }}
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", meta.color)}>
                  <meta.icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {tip.category}
                </span>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-foreground/90">{tip.tip}</p>
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  isOptimal ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                )}
              >
                {isOptimal && <CheckCircle2 className="h-3 w-3" />}
                {tip.impact}
              </div>
            </div>
          );
        })}
      </div>
    </OperatorShell>
  );
}

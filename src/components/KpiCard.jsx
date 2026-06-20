import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../lib/utils";
import { useCountUp } from "../lib/useCountUp";

/**
 * @param {{
 *  label: string,
 *  value: string | number,
 *  unit?: string,
 *  deltaPct?: number,
 *  trend?: "up" | "down",
 *  icon?: React.ReactNode,
 *  positiveIsGood?: boolean,
 *  accent?: "orange" | "sky" | "violet" | "emerald",
 *  delay?: number,
 *  decimals?: number,
 * }} props
 */
const ACCENTS = {
  orange: "bg-primary/15 text-primary",
  sky: "bg-sky-500/15 text-sky-400",
  violet: "bg-violet-500/15 text-violet-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
};

export default function KpiCard({
  label,
  value,
  unit,
  deltaPct,
  trend,
  icon,
  positiveIsGood = true,
  accent = "orange",
  delay = 0,
  decimals = 0,
}) {
  const isPositive = trend === "up";
  const isGoodChange = positiveIsGood ? isPositive : !isPositive;

  // Parse numeric value out of strings like "18,420" for the count-up animation;
  // falls back to displaying the raw value if it isn't a clean number.
  const numericValue =
    typeof value === "number" ? value : parseFloat(String(value).replace(/,/g, ""));
  const isAnimatable = !Number.isNaN(numericValue);
  const animatedValue = useCountUp(isAnimatable ? numericValue : 0, 900, decimals);
  const displayValue = isAnimatable
    ? decimals > 0
      ? animatedValue
      : Math.round(animatedValue).toLocaleString()
    : value;

  return (
    <div
      className="glass glass-hover hover-lift animate-fade-up relative overflow-hidden rounded-xl p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background:
            accent === "orange"
              ? "linear-gradient(90deg, transparent, #f97316, transparent)"
              : accent === "sky"
              ? "linear-gradient(90deg, transparent, #38bdf8, transparent)"
              : accent === "violet"
              ? "linear-gradient(90deg, transparent, #a78bfa, transparent)"
              : "linear-gradient(90deg, transparent, #34d399, transparent)",
        }}
      />

      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg transition-transform duration-300", ACCENTS[accent])}>
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="font-display font-mono-data text-3xl font-bold text-foreground">
          {displayValue}
        </span>
        {unit && <span className="mb-1 text-sm text-muted-foreground">{unit}</span>}
      </div>

      {typeof deltaPct === "number" && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            isGoodChange ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          )}
        >
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(deltaPct)}% vs yesterday
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { TrendingUp, Trophy, Award, Medal, X, Package, Fuel } from "lucide-react";
import OperatorShell from "../components/OperatorShell";
import InsightPanel from "../components/InsightPanel";
import { useCountUp } from "../lib/useCountUp";
import { generatePerformanceInsight } from "../lib/insightEngine";
import {
  PERFORMANCE_SCORE,
  SHIFT_HISTORY,
  LEADERBOARD,
  ACHIEVEMENT_BADGES,
} from "../data/operatorData";
import { cn } from "../lib/utils";

const TIER_STYLES = {
  bronze: "from-amber-700/30 to-amber-700/5 text-amber-500 border-amber-700/30",
  silver: "from-slate-300/25 to-slate-300/5 text-slate-300 border-slate-300/25",
  gold: "from-yellow-400/25 to-yellow-400/5 text-yellow-400 border-yellow-400/25",
  platinum: "from-sky-300/25 to-sky-300/5 text-sky-300 border-sky-300/25",
};

function ScoreTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated rounded-lg px-3 py-2 text-xs">
      <p className="mb-0.5 font-medium text-foreground">{label}</p>
      <p className="font-mono-data text-foreground">{payload[0].value} pts</p>
    </div>
  );
}

function ScoreGauge({ score, size = 168 }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score)) / 100;
  const dashOffset = circumference * (1 - progress);
  const color = score >= 85 ? "var(--color-success)" : score >= 65 ? "var(--color-warning)" : "var(--color-destructive)";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease" }}
      />
    </svg>
  );
}

export default function OperatorPerformancePage() {
  const animatedScore = useCountUp(PERFORMANCE_SCORE.overall, 1100);
  const [selectedShiftDay, setSelectedShiftDay] = useState(null);
  const performanceInsight = generatePerformanceInsight(PERFORMANCE_SCORE);

  return (
    <OperatorShell>
      <div className="animate-fade-in">
        <p className="text-sm text-muted-foreground">This shift's performance</p>
        <h1 className="font-display text-2xl font-bold text-foreground">Performance Score</h1>
      </div>

      {/* Overall score */}
      <div className="glass-elevated animate-fade-up rounded-2xl p-6 text-center" style={{ animationDelay: "60ms" }}>
        <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Overall score</p>
        <div className="relative mx-auto flex h-[168px] w-[168px] items-center justify-center">
          <ScoreGauge score={PERFORMANCE_SCORE.overall} />
          <p className="font-display font-mono-data absolute text-5xl font-bold text-foreground">{animatedScore}</p>
        </div>
        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
          <TrendingUp className="h-3 w-3" />
          +{PERFORMANCE_SCORE.deltaPts} pts vs last shift
        </div>
      </div>

      {/* Breakdown — bars + radar */}
      <div className="glass animate-fade-up rounded-2xl p-5" style={{ animationDelay: "110ms" }}>
        <h3 className="mb-4 text-sm font-semibold text-foreground">Score Breakdown</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-center">
          <div className="space-y-4">
            {PERFORMANCE_SCORE.breakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-foreground/90">{item.label}</span>
                  <span className="font-mono-data text-xs font-semibold text-foreground">{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full surface-track">
                  <div className="h-full rounded-full bg-primary transition-all duration-700 ease-out" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={PERFORMANCE_SCORE.breakdown} outerRadius="75%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 9.5 }} />
                <Radar
                  dataKey="value"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  animationDuration={900}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Auto-generated insight */}
      <InsightPanel title="Coaching Insight" insights={[performanceInsight]} delay={140} />

      {/* Shift history */}
      <div className="glass animate-fade-up rounded-2xl p-5" style={{ animationDelay: "230ms" }}>
        <h3 className="mb-4 text-sm font-semibold text-foreground">5-Day Trend — tap a point for details</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={SHIFT_HISTORY}
              margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
              onClick={(state) => {
                const day = state?.activePayload?.[0]?.payload;
                if (day) setSelectedShiftDay(selectedShiftDay?.day === day.day ? null : day);
              }}
            >
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip content={<ScoreTooltip />} cursor={{ stroke: "rgba(249,115,22,0.3)" }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#f97316", className: "cursor-pointer" }}
                activeDot={{ r: 5, className: "cursor-pointer" }}
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {selectedShiftDay && (
          <div className="animate-fade-up mt-3 rounded-lg border border-border bg-foreground/[0.02] p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{selectedShiftDay.day} — {selectedShiftDay.score} pts</span>
              <button
                onClick={() => setSelectedShiftDay(null)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close detail"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Package className="h-3 w-3" /> {selectedShiftDay.loads} loads completed
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Fuel className="h-3 w-3" /> {selectedShiftDay.fuelUsed} L used
              </div>
            </div>
            <p className="text-xs leading-relaxed text-foreground/80">{selectedShiftDay.note}</p>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="glass animate-fade-up rounded-2xl p-5" style={{ animationDelay: "290ms" }}>
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Site Leaderboard — Today</h3>
        </div>
        <div className="space-y-2">
          {LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                "flex items-center gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-foreground/[0.02]",
                entry.isCurrentUser ? "border border-primary/30 bg-primary/[0.08]" : "border border-transparent"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  entry.rank === 1 && "bg-yellow-400/20 text-yellow-400",
                  entry.rank === 2 && "bg-slate-300/20 text-slate-300",
                  entry.rank === 3 && "bg-amber-700/20 text-amber-600",
                  entry.rank > 3 && "bg-foreground/5 text-muted-foreground"
                )}
              >
                {entry.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm font-medium", entry.isCurrentUser ? "text-primary" : "text-foreground/90")}>
                  {entry.name} {entry.isCurrentUser && "(You)"}
                </p>
                <p className="text-xs text-muted-foreground">{entry.unit}</p>
              </div>
              <span className="font-mono-data text-sm font-bold text-foreground">{entry.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement badges */}
      <div className="glass animate-fade-up rounded-2xl p-5" style={{ animationDelay: "350ms" }}>
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Achievement Badges</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ACHIEVEMENT_BADGES.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "hover-lift rounded-xl border bg-gradient-to-br p-3.5 text-center transition-opacity duration-300",
                badge.earned ? TIER_STYLES[badge.tier] : "border-border from-foreground/[0.02] to-transparent text-muted-foreground opacity-50"
              )}
            >
              <Medal className="mx-auto mb-2 h-6 w-6" />
              <p className="text-xs font-semibold">{badge.label}</p>
              <p className="mt-1 text-[10px] leading-snug opacity-80">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </OperatorShell>
  );
}

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { BarChart3 } from "lucide-react";
import { PRODUCTION_TREND } from "../data/supervisorData";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated rounded-lg px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      <p className="font-mono-data text-foreground">
        {payload[0].value.toLocaleString()} t
      </p>
    </div>
  );
}

export default function ProductionTrend() {
  return (
    <div className="glass rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <BarChart3 className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-display text-sm font-bold text-foreground">Production — Last 7 Days</h3>
          <p className="text-xs text-muted-foreground">Tonnes extracted vs daily target</p>
        </div>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PRODUCTION_TREND} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="prod-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(249,115,22,0.3)" }} />
            <Area
              type="monotone"
              dataKey="tonnes"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#prod-fill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

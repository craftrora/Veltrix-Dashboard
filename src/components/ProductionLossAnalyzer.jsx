import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle, X, Wrench } from "lucide-react";
import { PRODUCTION_LOSS_BREAKDOWN } from "../data/supervisorData";

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="glass-elevated rounded-lg px-3 py-2 text-xs">
      <p className="mb-0.5 font-medium text-foreground">{item.reason}</p>
      <p className="font-mono-data text-muted-foreground">{item.hours}h lost</p>
      <p className="mt-1 text-[10px] text-primary">Click for details</p>
    </div>
  );
}

export default function ProductionLossAnalyzer() {
  const totalHours = PRODUCTION_LOSS_BREAKDOWN.reduce((sum, d) => sum + d.hours, 0);
  const [selectedReason, setSelectedReason] = useState(null);

  return (
    <div className="glass rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground">Production Loss Analyzer</h3>
            <p className="text-xs text-muted-foreground">{totalHours.toFixed(1)}h lost today, by cause — click a bar for details</p>
          </div>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={PRODUCTION_LOSS_BREAKDOWN}
            layout="vertical"
            margin={{ left: 0, right: 12, top: 0, bottom: 0 }}
            onClick={(state) => {
              const item = state?.activePayload?.[0]?.payload;
              if (item) setSelectedReason(selectedReason?.reason === item.reason ? null : item);
            }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="reason"
              width={140}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(249,115,22,0.06)" }} />
            <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={14} animationDuration={800} className="cursor-pointer">
              {PRODUCTION_LOSS_BREAKDOWN.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  opacity={selectedReason && selectedReason.reason !== entry.reason ? 0.4 : 1}
                  style={{ transition: "opacity 0.2s ease" }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {selectedReason && (
        <div className="animate-fade-up mt-3 rounded-lg border border-border bg-foreground/[0.02] p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: selectedReason.color }} />
              <span className="text-sm font-semibold text-foreground">{selectedReason.reason}</span>
            </div>
            <button
              onClick={() => setSelectedReason(null)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close detail"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wrench className="h-3 w-3" /> Affected: {selectedReason.affectedUnits.join(", ")}
          </p>
          <p className="text-xs leading-relaxed text-foreground/80">{selectedReason.detail}</p>
        </div>
      )}
    </div>
  );
}

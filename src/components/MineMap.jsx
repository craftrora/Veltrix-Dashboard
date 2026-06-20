import { useState } from "react";
import { Maximize2, Truck, Mountain, Drill as DrillIcon } from "lucide-react";
import { FLEET_UNITS, STATUS_META, FLEET_STATUS_COUNTS } from "../data/supervisorData";
import { cn } from "../lib/utils";

const ZONES = [
  { name: "Pit A", x: 14, y: 10, w: 38, h: 42 },
  { name: "Pit B", x: 56, y: 12, w: 36, h: 38 },
  { name: "Pit C", x: 46, y: 54, w: 30, h: 30 },
  { name: "Waste Dump", x: 4, y: 54, w: 24, h: 30 },
];

const HAUL_ROADS = [
  "M 32,30 C 45,40 50,50 50,60",
  "M 70,25 C 65,40 62,50 60,60",
  "M 50,60 L 80,58",
  "M 22,62 L 35,46",
];

function UnitGlyph({ type, className }) {
  if (type === "haul-truck") return <Truck className={className} />;
  if (type === "drill") return <DrillIcon className={className} />;
  return <Mountain className={className} />;
}

export default function MineMap() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedZone, setSelectedZone] = useState(null);

  const visibleUnits = (filter === "all" ? FLEET_UNITS : FLEET_UNITS.filter((u) => u.status === filter)).filter(
    (u) => !selectedZone || u.zone.startsWith(selectedZone)
  );

  return (
    <div className="glass relative overflow-hidden rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h3 className="font-display text-base font-bold text-foreground">Live Mine Map</h3>
          <p className="text-xs text-muted-foreground">
            {selectedZone ? (
              <>
                Showing <span className="font-medium text-primary">{selectedZone}</span> ·{" "}
                <button onClick={() => setSelectedZone(null)} className="underline hover:text-foreground">
                  clear
                </button>
              </>
            ) : (
              "Real-time fleet position · Site 4 — click a zone or unit"
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filter === "all" ? "bg-primary text-primary-foreground" : "surface-chip text-muted-foreground hover:text-foreground"
            )}
          >
            All ({FLEET_UNITS.length})
          </button>
          {Object.entries(STATUS_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === key ? "bg-primary text-primary-foreground" : "surface-chip text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: filter === key ? "currentColor" : meta.color }}
              />
              {meta.label} ({FLEET_STATUS_COUNTS[key] ?? 0})
            </button>
          ))}
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full bg-[#0a0d12]">
        {/* Topographic backdrop */}
        <svg
          viewBox="0 0 100 62.5"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <pattern id="contour" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="4" fill="none" stroke="rgba(var(--glass-tint), 0.06)" strokeWidth="0.3" />
            </pattern>
            <radialGradient id="map-vignette" cx="50%" cy="40%" r="75%">
              <stop offset="0%" stopColor="#11151c" />
              <stop offset="100%" stopColor="#070a0e" />
            </radialGradient>
          </defs>
          <rect width="100" height="62.5" fill="url(#map-vignette)" />
          <rect width="100" height="62.5" fill="url(#contour)" />

          {/* Pit zones */}
          {ZONES.map((zone) => {
            const isZoneSelected = selectedZone === zone.name;
            return (
              <g
                key={zone.name}
                onClick={() => setSelectedZone(isZoneSelected ? null : zone.name)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.w}
                  height={zone.h}
                  rx="3"
                  fill={isZoneSelected ? "rgba(249,115,22,0.1)" : "rgba(249,115,22,0.04)"}
                  stroke={isZoneSelected ? "rgba(249,115,22,0.55)" : "rgba(249,115,22,0.18)"}
                  strokeWidth={isZoneSelected ? "0.5" : "0.3"}
                  strokeDasharray="1.2 1"
                  style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
                />
                <text
                  x={zone.x + 2.5}
                  y={zone.y + 4.5}
                  fontSize="2.6"
                  fill={isZoneSelected ? "rgba(249,115,22,0.9)" : "rgba(255,255,255,0.35)"}
                  fontFamily="var(--font-mono)"
                  letterSpacing="0.05em"
                  style={{ transition: "fill 0.2s ease" }}
                >
                  {zone.name.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Haul roads */}
          {HAUL_ROADS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
              strokeDasharray="0.2 1.4"
              strokeLinecap="round"
            />
          ))}
        </svg>

        {/* Unit markers (HTML overlay for crisp icons/hover) */}
        {visibleUnits.map((unit) => {
          const meta = STATUS_META[unit.status];
          const isSelected = selected?.id === unit.id;
          return (
            <button
              key={unit.id}
              onClick={() => setSelected(isSelected ? null : unit)}
              style={{ left: `${unit.x}%`, top: `${unit.y}%` }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
            >
              {unit.status === "active" && (
                <span
                  className="absolute inset-0 -m-1.5 animate-ping rounded-full opacity-40"
                  style={{ background: meta.color }}
                />
              )}
              <span
                className={cn(
                  "relative flex h-7 w-7 items-center justify-center rounded-full border-2 bg-[#0d1117] shadow-lg transition-transform",
                  "group-hover:scale-110",
                  isSelected && "scale-110 ring-2 ring-primary/60"
                )}
                style={{ borderColor: meta.color }}
              >
                <UnitGlyph type={unit.type} className="h-3.5 w-3.5" style={{ color: meta.color }} />
              </span>
            </button>
          );
        })}

        {/* Selected unit popover */}
        {selected && (
          <div
            className="glass-elevated absolute z-10 w-56 rounded-lg p-3.5 shadow-2xl"
            style={{
              left: `${Math.min(selected.x, 70)}%`,
              top: `${Math.min(selected.y + 8, 70)}%`,
            }}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono-data text-sm font-bold text-foreground">{selected.id}</span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                style={{ background: `${STATUS_META[selected.status].color}22`, color: STATUS_META[selected.status].color }}
              >
                {STATUS_META[selected.status].label}
              </span>
            </div>
            <p className="mb-2 text-xs text-muted-foreground">{selected.zone}</p>
            {selected.status === "active" && (
              <div>
                <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>Load</span>
                  <span className="font-mono-data text-foreground">{selected.load}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full surface-track">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${selected.load}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <button className="glass absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

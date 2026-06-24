import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Fuel, Plus, Minus, Crosshair, Maximize2, Wrench } from "lucide-react";
import {
  FLEET_UNITS, STATUS_META, FLEET_STATUS_COUNTS, MAP_LANDMARKS, FUEL_STATIONS,
} from "../data/supervisorData";
import { cn } from "../lib/utils";
import { catmullRom } from "../lib/geo";

/**
 * Live Mine Map — real satellite imagery via Leaflet + Esri World Imagery.
 * Tiles load client-side at runtime (no API key). The site is anchored over a
 * real open-pit mine so the terrain reads as an actual mining site; fleet,
 * landmark and fuel markers are laid over the imagery using the same relative
 * layout as the rest of the dashboard.
 *
 * To re-anchor to a different mine, change SITE_CENTER (and optionally SPAN_*).
 */
const SITE_CENTER = [-4.0535, 137.1155]; // Grasberg open pit, Papua
const SPAN_LAT = 0.030;
const SPAN_LNG = 0.046;
const toLatLng = (x, y) => [
  SITE_CENTER[0] + ((50 - y) / 100) * SPAN_LAT,
  SITE_CENTER[1] + ((x - 50) / 100) * SPAN_LNG,
];

const ESRI_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTR =
  "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community";

const svgIcon = (inner, color, size = 13) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

const FUEL_PATH =
  '<line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>';
const LANDMARK_PATH =
  '<path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01"/><path d="M9 12v.01"/><path d="M9 15v.01"/>';

function unitDivIcon(unit) {
  const meta = STATUS_META[unit.status];
  const ping =
    unit.status === "active"
      ? `<span class="animate-ping" style="position:absolute;inset:-4px;border-radius:9999px;background:${meta.color};opacity:.35;"></span>`
      : "";
  const html = `<div style="position:relative;width:28px;height:28px;">
      ${ping}
      <span style="position:relative;display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:#fff;border:2px solid ${meta.color};box-shadow:0 4px 10px rgba(0,0,0,.45);">
        <span style="width:9px;height:9px;border-radius:9999px;background:${meta.color};"></span>
      </span>
    </div>`;
  return L.divIcon({ html, className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
}

function labelDivIcon({ inner, ringColor, iconColor, label, labelColor }) {
  const html = `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:#fff;border:2px solid ${ringColor};box-shadow:0 3px 8px rgba(0,0,0,.45);">
        ${svgIcon(inner, iconColor)}
      </span>
      <span style="white-space:nowrap;font-size:9px;font-weight:700;color:${labelColor};text-shadow:0 1px 3px rgba(0,0,0,.95),0 0 2px rgba(0,0,0,.85);">${label}</span>
    </div>`;
  return L.divIcon({ html, className: "", iconSize: [90, 44], iconAnchor: [45, 13] });
}

function unitPopupHtml(unit) {
  const meta = STATUS_META[unit.status];
  const load =
    unit.status === "active"
      ? `<div style="margin-top:6px;font-size:11px;color:#334155;">Load: <strong style="font-family:ui-monospace,monospace;">${unit.load}%</strong></div>`
      : "";
  return `<div style="min-width:150px;font-family:inherit;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <strong style="font-family:ui-monospace,monospace;font-size:13px;color:#0f172a;">${unit.id}</strong>
        <span style="font-size:10px;font-weight:700;text-transform:uppercase;color:${meta.color};">${meta.label}</span>
      </div>
      <div style="font-size:11px;color:#64748b;margin-top:2px;">${unit.zone}</div>
      ${load}
    </div>`;
}

export default function MineMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const unitLayerRef = useRef(null);
  const fuelLayerRef = useRef(null);

  const [filter, setFilter] = useState("all");
  const [showFuel, setShowFuel] = useState(true);

  // Create map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    L.tileLayer(ESRI_URL, { attribution: ESRI_ATTR, maxZoom: 19 }).addTo(map);

    // Landmarks (static)
    const landmarkLayer = L.layerGroup().addTo(map);
    MAP_LANDMARKS.forEach((lm) => {
      L.marker(toLatLng(lm.x, lm.y), {
        icon: labelDivIcon({
          inner: LANDMARK_PATH,
          ringColor: "#e2e8f0",
          iconColor: "#475569",
          label: lm.name,
          labelColor: "#f6f4ef",
        }),
        interactive: false,
        keyboard: false,
      }).addTo(landmarkLayer);
    });

    // Haul-road network — smooth, curving roads (Catmull-Rom). Each road is a
    // list of [x%, y%] control points. Nudge these to trace the real roads in
    // your chosen imagery if you want an exact overlay.
    const ROADS = [
      [[32, 29], [50, 44], [70, 50], [86, 56], [89, 80]], // Pit A → Crusher → Stockpile (main haul)
      [[75, 28], [80, 42], [86, 56]],                     // Pit B → main haul
      [[32, 29], [53, 21], [75, 28]],                     // Pit A ↔ Pit B (top connector)
      [[32, 29], [22, 48], [16, 70], [42, 80], [64, 84]], // Pit A → Waste Dump → SPBU Workshop
      [[50, 44], [50, 66], [50, 80]],                     // main haul → Workshop
    ];
    const roadLayer = L.layerGroup().addTo(map);
    ROADS.forEach((pts) => {
      const ll = catmullRom(pts.map(([x, y]) => toLatLng(x, y)), 16);
      L.polyline(ll, { color: "#caa46a", weight: 5, opacity: 0.45, lineCap: "round", lineJoin: "round" }).addTo(roadLayer);
      L.polyline(ll, { color: "#fff3d6", weight: 1.3, opacity: 0.6, dashArray: "5 9", lineCap: "round" }).addTo(roadLayer);
    });

    // Pit / zone labels
    [["PIT A", 32, 29], ["PIT B", 75, 28], ["WASTE DUMP", 16, 70]].forEach(([name, x, y]) => {
      L.marker(toLatLng(x, y), {
        icon: L.divIcon({
          className: "",
          html: `<span style="font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:13px;letter-spacing:.08em;color:#fff;white-space:nowrap;text-shadow:0 1px 4px rgba(0,0,0,.95),0 0 3px rgba(0,0,0,.9);">${name}</span>`,
          iconSize: [110, 18],
          iconAnchor: [55, 9],
        }),
        interactive: false,
        keyboard: false,
      }).addTo(landmarkLayer);
    });

    unitLayerRef.current = L.layerGroup().addTo(map);
    fuelLayerRef.current = L.layerGroup();

    // Frame the site
    const bounds = L.latLngBounds([
      ...MAP_LANDMARKS.map((lm) => toLatLng(lm.x, lm.y)),
      ...FLEET_UNITS.map((u) => toLatLng(u.x, u.y)),
      ...FUEL_STATIONS.map((f) => toLatLng(f.x, f.y)),
    ]);
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 15 });

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Rebuild unit markers on filter change
  useEffect(() => {
    const layer = unitLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    const units = filter === "all" ? FLEET_UNITS : FLEET_UNITS.filter((u) => u.status === filter);
    units.forEach((unit) => {
      L.marker(toLatLng(unit.x, unit.y), { icon: unitDivIcon(unit) })
        .bindPopup(unitPopupHtml(unit))
        .addTo(layer);
    });
  }, [filter]);

  // Toggle fuel layer
  useEffect(() => {
    const map = mapRef.current;
    const fuelLayer = fuelLayerRef.current;
    if (!map || !fuelLayer) return;
    fuelLayer.clearLayers();
    if (showFuel) {
      FUEL_STATIONS.forEach((fs) => {
        L.marker(toLatLng(fs.x, fs.y), {
          icon: labelDivIcon({
            inner: FUEL_PATH,
            ringColor: "#34d399",
            iconColor: "#059669",
            label: fs.name,
            labelColor: "#6ee7b7",
          }),
        })
          .bindPopup(
            `<div style="text-align:center;min-width:120px;"><div style="font-size:11px;color:#64748b;">Diesel available</div><div style="font-family:ui-monospace,monospace;font-size:15px;font-weight:700;color:#0f172a;">${fs.dieselPct}%</div></div>`
          )
          .addTo(fuelLayer);
      });
      fuelLayer.addTo(map);
    } else {
      map.removeLayer(fuelLayer);
    }
  }, [showFuel]);

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const recenter = () => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = L.latLngBounds([
      ...MAP_LANDMARKS.map((lm) => toLatLng(lm.x, lm.y)),
      ...FLEET_UNITS.map((u) => toLatLng(u.x, u.y)),
    ]);
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 15 });
  };
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.();
    setTimeout(() => mapRef.current?.invalidateSize(), 250);
  };

  return (
    <div className="glass relative overflow-hidden rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h3 className="font-display text-base font-bold text-foreground">Live Mine Map</h3>
          <p className="text-xs text-muted-foreground">
            Real-time fleet position · Site 4 — satellite view · click a unit
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
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: filter === key ? "currentColor" : meta.color }} />
              {meta.label} ({FLEET_STATUS_COUNTS[key] ?? 0})
            </button>
          ))}
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden" style={{ background: "var(--sat-bg)" }}>
        <div ref={containerRef} className="absolute inset-0 h-full w-full" style={{ background: "var(--sat-bg)" }} />

        {/* Map controls */}
        <div className="absolute right-3 top-3 z-[500] flex flex-col gap-1.5">
          <button
            onClick={() => setShowFuel((v) => !v)}
            title="Toggle fuel stations"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border border-border backdrop-blur-sm transition-colors",
              showFuel ? "bg-emerald-400/15 text-emerald-400" : "bg-background/70 text-muted-foreground hover:text-foreground"
            )}
          >
            <Fuel className="h-4 w-4" />
          </button>
          <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-background/70 backdrop-blur-sm">
            <button onClick={zoomIn} title="Zoom in" className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"><Plus className="h-4 w-4" /></button>
            <span className="h-px bg-border" />
            <button onClick={zoomOut} title="Zoom out" className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"><Minus className="h-4 w-4" /></button>
          </div>
          <button onClick={recenter} title="Recenter" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"><Crosshair className="h-4 w-4" /></button>
          <button onClick={toggleFullscreen} title="Fullscreen" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"><Maximize2 className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Legend (static footer) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border px-5 py-2.5">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="h-1.5 w-5 rounded-full" style={{ background: "#caa46a" }} /> Haul road
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-success bg-white"><span className="h-1 w-1 rounded-full bg-success" /></span> Fleet unit
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Fuel className="h-3 w-3 text-emerald-400" /> Fuel station (SPBU)
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm"><Wrench className="h-2 w-2" /></span> Landmark
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground/70">Imagery: Esri World Imagery</span>
      </div>
    </div>
  );
}

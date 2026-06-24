import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ROUTE_WAYPOINTS, ROUTE_FUEL_STATION, ROUTE_TRUCK_POSITION } from "../data/operatorData";
import { cn } from "../lib/utils";
import { catmullRom } from "../lib/geo";

const ESRI_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ESRI_ATTR =
  "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community";

// Operator route corridor — anchored near the same site, tighter span.
const CENTER = [-4.052, 137.114];
const SPAN_LAT = 0.018;
const SPAN_LNG = 0.034;
const toLatLng = (x, y) => [
  CENTER[0] + ((50 - y) / 100) * SPAN_LAT,
  CENTER[1] + ((x - 50) / 100) * SPAN_LNG,
];

const WP_HEX = { done: "#22c55e", current: "#f97316", upcoming: "#94a3b8" };
const WP_COLOR = {
  done: "text-success",
  current: "text-primary",
  upcoming: "text-muted-foreground",
};

const svg = (inner, color, size = 13) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const WP_PATH = {
  load: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  checkpoint: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>',
  dump: '<path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/>',
};
const TRUCK_PATH =
  '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>';
const FUEL_PATH =
  '<line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>';

function pinIcon({ inner, ring, iconColor, label, labelColor, size = 26 }) {
  const lbl = label
    ? `<span style="margin-top:2px;white-space:nowrap;font-size:9px;font-weight:700;color:${labelColor};text-shadow:0 1px 3px rgba(0,0,0,.95),0 0 2px rgba(0,0,0,.85);">${label}</span>`
    : "";
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;flex-direction:column;align-items:center;">
        <span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:#fff;border:2px solid ${ring};box-shadow:0 3px 8px rgba(0,0,0,.45);">${svg(inner, iconColor)}</span>
        ${lbl}
      </div>`,
    iconSize: [90, size + 16],
    iconAnchor: [45, size / 2],
  });
}

export default function OperatorRouteMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
    });
    mapRef.current = map;
    L.tileLayer(ESRI_URL, { attribution: ESRI_ATTR, maxZoom: 19 }).addTo(map);

    const ctrlPts = ROUTE_WAYPOINTS.map((w) => toLatLng(w.x, w.y));
    const full = catmullRom(ctrlPts, 22);
    // road casing + dashed centerline (full planned route, smoothly curved)
    L.polyline(full, { color: "#caa46a", weight: 9, opacity: 0.85, lineCap: "round", lineJoin: "round" }).addTo(map);
    L.polyline(full, { color: "#fff3d6", weight: 1.6, opacity: 0.8, dashArray: "5 8", lineCap: "round" }).addTo(map);
    // traveled progress along the curve up to the current truck position
    const t = ROUTE_TRUCK_POSITION;
    const truckLL = toLatLng(t.x, t.y);
    let bestI = 0;
    let bestD = Infinity;
    full.forEach((p, i) => {
      const d = (p[0] - truckLL[0]) ** 2 + (p[1] - truckLL[1]) ** 2;
      if (d < bestD) { bestD = d; bestI = i; }
    });
    L.polyline(full.slice(0, bestI + 1), { color: "#22c55e", weight: 4.5, opacity: 0.95, lineCap: "round", lineJoin: "round" }).addTo(map);

    // waypoint markers
    ROUTE_WAYPOINTS.forEach((w) => {
      L.marker(toLatLng(w.x, w.y), {
        icon: pinIcon({
          inner: WP_PATH[w.kind] ?? WP_PATH.checkpoint,
          ring: WP_HEX[w.status] ?? WP_HEX.upcoming,
          iconColor: WP_HEX[w.status] ?? WP_HEX.upcoming,
          label: w.label,
          labelColor: "#f6f4ef",
        }),
        interactive: false,
      }).addTo(map);
    });

    // fuel station
    L.marker(toLatLng(ROUTE_FUEL_STATION.x, ROUTE_FUEL_STATION.y), {
      icon: pinIcon({ inner: FUEL_PATH, ring: "#34d399", iconColor: "#059669", label: "SPBU", labelColor: "#6ee7b7", size: 24 }),
      interactive: false,
    }).addTo(map);

    // truck (rotated by heading)
    const truckHtml = `<div style="position:relative;width:34px;height:34px;">
        <span class="animate-ping" style="position:absolute;inset:-4px;border-radius:9999px;background:#f97316;opacity:.3;"></span>
        <span style="position:relative;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:9999px;background:#f97316;border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.5);">
          <span style="display:flex;transform:rotate(${t.headingDeg}deg);">${svg(TRUCK_PATH, "#fff", 16)}</span>
        </span>
      </div>`;
    L.marker(toLatLng(t.x, t.y), {
      icon: L.divIcon({ className: "", html: truckHtml, iconSize: [34, 34], iconAnchor: [17, 17] }),
      zIndexOffset: 1000,
      interactive: false,
    }).addTo(map);

    const bounds = L.latLngBounds([
      ...ctrlPts,
      toLatLng(ROUTE_FUEL_STATION.x, ROUTE_FUEL_STATION.y),
      toLatLng(t.x, t.y),
    ]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="glass animate-fade-up overflow-hidden rounded-2xl" style={{ animationDelay: "30ms" }}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Route Map</h3>
        <span className="rounded-full surface-chip px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          {ROUTE_WAYPOINTS.length} waypoints
        </span>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden" style={{ background: "var(--sat-bg)" }}>
        <div ref={containerRef} className="absolute inset-0 h-full w-full" style={{ background: "var(--sat-bg)" }} />
      </div>

      {/* Waypoint legend list */}
      <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-[11px]">
        {ROUTE_WAYPOINTS.map((w, i) => (
          <div key={w.id} className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                w.status === "done" ? "bg-success" : w.status === "current" ? "bg-primary" : "bg-muted-foreground/40"
              )}
            />
            <span className={cn("hidden sm:inline", WP_COLOR[w.status])}>{w.label.split(" — ")[0]}</span>
            <span className="text-muted-foreground sm:hidden">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

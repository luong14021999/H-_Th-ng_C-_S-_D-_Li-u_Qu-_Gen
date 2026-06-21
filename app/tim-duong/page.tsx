"use client";

import { useState, useEffect, useMemo, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiGetAll } from "@/lib/api";
import { NguonGen, CATEGORIES, CATEGORY_MAP, PHAN_NHOM_ICONS } from "@/data/nguonGen";
import { normalizeVi } from "@/lib/text";
import { isFinePointer } from "@/lib/pointer";

// ── helpers ───────────────────────────────────────────────────────────────────
function formatDuration(sec: number): string {
  if (sec < 60) return "< 1 phút";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h === 0) return `${m} phút`;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}
function formatKm(m: number): string {
  const km = m / 1000;
  return km < 1 ? `${m.toFixed(0)} m` : `${km.toFixed(1)} km`;
}
function extractRoadName(steps: { name: string; distance: number }[]): string {
  const map: Record<string, number> = {};
  for (const s of steps) {
    if (s.name) map[s.name] = (map[s.name] ?? 0) + s.distance;
  }
  const top = Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([n]) => n);
  return top.join(", ") || "Tuyến đường";
}

interface OsrmRoute {
  distance: number;       // metres
  duration: number;       // seconds
  coords: [number, number][];
  roadName: string;
  steps: { name: string; distance: number; maneuver: { type: string } }[];
}

// Tốc độ trung bình thực tế Việt Nam (km/h)
const TRANSPORT_MODES = [
  { id: "driving",   icon: "🚗", label: "Ô tô",   avgKph: 55, color: "#1a73e8" },
  { id: "motorbike", icon: "🏍️", label: "Xe máy", avgKph: 40, color: "#1a73e8" },
  { id: "foot",      icon: "🚶", label: "Đi bộ",  avgKph: 5,  color: "#1a73e8" },
];

async function fetchRoutes(
  from: [number, number],
  to: [number, number],
): Promise<OsrmRoute[]> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&alternatives=true&steps=true`;
    const res = await fetch(url, { signal: AbortSignal.timeout(9000) });
    const json = await res.json();
    if (!json.routes?.length) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.routes.map((r: any) => {
      const steps = r.legs?.[0]?.steps ?? [];
      return {
        distance: r.distance,
        duration: r.duration,       // OSRM driving time (used only as base)
        coords: (r.geometry.coordinates as [number, number][]).map(([lng, lat]) => [lat, lng] as [number, number]),
        roadName: extractRoadName(steps),
        steps,
      };
    });
  } catch {
    return [];
  }
}

// Tính thời gian theo tốc độ thực tế thay vì dùng OSRM duration trực tiếp
function calcDuration(distanceMetres: number, avgKph: number): number {
  return (distanceMetres / 1000 / avgKph) * 3600; // seconds
}

// ── Inline Leaflet map ────────────────────────────────────────────────────────
function RouteMap({
  destItem,
  userLoc,
  routeCoords,
  allCoords,
}: {
  destItem: NguonGen | null;
  userLoc: [number, number] | null;
  routeCoords: [number, number][] | null;
  allCoords: [number, number][][];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const layerRef = useRef<unknown>(null);

  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;
    import("leaflet").then((Lm) => {
      const L = Lm.default;
      if (!containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, { zoomControl: false, center: [20.0, 105.5], zoom: 9 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap", maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    });
    return () => {
      if (mapRef.current) { (mapRef.current as { remove: () => void }).remove(); mapRef.current = null; layerRef.current = null; }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    import("leaflet").then((Lm) => {
      const L = Lm.default;
      const map = mapRef.current as L.Map;
      const layer = layerRef.current as L.LayerGroup;
      layer.clearLayers();
      const fitPts: L.LatLng[] = [];

      // Dimmed alternative routes
      for (const alt of allCoords) {
        if (alt !== routeCoords) {
          L.polyline(alt, { color: "#bfdbfe", weight: 4, opacity: 0.7 }).addTo(layer);
        }
      }
      // Active route
      if (routeCoords?.length) {
        L.polyline(routeCoords, { color: "#1a73e8", weight: 5, opacity: 0.9 }).addTo(layer);
        routeCoords.forEach((c) => fitPts.push(L.latLng(c[0], c[1])));
      }
      // User marker
      if (userLoc) {
        L.circleMarker(userLoc, { radius: 9, color: "#fff", weight: 2.5, fillColor: "#1a73e8", fillOpacity: 1 })
          .bindTooltip("Vị trí của bạn").addTo(layer);
        fitPts.push(L.latLng(userLoc[0], userLoc[1]));
      }
      // Dest marker
      if (destItem) {
        const cat = CATEGORY_MAP[destItem.nhom];
        const markerEmoji = PHAN_NHOM_ICONS[destItem.phan_nhom] ?? cat?.icon ?? "📍";
        const icon = L.divIcon({ html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 2px 4px #0004);font-family:'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif;">${markerEmoji}</div>`, className: "", iconAnchor: [14, 14] });
        L.marker([destItem.lat, destItem.lng], { icon }).bindTooltip(destItem.ten).addTo(layer);
        fitPts.push(L.latLng(destItem.lat, destItem.lng));
      }

      if (fitPts.length >= 2) map.fitBounds(L.latLngBounds(fitPts), { padding: [50, 60] });
      else if (fitPts.length === 1) map.setView(fitPts[0], 14);
    });
  }, [destItem, userLoc, routeCoords, allCoords]);

  return <div ref={containerRef} className="w-full h-full" />;
}

// ── Page ──────────────────────────────────────────────────────────────────────
function TimDuongInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<NguonGen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [selectedItem, setSelectedItem] = useState<NguonGen | null>(null);
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [userLocName, setUserLocName] = useState("Vị trí của bạn");
  const [activeTransport, setActiveTransport] = useState("driving");
  const [routesByMode, setRoutesByMode] = useState<Record<string, OsrmRoute[]>>({});
  const [activeRouteIdx, setActiveRouteIdx] = useState(0);
  const [expandedRouteIdx, setExpandedRouteIdx] = useState<number | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    apiGetAll().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => data.filter((item) => {
    const matchCat = !selectedCategory || item.nhom === selectedCategory;
    const q = normalizeVi(search);
    return matchCat && (!q || normalizeVi(item.ten).includes(q) || normalizeVi(item.phan_nhom).includes(q) || normalizeVi(item.don_vi).includes(q));
  }), [data, search, selectedCategory]);

  const fetchAll = useCallback(async (from: [number, number], to: [number, number]) => {
    const driveRoutes = await fetchRoutes(from, to);
    // All 3 modes share the same road geometry; only time differs by avgKph
    setRoutesByMode({ driving: driveRoutes, motorbike: driveRoutes, foot: driveRoutes });
  }, []);

  const handleSelect = useCallback((item: NguonGen) => {
    setSelectedItem(item);
    setRoutesByMode({});
    setGeoError(false);
    setActiveTransport("driving");
    setActiveRouteIdx(0);
    setExpandedRouteIdx(null);
    setSwapped(false);
    setRouteLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const from: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLoc(from);
        // Reverse-geocode for display name (best-effort)
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${from[0]}&lon=${from[1]}&format=json`)
          .then((r) => r.json())
          .then((j) => { if (j.address) setUserLocName(j.address.road ?? j.address.suburb ?? j.address.city ?? "Vị trí của bạn"); })
          .catch(() => {});
        await fetchAll(from, [item.lat, item.lng]);
        setRouteLoading(false);
      },
      () => { setGeoError(true); setRouteLoading(false); },
      { timeout: 8000 }
    );
  }, [fetchAll]);

  // Auto-select item when navigated from map popup via ?ma=
  useEffect(() => {
    const ma = searchParams.get("ma");
    if (!ma || loading || data.length === 0) return;
    const item = data.find((d) => d.ma === ma);
    if (item) handleSelect(item);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading]); // intentionally omit searchParams/handleSelect — run once when data ready

  const modeConf = TRANSPORT_MODES.find((m) => m.id === activeTransport)!;
  const currentRoutes = routesByMode[activeTransport] ?? [];
  const activeRoute = currentRoutes[activeRouteIdx] ?? null;
  const allCoords = currentRoutes.map((r) => r.coords);
  const routeCoords = activeRoute?.coords ?? null;

  // ── Route detail panel ────────────────────────────────────────────────────
  const routePanel = selectedItem && (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Transport mode selector */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 shrink-0">
        {TRANSPORT_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => { setActiveTransport(m.id); setActiveRouteIdx(0); setExpandedRouteIdx(null); }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all touch-manipulation"
            style={activeTransport === m.id ? { backgroundColor: "#1a73e8" } : { backgroundColor: "#3c4043" }}
            title={m.label}
          >
            {m.icon}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => { setSelectedItem(null); setRoutesByMode({}); setUserLoc(null); }}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-400 text-xl touch-manipulation"
        >✕</button>
      </div>

      {/* Origin / destination */}
      <div className="px-4 pb-3 flex items-stretch gap-2 shrink-0">
        <button
          onClick={() => { setSelectedItem(null); setRoutesByMode({}); setUserLoc(null); }}
          className="w-10 flex items-start justify-center pt-2 text-gray-500 hover:text-gray-800 shrink-0 touch-manipulation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 flex flex-col gap-0">
          {/* Dot connector */}
          <div className="relative flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-xl">
            <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="text-sm text-gray-700 truncate">{swapped ? selectedItem.ten : userLocName}</span>
          </div>
          <div className="ml-4 flex flex-col items-center gap-0.5 py-0.5">
            <div className="w-0.5 h-1 bg-gray-400" />
            <div className="w-0.5 h-1 bg-gray-400" />
            <div className="w-0.5 h-1 bg-gray-400" />
          </div>
          <div className="relative flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-xl">
            <svg className="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-sm text-gray-700 truncate">{swapped ? userLocName : selectedItem.ten}</span>
          </div>
        </div>
        <button
          onClick={() => setSwapped((v) => !v)}
          className="w-10 flex items-center justify-center text-gray-400 hover:text-gray-700 shrink-0 touch-manipulation"
          title="Đổi chiều"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      <div className="h-px bg-gray-200 shrink-0" />

      {/* Route loading / error */}
      {routeLoading && (
        <div className="flex items-center gap-3 px-5 py-4 text-sm text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
          Đang tính toán tuyến đường...
        </div>
      )}
      {geoError && (
        <p className="px-5 py-4 text-sm text-red-500">Không lấy được vị trí. Hãy cho phép truy cập GPS.</p>
      )}

      {/* Route summary + alternatives */}
      {!routeLoading && !geoError && currentRoutes.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          {/* Best route summary */}
          <div className="px-5 py-4">
            <p className="text-2xl font-bold text-red-500">
              {formatDuration(calcDuration(currentRoutes[0].distance, modeConf.avgKph))}
              <span className="text-base font-normal text-gray-500 ml-2">({formatKm(currentRoutes[0].distance)})</span>
            </p>
            <p className="text-sm text-gray-500 mt-0.5">Tuyến đường nhanh nhất</p>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Route list */}
          <p className="px-5 pt-4 pb-2 font-bold text-base text-gray-900">Danh sách chặng</p>

          {currentRoutes.map((route, idx) => (
            <div key={idx}>
              <div className="h-px bg-gray-100 mx-5" />
              {/* div instead of button to avoid nested <button> */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => { setActiveRouteIdx(idx); setExpandedRouteIdx(expandedRouteIdx === idx ? null : idx); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setActiveRouteIdx(idx); setExpandedRouteIdx(expandedRouteIdx === idx ? null : idx); } }}
                className={`w-full flex items-start gap-4 px-5 py-4 text-left cursor-pointer transition-colors touch-manipulation ${activeRouteIdx === idx ? "bg-blue-50" : "active:bg-gray-100"}`}
              >
                <div className="w-8 h-8 flex items-center justify-center text-xl shrink-0 mt-0.5">
                  {modeConf.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{route.roadName}</p>
                  {expandedRouteIdx !== idx && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); setActiveRouteIdx(idx); setExpandedRouteIdx(idx); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setExpandedRouteIdx(idx); } }}
                      className="text-xs font-semibold text-blue-600 mt-0.5 cursor-pointer"
                    >
                      CHI TIẾT
                    </span>
                  )}
                  {expandedRouteIdx === idx && (
                    <div className="mt-2 flex flex-col gap-1">
                      {route.steps
                        .filter((s) => s.maneuver?.type !== "arrive" && s.name)
                        .slice(0, 8)
                        .map((s, si) => (
                          <p key={si} className="text-xs text-gray-500 truncate">• {s.name} ({formatKm(s.distance)})</p>
                        ))}
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setExpandedRouteIdx(null); }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setExpandedRouteIdx(null); } }}
                        className="text-xs font-semibold text-blue-600 mt-0.5 cursor-pointer"
                      >
                        THU GỌN
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-red-500">{formatDuration(calcDuration(route.distance, modeConf.avgKph))}</p>
                  <p className="text-xs text-gray-400">{formatKm(route.distance)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!routeLoading && !geoError && currentRoutes.length === 0 && (
        <p className="px-5 py-4 text-sm text-gray-400">Không tìm được tuyến đường phù hợp.</p>
      )}
    </div>
  );

  // ── List panel ─────────────────────────────────────────────────────────────
  const listPanel = !selectedItem && (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input autoFocus={isFinePointer()} type="text" placeholder="Tìm kiếm nguồn gen..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 text-gray-800" />
          {search && <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-lg">×</button>}
        </div>
      </div>
      <div className="flex gap-2 px-4 py-2 overflow-x-auto shrink-0 border-b border-gray-100">
        <button onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${!selectedCategory ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"}`}>
          Tất cả
        </button>
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${selectedCategory === cat.id ? "text-white" : "bg-gray-100 text-gray-600"}`}
            style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">Không có kết quả</p>
        ) : filtered.map((item, i) => {
          const cat = CATEGORY_MAP[item.nhom];
          return (
            <div key={item.ma}>
              <button onClick={() => handleSelect(item)}
                className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-blue-100 hover:bg-blue-50 transition-colors touch-manipulation">
                <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${cat?.color ?? "#888"}22` }}>
                  {PHAN_NHOM_ICONS[item.phan_nhom] ?? cat?.icon ?? "📍"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{item.ten}</p>
                  {item.phan_nhom && <p className="text-xs text-gray-500 mt-0.5 truncate">{item.phan_nhom}</p>}
                  {item.don_vi && <p className="text-xs text-gray-400 mt-0.5 truncate">{item.don_vi}</p>}
                </div>
                <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {i < filtered.length - 1 && <div className="h-px bg-gray-100 mx-4" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="h-dvh flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-bold text-base text-gray-900">Tìm đường đến nguồn gen</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Mobile layout ── */}
        <div className="flex flex-col flex-1 overflow-hidden md:hidden">
          {selectedItem ? (
            <>
              {/* Map takes ~45% of remaining height on mobile */}
              <div className="shrink-0" style={{ height: "45%" }}>
                <RouteMap destItem={selectedItem} userLoc={userLoc} routeCoords={routeCoords} allCoords={allCoords} />
              </div>
              {/* Route panel scrolls in remaining space */}
              <div className="flex-1 overflow-y-auto flex flex-col border-t border-gray-200">
                {routePanel}
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              {listPanel}
            </div>
          )}
        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          <div className="w-[380px] shrink-0 border-r border-gray-200 overflow-hidden flex flex-col">
            {listPanel}
            {routePanel}
          </div>
          <div className="flex-1 relative">
            <RouteMap destItem={selectedItem} userLoc={userLoc} routeCoords={routeCoords} allCoords={allCoords} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TimDuongPage() {
  return (
    <Suspense>
      <TimDuongInner />
    </Suspense>
  );
}

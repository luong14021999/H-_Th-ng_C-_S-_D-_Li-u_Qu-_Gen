"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiGetAll } from "@/lib/api";
import { NguonGen, CATEGORIES, CATEGORY_MAP } from "@/data/nguonGen";

// ── helpers ──────────────────────────────────────────────────────────────────
function formatDuration(sec: number): string {
  if (sec < 60) return "< 1 phút";
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h === 0) return `${m} phút`;
  return `${h} giờ ${m > 0 ? ` ${m} phút` : ""}`;
}
function formatKm(km: number): string {
  return km < 1 ? `${(km * 1000).toFixed(0)} m` : `${km.toFixed(1)} km`;
}

interface RouteResult {
  coords: [number, number][];
  distanceKm: number;
  durationSec: number;
}

const MODES = [
  { id: "driving",   label: "Ô tô",    icon: "🚗", color: "#2563eb", osrm: "driving",  factor: 1.0 },
  { id: "motorbike", label: "Xe máy",  icon: "🏍️", color: "#7c3aed", osrm: "driving",  factor: 0.85 },
  { id: "cycling",   label: "Xe đạp",  icon: "🚲", color: "#059669", osrm: "cycling",  factor: 1.0 },
  { id: "foot",      label: "Đi bộ",   icon: "🚶", color: "#d97706", osrm: "foot",     factor: 1.0 },
];

async function fetchOsrmRoute(
  from: [number, number],
  to: [number, number],
  profile: string
): Promise<RouteResult | null> {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/${profile}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    if (!json.routes?.[0]) return null;
    const r = json.routes[0];
    const coords = (r.geometry.coordinates as [number, number][]).map(
      ([lng, lat]) => [lat, lng] as [number, number]
    );
    return { coords, distanceKm: r.distance / 1000, durationSec: r.duration };
  } catch {
    return null;
  }
}

// ── RouteMap (inline Leaflet, no toolbar) ────────────────────────────────────
function RouteMap({
  destItem,
  userLoc,
  routeCoords,
  routeColor,
}: {
  destItem: NguonGen | null;
  userLoc: [number, number] | null;
  routeCoords: [number, number][] | null;
  routeColor: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const routeLayerRef = useRef<unknown>(null);

  // Init map once
  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;
    import("leaflet").then((Lm) => {
      const L = Lm.default;
      if (!containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, { zoomControl: false, center: [20.0, 105.5], zoom: 9 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    });
    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
        routeLayerRef.current = null;
      }
    };
  }, []);

  // Draw route / markers whenever props change
  useEffect(() => {
    if (!mapRef.current || !routeLayerRef.current) return;
    import("leaflet").then((Lm) => {
      const L = Lm.default;
      const map = mapRef.current as L.Map;
      const layer = routeLayerRef.current as L.LayerGroup;
      layer.clearLayers();

      const bounds: [number, number][] = [];

      if (userLoc) {
        L.circleMarker(userLoc, { radius: 9, color: "#fff", weight: 2, fillColor: "#2563eb", fillOpacity: 1 })
          .bindTooltip("Vị trí của bạn")
          .addTo(layer);
        bounds.push(userLoc);
      }

      if (destItem) {
        const cat = CATEGORY_MAP[destItem.nhom];
        const icon = L.divIcon({
          html: `<div style="font-size:26px;line-height:1">${cat?.icon ?? "📍"}</div>`,
          className: "",
          iconAnchor: [13, 13],
        });
        L.marker([destItem.lat, destItem.lng], { icon })
          .bindTooltip(destItem.ten)
          .addTo(layer);
        bounds.push([destItem.lat, destItem.lng]);
      }

      if (routeCoords && routeCoords.length >= 2) {
        L.polyline(routeCoords, { color: routeColor, weight: 5, opacity: 0.85 }).addTo(layer);
        bounds.push(...routeCoords);
        const ll = routeCoords.map((c) => L.latLng(c[0], c[1]));
        map.fitBounds(L.latLngBounds(ll), { padding: [50, 60] });
      } else if (bounds.length >= 2) {
        map.fitBounds(L.latLngBounds(bounds.map((b) => L.latLng(b[0], b[1]))), { padding: [60, 80] });
      } else if (bounds.length === 1) {
        map.setView(bounds[0], 14);
      }
    });
  }, [destItem, userLoc, routeCoords, routeColor]);

  return <div ref={containerRef} className="w-full h-full" />;
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function TimDuongPage() {
  const router = useRouter();
  const [data, setData] = useState<NguonGen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Route state
  const [selectedItem, setSelectedItem] = useState<NguonGen | null>(null);
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [routes, setRoutes] = useState<Record<string, RouteResult | null>>({});
  const [activeMode, setActiveMode] = useState("driving");
  const [routeLoading, setRouteLoading] = useState(false);
  const [geoError, setGeoError] = useState(false);

  useEffect(() => {
    apiGetAll()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchCat = !selectedCategory || item.nhom === selectedCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.ten.toLowerCase().includes(q) ||
        item.phan_nhom.toLowerCase().includes(q) ||
        item.don_vi.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [data, search, selectedCategory]);

  const handleSelect = useCallback((item: NguonGen) => {
    setSelectedItem(item);
    setRoutes({});
    setGeoError(false);
    setActiveMode("driving");
    setRouteLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const from: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLoc(from);
        const to: [number, number] = [item.lat, item.lng];

        // Fetch driving + cycling + foot in parallel (motorbike reuses driving)
        const [driveRes, cycleRes, footRes] = await Promise.all([
          fetchOsrmRoute(from, to, "driving"),
          fetchOsrmRoute(from, to, "cycling"),
          fetchOsrmRoute(from, to, "foot"),
        ]);
        setRoutes({ driving: driveRes, motorbike: driveRes, cycling: cycleRes, foot: footRes });
        setRouteLoading(false);
      },
      () => {
        setGeoError(true);
        setRouteLoading(false);
      },
      { timeout: 8000 }
    );
  }, []);

  const activeRoute = routes[activeMode] ?? null;
  const activeModeConf = MODES.find((m) => m.id === activeMode)!;
  const routeCoords = activeRoute?.coords ?? null;
  const routeColor = activeModeConf.color;

  // ── Route panel (left when item selected) ──
  const routePanel = selectedItem && (
    <div className="flex flex-col h-full">
      {/* Back */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 shrink-0">
        <button
          onClick={() => { setSelectedItem(null); setRoutes({}); setUserLoc(null); }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">{selectedItem.ten}</p>
          {selectedItem.phan_nhom && <p className="text-xs text-gray-400 truncate">{selectedItem.phan_nhom}</p>}
        </div>
      </div>

      {/* Status */}
      {routeLoading && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
          Đang tính toán tuyến đường...
        </div>
      )}
      {geoError && (
        <div className="px-4 py-3 text-sm text-red-500">
          Không thể lấy vị trí. Hãy cho phép quyền truy cập GPS.
        </div>
      )}

      {/* Mode cards */}
      {!routeLoading && !geoError && (
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
          {MODES.map((mode) => {
            const r = routes[mode.id];
            const dur = r ? formatDuration(r.durationSec * mode.factor) : null;
            const km = r ? formatKm(r.distanceKm) : null;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                  isActive
                    ? "border-transparent text-white"
                    : "border-gray-200 bg-white text-gray-800 hover:border-gray-300"
                }`}
                style={isActive ? { backgroundColor: mode.color } : {}}
              >
                <span className="text-2xl leading-none">{mode.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{mode.label}</p>
                  {r ? (
                    <p className={`text-xs mt-0.5 ${isActive ? "text-white/80" : "text-gray-500"}`}>
                      {km} • {dur}
                    </p>
                  ) : (
                    <p className={`text-xs mt-0.5 ${isActive ? "text-white/60" : "text-gray-400"}`}>Không có tuyến đường</p>
                  )}
                </div>
                {isActive && (
                  <svg className="w-4 h-4 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── List panel ──
  const listPanel = !selectedItem && (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Tìm kiếm nguồn gen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 text-gray-800"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto shrink-0 border-b border-gray-100">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
            !selectedCategory ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              selectedCategory === cat.id ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">Không có kết quả</p>
        ) : (
          filtered.map((item, i) => {
            const cat = CATEGORY_MAP[item.nhom];
            return (
              <div key={item.ma}>
                <button
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 active:bg-blue-100 transition-colors"
                >
                  <div
                    className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${cat?.color ?? "#888"}22` }}
                  >
                    {cat?.icon ?? "📍"}
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
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="h-dvh flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-bold text-base text-gray-900">Tìm đường đến nguồn gen</h1>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left panel (full on mobile, 360px on desktop) ── */}
        <div className="w-full md:w-[360px] shrink-0 border-r border-gray-200 overflow-hidden flex flex-col">
          {/* Mobile: map above route panel when item selected */}
          {selectedItem && (
            <div className="h-56 shrink-0 md:hidden relative">
              <RouteMap destItem={selectedItem} userLoc={userLoc} routeCoords={routeCoords} routeColor={routeColor} />
            </div>
          )}
          {listPanel}
          {routePanel}
        </div>

        {/* ── Right: map (desktop) ── */}
        <div className="hidden md:block flex-1 relative">
          <RouteMap destItem={selectedItem} userLoc={userLoc} routeCoords={routeCoords} routeColor={routeColor} />
        </div>
      </div>
    </div>
  );
}

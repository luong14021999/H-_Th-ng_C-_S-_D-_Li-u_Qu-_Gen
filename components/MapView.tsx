"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NguonGen, CATEGORY_MAP, CATEGORIES } from "@/data/nguonGen";

const MAP_CENTER: [number, number] = [20.0, 105.5];

interface MapViewProps {
  data: NguonGen[];
  isAdmin?: boolean;
  onAddNewAtPoint?: (lat: number, lng: number) => void;
  onDeleteItem?: (ma: string) => void;
}

interface PopupInfo {
  item: NguonGen;
  x: number;
  y: number;
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const φ1 = (a[0] * Math.PI) / 180;
  const φ2 = (b[0] * Math.PI) / 180;
  const Δφ = ((b[0] - a[0]) * Math.PI) / 180;
  const Δλ = ((b[1] - a[1]) * Math.PI) / 180;
  const x =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

const TOOL_STYLE =
  "w-9 h-9 flex items-center justify-center rounded transition-colors text-white/90 hover:text-white hover:bg-white/15 active:bg-white/25";
const TOOL_ACTIVE =
  "w-9 h-9 flex items-center justify-center rounded text-white bg-white/25";

export default function MapView({
  data,
  isAdmin,
  onAddNewAtPoint,
  onDeleteItem,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const activeToolRef = useRef<string>("none");
  const measureLayerRef = useRef<L.LayerGroup | null>(null);
  const measurePointsRef = useRef<[number, number][]>([]);

  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [activeTool, setActiveTool] = useState<string>("none");
  const [measureDisplay, setMeasureDisplay] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string, duration = 2500) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  const setTool = (id: string) => {
    const next = activeTool === id ? "none" : id;
    activeToolRef.current = next;
    setActiveTool(next);
    if (next !== "measure") {
      measureLayerRef.current?.clearLayers();
      measurePointsRef.current = [];
      setMeasureDisplay(null);
    }
    if (next === "add") showToast("Nhấn vào bản đồ để đặt vị trí nguồn gen mới", 4000);
    if (next === "delete") showToast("Nhấn vào marker để xóa nguồn gen", 4000);
    if (next === "measure") showToast("Nhấn 2 điểm trên bản đồ để đo khoảng cách", 4000);
  };

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: MAP_CENTER,
      zoom: 9,
      zoomControl: false, // we use custom buttons
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const measureLayer = L.layerGroup().addTo(map);
    measureLayerRef.current = measureLayer;

    map.on("click", (e) => {
      const tool = activeToolRef.current;
      if (tool === "measure") {
        const pt: [number, number] = [e.latlng.lat, e.latlng.lng];
        measurePointsRef.current = [...measurePointsRef.current, pt];
        const pts = measurePointsRef.current;

        measureLayer.clearLayers();
        pts.forEach((p) =>
          L.circleMarker(p, {
            radius: 5, color: "#e53e3e", fillColor: "#fc8181", fillOpacity: 1, weight: 2,
          }).addTo(measureLayer)
        );

        if (pts.length >= 2) {
          L.polyline(pts, { color: "#e53e3e", weight: 2, dashArray: "6 4" }).addTo(measureLayer);
          let total = 0;
          for (let i = 1; i < pts.length; i++) total += haversineKm(pts[i - 1], pts[i]);
          const display = total >= 1 ? `${total.toFixed(2)} km` : `${(total * 1000).toFixed(0)} m`;
          setMeasureDisplay(display);
        } else {
          setMeasureDisplay(null);
        }
        return;
      }
      if (tool === "add") {
        onAddNewAtPoint?.(e.latlng.lat, e.latlng.lng);
        activeToolRef.current = "none";
        setActiveTool("none");
        return;
      }
      setPopup(null);
    });

    mapRef.current = map;
    layerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
      measureLayerRef.current = null;
    };
  }, [onAddNewAtPoint]);

  // Sync markers whenever data changes
  useEffect(() => {
    const map = mapRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    const bounds: [number, number][] = [];

    data.forEach((item) => {
      const cat = CATEGORY_MAP[item.nhom];
      const icon = L.divIcon({
        className: "",
        html: `<div style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4));">${cat?.icon ?? "📍"}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([item.lat, item.lng], { icon, title: item.ten });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        const tool = activeToolRef.current;

        if (tool === "delete") {
          if (confirm(`Xóa nguồn gen "${item.ten}"?`)) {
            onDeleteItem?.(item.ma);
            activeToolRef.current = "none";
            setActiveTool("none");
          }
          return;
        }

        if (tool === "measure") {
          const pt: [number, number] = [item.lat, item.lng];
          measurePointsRef.current = [...measurePointsRef.current, pt];
          const pts = measurePointsRef.current;
          const ml = measureLayerRef.current;
          if (!ml) return;
          ml.clearLayers();
          pts.forEach((p) =>
            L.circleMarker(p, {
              radius: 5, color: "#e53e3e", fillColor: "#fc8181", fillOpacity: 1, weight: 2,
            }).addTo(ml)
          );
          if (pts.length >= 2) {
            L.polyline(pts, { color: "#e53e3e", weight: 2, dashArray: "6 4" }).addTo(ml);
            let total = 0;
            for (let i = 1; i < pts.length; i++) total += haversineKm(pts[i - 1], pts[i]);
            const display = total >= 1 ? `${total.toFixed(2)} km` : `${(total * 1000).toFixed(0)} m`;
            setMeasureDisplay(display);
          }
          return;
        }

        const containerEl = containerRef.current;
        if (!containerEl) return;
        const point = map.latLngToContainerPoint([item.lat, item.lng]);
        setPopup({ item, x: point.x, y: point.y });
      });

      group.addLayer(marker);
      bounds.push([item.lat, item.lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [data, onDeleteItem]);

  // Cursor style based on active tool
  const cursorClass =
    activeTool === "measure" || activeTool === "add" ? "[&_.leaflet-container]:!cursor-crosshair" : "";

  const btnCls = (id: string) =>
    activeTool === id ? TOOL_ACTIVE : TOOL_STYLE;

  return (
    <div className={`w-full h-full relative ${cursorClass}`}>
      <div ref={containerRef} className="w-full h-full" />

      {/* ── Right toolbar ── */}
      <div
        className="absolute top-3 right-3 z-[1000] flex flex-col items-center gap-0.5 rounded-lg shadow-lg overflow-y-auto overflow-x-hidden"
        style={{ backgroundColor: "#1e3a4c", maxHeight: "calc(100% - 1.5rem)" }}
      >
        {/* Zoom in */}
        <button
          title="Phóng to"
          onClick={() => mapRef.current?.zoomIn()}
          className={TOOL_STYLE}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Zoom out */}
        <button
          title="Thu nhỏ"
          onClick={() => mapRef.current?.zoomOut()}
          className={TOOL_STYLE}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        {/* Separator */}
        <div className="w-6 h-px bg-white/20 my-0.5" />

        {/* Measure distance */}
        <button
          title="Thước đo khoảng cách"
          onClick={() => setTool("measure")}
          className={btnCls("measure")}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 7l3-3M3 7l3 3M21 7l-3-3M21 7l-3 3M7 7v10M17 7v10M3 17h18M3 17l3-3M3 17l3 3M21 17l-3-3M21 17l-3 3" />
          </svg>
        </button>

        {/* Delete — admin only */}
        {isAdmin && (
          <button
            title="Xóa"
            onClick={() => setTool("delete")}
            className={btnCls("delete")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        {/* Add new — admin only */}
        {isAdmin && onAddNewAtPoint && (
          <button
            title="Thêm mới nguồn gen"
            onClick={() => setTool("add")}
            className={btnCls("add")}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}

        {/* Export image */}
        <button
          title="Xuất ảnh"
          onClick={() => showToast("Tính năng đang phát triển")}
          className={TOOL_STYLE}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Export PDF */}
        <button
          title="Xuất PDF"
          onClick={() => showToast("Tính năng đang phát triển")}
          className={TOOL_STYLE}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Chú giải / Legend */}
        <button
          title="Chú giải"
          onClick={() => { setShowLegend((v) => !v); }}
          className={showLegend ? TOOL_ACTIVE : TOOL_STYLE}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Khai thác dữ liệu theo lĩnh vực */}
        <button
          title="Khai thác dữ liệu theo lĩnh vực"
          onClick={() => showToast("Tính năng đang phát triển")}
          className={TOOL_STYLE}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        </button>

        {/* Xem chi tiết */}
        <button
          title="Xem chi tiết"
          onClick={() => showToast("Nhấn vào marker để xem chi tiết")}
          className={TOOL_STYLE}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Tìm đường */}
        <button
          title="Tìm đường"
          onClick={() => showToast("Tính năng đang phát triển")}
          className={TOOL_STYLE}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Danh mục hiện trạng bảo tồn */}
        <button
          title="Danh mục hiện trạng bảo tồn"
          onClick={() => showToast("Tính năng đang phát triển")}
          className={TOOL_STYLE}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>

      {/* ── Legend panel ── */}
      {showLegend && (
        <div className="absolute top-3 z-[1000] bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[160px]" style={{ right: "3.25rem", maxWidth: "calc(100vw - 4rem)" }}>
          <p className="font-semibold text-xs text-gray-700 mb-2 uppercase tracking-wide">Chú giải</p>
          <div className="flex flex-col gap-1.5">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <span className="text-lg leading-none">{cat.icon}</span>
                <span className="text-xs text-gray-700">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Measure distance display ── */}
      {activeTool === "measure" && measureDisplay && (
        <div className="absolute top-3 left-3 z-[1000] bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 max-w-[calc(100%-5rem)]">
          <span>📏 {measureDisplay}</span>
          <button
            className="opacity-80 hover:opacity-100 shrink-0"
            onClick={() => {
              measureLayerRef.current?.clearLayers();
              measurePointsRef.current = [];
              setMeasureDisplay(null);
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Active tool indicator ── */}
      {activeTool !== "none" && activeTool !== "measure" && (
        <div className="absolute top-3 left-3 z-[1000] bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 max-w-[calc(100%-5rem)]">
          <span className="truncate">
            {activeTool === "add" && "➕ Nhấn vào bản đồ để đặt vị trí mới"}
            {activeTool === "delete" && "🗑️ Nhấn vào marker để xóa"}
          </span>
          <button className="opacity-80 hover:opacity-100 shrink-0" onClick={() => { activeToolRef.current = "none"; setActiveTool("none"); }}>✕</button>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-gray-800/90 text-white text-xs px-4 py-2 rounded-full shadow-lg pointer-events-none text-center max-w-[90vw]">
          {toast}
        </div>
      )}

      {/* ── Popup ── */}
      {popup && (
        <>
          {/* Mobile: bottom sheet */}
          <div className="sm:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 p-4">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-base leading-tight">{popup.item.ten}</p>
                <p className="text-gray-400 font-mono text-xs mt-0.5">{popup.item.ma}</p>
              </div>
              <button onClick={() => setPopup(null)} className="text-gray-400 hover:text-gray-600 shrink-0 text-xl leading-none">✕</button>
            </div>
            {popup.item.khoa_hoc && <p className="italic text-gray-500 text-sm mb-1">{popup.item.khoa_hoc}</p>}
            {popup.item.don_vi && <p className="text-gray-600 text-sm mb-2"><span className="font-medium">Đơn vị:</span> {popup.item.don_vi}</p>}
            {(() => {
              const cat = CATEGORY_MAP[popup.item.nhom];
              return cat ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-sm" style={{ backgroundColor: cat.color }}>
                  {cat.icon} {cat.label}
                </span>
              ) : null;
            })()}
          </div>

          {/* Desktop: floating card */}
          <div
            className="hidden sm:block absolute z-[1000] bg-white rounded-lg shadow-xl border border-gray-200 p-3 text-xs"
            style={{
              left: Math.min(Math.max(popup.x - 115, 8), (containerRef.current?.clientWidth ?? 600) - 248),
              top: Math.max(popup.y - 180, 8),
              width: 230,
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">{popup.item.ten}</p>
                <p className="text-gray-400 font-mono mt-0.5">{popup.item.ma}</p>
              </div>
              <button onClick={() => setPopup(null)} className="text-gray-400 hover:text-gray-600 shrink-0 text-base leading-none">✕</button>
            </div>
            {popup.item.khoa_hoc && <p className="italic text-gray-500 mb-1">{popup.item.khoa_hoc}</p>}
            {popup.item.don_vi && <p className="text-gray-600 mb-2"><span className="font-medium">Đơn vị:</span> {popup.item.don_vi}</p>}
            {(() => {
              const cat = CATEGORY_MAP[popup.item.nhom];
              return cat ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs" style={{ backgroundColor: cat.color }}>
                  {cat.icon} {cat.label}
                </span>
              ) : null;
            })()}
          </div>
        </>
      )}

      <div className="absolute bottom-4 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-md px-3 py-1.5 text-xs text-gray-600 pointer-events-none">
        Hiển thị <span className="font-bold text-teal-700">{data.length}</span> điểm
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const φ1 = (a[0] * Math.PI) / 180;
  const φ2 = (b[0] * Math.PI) / 180;
  const Δφ = ((b[0] - a[0]) * Math.PI) / 180;
  const Δλ = ((b[1] - a[1]) * Math.PI) / 180;
  const x = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function polygonAreaKm2(pts: [number, number][]): number {
  if (pts.length < 3) return 0;
  const centLat = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const deg = Math.PI / 180;
  const R = 6371;
  const latS = deg * R;
  const lngS = deg * R * Math.cos(centLat * deg);
  const xy = pts.map(([lat, lng]): [number, number] => [(lat - centLat) * latS, lng * lngS]);
  let area = 0;
  for (let i = 0; i < xy.length; i++) {
    const j = (i + 1) % xy.length;
    area += xy[i][0] * xy[j][1] - xy[j][0] * xy[i][1];
  }
  return Math.abs(area / 2);
}

function formatArea(km2: number): string {
  const ha = km2 * 100;
  if (ha < 0.01) return `${(km2 * 1e6).toFixed(0)} m²`;
  return `${ha.toFixed(2)} ha`;
}

// ── ToolButton with hover tooltip ─────────────────────────────────────────────

const BTN = "w-9 h-9 flex items-center justify-center rounded transition-colors text-white/90 hover:text-white hover:bg-white/15 active:bg-white/25 touch-manipulation";
const BTN_ON = "w-9 h-9 flex items-center justify-center rounded text-white bg-white/25 touch-manipulation";

function ToolButton({
  title, onClick, active, children,
}: {
  title: string; onClick: () => void; active?: boolean; children: React.ReactNode;
}) {
  const [tip, setTip] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.top + r.height / 2, right: window.innerWidth - r.left });
    }
    setTip(true);
  };

  return (
    <div className="relative flex justify-center">
      <button
        ref={btnRef}
        title={title}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setTip(false)}
        className={active ? BTN_ON : BTN}
      >
        {children}
      </button>
      {tip && typeof document !== "undefined" && createPortal(
        <div
          className="hidden sm:block"
          style={{ position: "fixed", top: pos.top, right: pos.right + 10, transform: "translateY(-50%)", zIndex: 99999, pointerEvents: "none" }}
        >
          <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg leading-snug">
            {title}
          </div>
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-l-gray-900" />
        </div>,
        document.body
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MapView({ data, isAdmin, onAddNewAtPoint, onDeleteItem }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const activeToolRef = useRef<string>("none");
  const measureLayerRef = useRef<L.LayerGroup | null>(null);
  const measurePointsRef = useRef<[number, number][]>([]);
  const legendBtnRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [activeTool, setActiveTool] = useState<string>("none");
  const [measureSubOpen, setMeasureSubOpen] = useState(false);
  const [measureDisplay, setMeasureDisplay] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [routeSidebarOpen, setRouteSidebarOpen] = useState(false);
  const [routeSearch, setRouteSearch] = useState("");
  const [routingItem, setRoutingItem] = useState<NguonGen | null>(null);

  const showToast = useCallback((msg: string, duration = 2800) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  const exportMapImage = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    showToast("Đang xuất ảnh...", 8000);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(el, { useCORS: true, logging: false, scale: 2 });
      const link = document.createElement("a");
      link.download = `ban-do-nguon-gen-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Đã xuất ảnh thành công");
    } catch {
      showToast("Lỗi khi xuất ảnh");
    }
  }, [showToast]);

  const exportMapPDF = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    showToast("Đang xuất PDF...", 8000);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(el, { useCORS: true, logging: false, scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const w = canvas.width / 2;
      const h = canvas.height / 2;
      const orientation = w >= h ? "l" : "p";
      const pdf = new jsPDF({ orientation, unit: "px", format: [w, h] });
      pdf.addImage(imgData, "JPEG", 0, 0, w, h);
      pdf.save(`ban-do-nguon-gen-${Date.now()}.pdf`);
      showToast("Đã xuất PDF thành công");
    } catch {
      showToast("Lỗi khi xuất PDF");
    }
  }, [showToast]);

  const handleRouteTo = useCallback(async (item: NguonGen) => {
    setRoutingItem(item);
    setRouteSidebarOpen(false);
    const map = mapRef.current;
    const rl = routeLayerRef.current;
    if (!map || !rl) return;
    rl.clearLayers();

    showToast("Đang lấy vị trí của bạn...", 5000);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLatLng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        const destLatLng: [number, number] = [item.lat, item.lng];

        // User marker
        L.circleMarker(userLatLng, { radius: 8, color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 1, weight: 2 })
          .bindTooltip("Vị trí của bạn", { permanent: false })
          .addTo(rl);

        try {
          // OSRM public routing API
          const url = `https://router.project-osrm.org/route/v1/driving/${userLatLng[1]},${userLatLng[0]};${destLatLng[1]},${destLatLng[0]}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          const json = await res.json();
          if (json.routes?.[0]) {
            const route = json.routes[0];
            const coords = (route.geometry.coordinates as [number, number][]).map(([lng, lat]) => [lat, lng] as [number, number]);
            L.polyline(coords, { color: "#2563eb", weight: 4, opacity: 0.85 }).addTo(rl);
            const km = (route.distance / 1000).toFixed(1);
            const mins = Math.round(route.duration / 60);
            showToast(`${km} km • ~${mins} phút lái xe`, 6000);
            map.fitBounds(L.polyline(coords).getBounds(), { padding: [50, 80] });
          } else {
            throw new Error("no route");
          }
        } catch {
          // Fallback: straight line
          L.polyline([userLatLng, destLatLng], { color: "#2563eb", weight: 3, dashArray: "8 6", opacity: 0.8 }).addTo(rl);
          const km = haversineKm(userLatLng, destLatLng).toFixed(1);
          showToast(`Khoảng cách thẳng: ${km} km`, 5000);
          map.fitBounds(L.latLngBounds([userLatLng, destLatLng]), { padding: [60, 100] });
        }
      },
      () => {
        showToast("Không thể lấy vị trí. Hãy cho phép truy cập vị trí.");
        setRoutingItem(null);
      },
      { timeout: 8000 }
    );
  }, [showToast]);

  // Stable ref to setMeasureDisplay so event handlers always see latest setter
  const setMeasureDisplayRef = useRef(setMeasureDisplay);
  setMeasureDisplayRef.current = setMeasureDisplay;

  // Shared measure logic — called from both map click and marker click
  const doMeasure = useCallback((lat: number, lng: number) => {
    const tool = activeToolRef.current;
    const isArea = tool === "measure-area";
    const pt: [number, number] = [lat, lng];
    measurePointsRef.current = [...measurePointsRef.current, pt];
    const pts = measurePointsRef.current;
    const ml = measureLayerRef.current;
    if (!ml) return;

    ml.clearLayers();
    pts.forEach((p) =>
      L.circleMarker(p, { radius: 5, color: "#e53e3e", fillColor: "#fc8181", fillOpacity: 1, weight: 2 }).addTo(ml)
    );

    if (isArea) {
      if (pts.length >= 3) {
        L.polygon(pts, { color: "#e53e3e", weight: 2, fillColor: "#e53e3e", fillOpacity: 0.15 }).addTo(ml);
        setMeasureDisplayRef.current(formatArea(polygonAreaKm2(pts)));
      } else if (pts.length === 2) {
        L.polyline(pts, { color: "#e53e3e", weight: 2, dashArray: "4 4" }).addTo(ml);
      }
    } else {
      if (pts.length >= 2) {
        L.polyline(pts, { color: "#e53e3e", weight: 2, dashArray: "6 4" }).addTo(ml);
        let total = 0;
        for (let i = 1; i < pts.length; i++) total += haversineKm(pts[i - 1], pts[i]);
        setMeasureDisplayRef.current(
          total >= 1 ? `${total.toFixed(2)} km` : `${(total * 1000).toFixed(0)} m`
        );
      }
    }
  }, []);

  const clearMeasure = useCallback(() => {
    measureLayerRef.current?.clearLayers();
    measurePointsRef.current = [];
    setMeasureDisplay(null);
  }, []);

  const activateTool = useCallback((id: string) => {
    activeToolRef.current = id;
    setActiveTool(id);
    setMeasureSubOpen(false);
    if (!id.startsWith("measure")) clearMeasure();
  }, [clearMeasure]);

  const activateMeasure = useCallback((mode: "distance" | "area") => {
    activateTool(`measure-${mode}`);
    clearMeasure();
    showToast(
      mode === "distance"
        ? "Nhấn các điểm trên bản đồ để đo khoảng cách"
        : "Nhấn 3+ điểm để đo diện tích vùng",
      4000
    );
  }, [activateTool, clearMeasure, showToast]);

  const handleMeasureButtonClick = () => {
    const isMeasureActive = activeTool.startsWith("measure-");
    if (isMeasureActive) {
      activateTool("none");
    } else {
      setMeasureSubOpen((v) => !v);
    }
  };

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: MAP_CENTER,
      zoom: 9,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    measureLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);

    map.on("click", (e) => {
      const tool = activeToolRef.current;
      if (tool === "measure-distance" || tool === "measure-area") {
        doMeasure(e.latlng.lat, e.latlng.lng);
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
      routeLayerRef.current = null;
    };
  }, [onAddNewAtPoint, doMeasure]);

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

        if (tool === "measure-distance" || tool === "measure-area") {
          doMeasure(item.lat, item.lng);
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

    if (bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40] });
  }, [data, onDeleteItem, doMeasure]);

  const isMeasureActive = activeTool.startsWith("measure-");
  const cursorClass =
    isMeasureActive || activeTool === "add" ? "[&_.leaflet-container]:!cursor-crosshair" : "";

  const legendTopPx = (() => {
    const btn = legendBtnRef.current;
    const container = containerRef.current;
    if (btn && container) {
      return btn.getBoundingClientRect().top - container.getBoundingClientRect().top;
    }
    return 12;
  })();

  return (
    <div className={`w-full h-full relative ${cursorClass}`}>
      <div ref={containerRef} className="w-full h-full" />

      {/* ── Right toolbar ── */}
      <div
        className="absolute top-3 right-3 z-[1000] flex flex-col items-center gap-0.5 rounded-lg shadow-lg overflow-y-auto overflow-x-hidden"
        style={{ backgroundColor: "#1e3a4c", maxHeight: "calc(100% - 1.5rem)" }}
      >
        <ToolButton title="Phóng to" onClick={() => mapRef.current?.zoomIn()}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </ToolButton>

        <ToolButton title="Thu nhỏ" onClick={() => mapRef.current?.zoomOut()}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </ToolButton>

        <div className="w-6 h-px bg-white/20 my-0.5" />

        {/* Measure — opens sub-menu */}
        <ToolButton
          title="Đo khoảng cách / Diện tích"
          onClick={handleMeasureButtonClick}
          active={isMeasureActive || measureSubOpen}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 7l3-3M3 7l3 3M21 7l-3-3M21 7l-3 3M7 7v10M17 7v10M3 17h18M3 17l3-3M3 17l3 3M21 17l-3-3M21 17l-3 3" />
          </svg>
        </ToolButton>

        {isAdmin && (
          <ToolButton title="Xóa nguồn gen" onClick={() => { activateTool(activeTool === "delete" ? "none" : "delete"); showToast("Nhấn vào marker để xóa nguồn gen", 4000); }} active={activeTool === "delete"}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </ToolButton>
        )}

        {isAdmin && onAddNewAtPoint && (
          <ToolButton title="Thêm mới nguồn gen" onClick={() => { activateTool(activeTool === "add" ? "none" : "add"); showToast("Nhấn vào bản đồ để đặt vị trí nguồn gen mới", 4000); }} active={activeTool === "add"}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </ToolButton>
        )}

        <ToolButton title="Xuất ảnh bản đồ" onClick={exportMapImage}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </ToolButton>

        <ToolButton title="Xuất PDF" onClick={exportMapPDF}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </ToolButton>

        <div ref={legendBtnRef}>
          <ToolButton title="Chú giải" onClick={() => setShowLegend((v) => !v)} active={showLegend}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </ToolButton>
        </div>

        <ToolButton title="Khai thác dữ liệu theo lĩnh vực" onClick={() => showToast("Tính năng đang phát triển")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        </ToolButton>

        <ToolButton title="Xem chi tiết nguồn gen" onClick={() => showToast("Nhấn vào marker để xem chi tiết")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </ToolButton>

        <ToolButton title="Tìm đường" onClick={() => { setRouteSidebarOpen((v) => !v); routeLayerRef.current?.clearLayers(); setRoutingItem(null); }} active={routeSidebarOpen}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </ToolButton>

        <ToolButton title="Danh mục hiện trạng bảo tồn, khai thác, sử dụng nguồn gen Tỉnh Thanh Hóa" onClick={() => showToast("Tính năng đang phát triển")}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </ToolButton>
      </div>

      {/* ── Measure sub-menu (distance / area) ── */}
      {measureSubOpen && (
        <div
          className="absolute z-[1001] rounded-lg shadow-xl overflow-hidden"
          style={{ backgroundColor: "#1e3a4c", right: "3.25rem", top: "5.5rem" }}
        >
          <button
            onClick={() => activateMeasure("distance")}
            className="flex items-center gap-2.5 px-4 py-3 text-white hover:bg-white/10 w-full text-left text-sm whitespace-nowrap transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 7l3-3M3 7l3 3M21 7l-3-3M21 7l-3 3" />
            </svg>
            Đo khoảng cách
          </button>
          <div className="h-px bg-white/15" />
          <button
            onClick={() => activateMeasure("area")}
            className="flex items-center gap-2.5 px-4 py-3 text-white hover:bg-white/10 w-full text-left text-sm whitespace-nowrap transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3L3 5v14l2 2h14l2-2V5l-2-2H5zm7 4v10M8 7v10m8-10v10" />
            </svg>
            Đo diện tích
          </button>
        </div>
      )}

      {/* ── Legend panel ── */}
      {showLegend && (
        <div
          className="absolute z-[1000] bg-white rounded-2xl shadow-xl overflow-hidden"
          style={{ minWidth: 220, maxWidth: "calc(100vw - 4rem)", right: "3.25rem", top: legendTopPx }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-bold text-base text-gray-900">Chú giải</span>
            <button
              onClick={() => setShowLegend(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-base font-bold"
            >›</button>
          </div>
          {/* Rows */}
          <div className="flex flex-col px-4 py-2 gap-0">
            {/* Location marker row */}
            <div className="flex items-center gap-3 py-2">
              <span className="text-2xl leading-none">📍</span>
              <span className="text-sm text-gray-800">Đơn vị sx cung cấp nguồn gen</span>
            </div>
            <div className="h-px bg-gray-100" />
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id}>
                <div className="flex items-center gap-3 py-2">
                  <span className="text-2xl leading-none">{cat.icon}</span>
                  <span className="text-sm text-gray-800">{cat.label}</span>
                </div>
                {i < CATEGORIES.length - 1 && <div className="h-px bg-gray-100" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Route sidebar ── */}
      {routeSidebarOpen && (
        <div className="absolute top-0 left-0 h-full z-[1000] bg-white shadow-2xl flex flex-col" style={{ width: 340, maxWidth: "calc(100vw - 3.5rem)" }}>
          {/* Search header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder="Tìm kiếm nguồn gen..."
              value={routeSearch}
              onChange={(e) => setRouteSearch(e.target.value)}
              className="flex-1 text-sm outline-none placeholder-gray-400 text-gray-800"
            />
            {routeSearch && (
              <button onClick={() => setRouteSearch("")} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            )}
          </div>
          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {data
              .filter((item) =>
                !routeSearch ||
                item.ten.toLowerCase().includes(routeSearch.toLowerCase()) ||
                item.phan_nhom.toLowerCase().includes(routeSearch.toLowerCase()) ||
                item.don_vi.toLowerCase().includes(routeSearch.toLowerCase())
              )
              .map((item) => {
                const cat = CATEGORY_MAP[item.nhom];
                const isActive = routingItem?.ma === item.ma;
                return (
                  <button
                    key={item.ma}
                    onClick={() => handleRouteTo(item)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors ${isActive ? "bg-blue-50" : ""}`}
                  >
                    {/* Emoji thumbnail */}
                    <div className="w-14 h-14 shrink-0 rounded-lg flex items-center justify-center text-3xl" style={{ backgroundColor: `${cat?.color ?? "#888"}22` }}>
                      {cat?.icon ?? "📍"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{item.ten}</p>
                      {item.phan_nhom && <p className="text-xs text-gray-500 truncate">{item.phan_nhom}</p>}
                      {item.don_vi && <p className="text-xs text-gray-400 truncate">{item.don_vi}</p>}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Measure display ── */}
      {isMeasureActive && measureDisplay && (
        <div className="absolute top-3 left-3 z-[1000] bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 max-w-[calc(100%-5rem)]">
          <span>{activeTool === "measure-area" ? "⬡" : "📏"} {measureDisplay}</span>
          <button
            className="opacity-80 hover:opacity-100 shrink-0"
            onClick={() => { clearMeasure(); }}
          >✕</button>
        </div>
      )}

      {/* ── Active tool indicator ── */}
      {(activeTool === "add" || activeTool === "delete" || (isMeasureActive && !measureDisplay)) && (
        <div className="absolute top-3 left-3 z-[1000] bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 max-w-[calc(100%-5rem)]">
          <span className="truncate">
            {activeTool === "add" && "➕ Nhấn vào bản đồ để đặt vị trí mới"}
            {activeTool === "delete" && "🗑️ Nhấn vào marker để xóa"}
            {activeTool === "measure-distance" && "📏 Nhấn các điểm để đo khoảng cách"}
            {activeTool === "measure-area" && "⬡ Nhấn 3+ điểm để đo diện tích"}
          </span>
          <button
            className="opacity-80 hover:opacity-100 shrink-0"
            onClick={() => { activeToolRef.current = "none"; setActiveTool("none"); clearMeasure(); }}
          >✕</button>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-gray-800/90 text-white text-xs px-4 py-2 rounded-full shadow-lg pointer-events-none text-center max-w-[90vw]">
          {toast}
        </div>
      )}

      {/* ── Marker popup ── */}
      {popup && (
        <>
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
              return cat ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-sm" style={{ backgroundColor: cat.color }}>{cat.icon} {cat.label}</span> : null;
            })()}
          </div>

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
              return cat ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs" style={{ backgroundColor: cat.color }}>{cat.icon} {cat.label}</span> : null;
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

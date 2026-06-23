"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix broken default marker icons in Next.js/webpack builds
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
import { NguonGen, CATEGORY_MAP, CATEGORIES, PHAN_NHOM_ICONS } from "@/data/nguonGen";
import { twemojiImgHtml } from "@/lib/twemoji";
import { apiGetForms } from "@/lib/api";
import { geocodeDistribution } from "@/lib/geocode";
import { THANH_HOA_BOUNDARY } from "@/data/thanhHoaBoundary";
import { THANH_HOA_COMMUNES } from "@/data/thanhHoaCommunes";

const MAP_CENTER: [number, number] = [20.0, 105.5];

// Basemaps: light (OSM standard) and satellite (Esri World Imagery). The
// satellite map's natural green terrain suits the agriculture theme and makes
// gene markers and the glowing "Nơi phân bố" points stand out. Esri imagery is
// label-free, so in satellite mode we overlay a transparent reference layer
// (boundaries + place names) so xã/phường/huyện/tỉnh are still readable.
const LIGHT_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const LIGHT_ATTR = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const SAT_TILES = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const SAT_ATTR = 'Tiles © <a href="https://www.esri.com/">Esri</a> — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community';
// Labels overlay rendered from OpenStreetMap (CARTO), which tracks Vietnam's
// 2025 administrative reform — Tỉnh → Xã/Phường, no Huyện — better than Esri's
// reference layer. Transparent: place names only, no basemap fill.
const SAT_LABELS = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png";
const SAT_LABELS_ATTR = '© <a href="https://carto.com/attributions">CARTO</a>';

interface MapViewProps {
  data: NguonGen[];
  isAdmin?: boolean;
  onAddNewAtPoint?: (lat: number, lng: number) => void;
  onDeleteItem?: (ma: string) => void;
  onViewDetail?: (item: NguonGen) => void;
  onLoginRequired?: () => void;
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

const BTN = "w-10 h-10 flex items-center justify-center rounded transition-colors text-white/90 hover:text-white hover:bg-white/15 active:bg-white/25 touch-manipulation";
const BTN_ON = "w-10 h-10 flex items-center justify-center rounded text-white bg-white/25 touch-manipulation";

function ToolButton({
  title, onClick, active, locked, children,
}: {
  title: string; onClick: () => void; active?: boolean; locked?: boolean; children: React.ReactNode;
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
        className={`${active ? BTN_ON : BTN}${locked ? " opacity-60" : ""}`}
      >
        {children}
        {locked && (
          <span className="absolute bottom-0.5 right-0.5 text-[9px] leading-none pointer-events-none">🔒</span>
        )}
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

export default function MapView({ data, isAdmin, onAddNewAtPoint, onDeleteItem, onViewDetail, onLoginRequired }: MapViewProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const distLayerRef = useRef<L.LayerGroup | null>(null);
  const distActiveRef = useRef(false);
  const spiderLayerRef = useRef<L.LayerGroup | null>(null);
  const expandedKeyRef = useRef<string | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);
  const activeToolRef = useRef<string>("none");
  const measureLayerRef = useRef<L.LayerGroup | null>(null);
  const measurePointsRef = useRef<[number, number][]>([]);
  const legendBtnRef = useRef<HTMLDivElement>(null);
  const linhVucBtnRef = useRef<HTMLDivElement>(null);

  const [popup, setPopup] = useState<PopupInfo | null>(null);
  const [activeTool, setActiveTool] = useState<string>("none");
  const [measureSubOpen, setMeasureSubOpen] = useState(false);
  const [measureDisplay, setMeasureDisplay] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showLinhVucPanel, setShowLinhVucPanel] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // "Nơi phân bố" highlight mode.
  const [distInfo, setDistInfo] = useState<{ ten: string; found: number } | null>(null);
  const [distLoading, setDistLoading] = useState<{ done: number; total: number } | null>(null);
  const [satMap, setSatMap] = useState(true); // satellite basemap by default
  const satMapRef = useRef(satMap);
  satMapRef.current = satMap;

  const showToast = useCallback((msg: string, duration = 2800) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  }, []);

  // Call onLoginRequired (or show a toast) when a guest clicks a restricted tool
  const requireAdmin = useCallback((action: () => void) => {
    if (isAdmin) { action(); return; }
    if (onLoginRequired) onLoginRequired();
    else showToast("Vui lòng đăng nhập với quyền admin để sử dụng tính năng này", 3000);
  }, [isAdmin, onLoginRequired, showToast]);

  // (Re)build the basemap. Satellite mode = Esri imagery + a transparent label
  // overlay (boundaries + xã/phường/huyện/tỉnh names); light mode = OSM only.
  const applyBasemap = useCallback((map: L.Map, satellite: boolean) => {
    if (tileLayerRef.current) { map.removeLayer(tileLayerRef.current); tileLayerRef.current = null; }
    if (labelLayerRef.current) { map.removeLayer(labelLayerRef.current); labelLayerRef.current = null; }

    const base = L.tileLayer(satellite ? SAT_TILES : LIGHT_TILES, {
      attribution: satellite ? SAT_ATTR : LIGHT_ATTR,
      subdomains: satellite ? "" : "abc",
      maxZoom: 19,
      // Esri imagery runs out of high-res tiles over rural areas and returns a
      // grey "Map data not yet available" placeholder past ~z18. Cap the native
      // zoom so Leaflet upscales z18 imagery instead of requesting those.
      ...(satellite ? { maxNativeZoom: 18 } : {}),
    }).addTo(map);
    base.bringToBack();
    tileLayerRef.current = base;

    if (satellite) {
      // Transparent reference layer drawn above the imagery but still in the
      // tile pane, so it stays below the gene markers / glow points.
      const labels = L.tileLayer(SAT_LABELS, {
        maxZoom: 19,
        subdomains: "abcd",
        attribution: SAT_LABELS_ATTR,
        opacity: 0.7, // let the place names recede behind the gene markers
      }).addTo(map);
      labelLayerRef.current = labels;
    }
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

  // ── "Nơi phân bố" highlight mode ──
  // Geocode the record's free-text distribution field and show only those
  // points glowing on the map (the normal gene markers are hidden until exit).
  const showDistribution = useCallback(async (item: NguonGen) => {
    const map = mapRef.current;
    const distLayer = distLayerRef.current;
    if (!map || !distLayer) return;

    setPopup(null);
    setDistInfo(null);
    setDistLoading({ done: 0, total: 0 });

    let text = "";
    try {
      const forms = await apiGetForms(item.ma);
      text = forms.form1?.noi_phan_bo ?? "";
    } catch {
      /* fall through to the empty-text guard */
    }

    if (!text.trim()) {
      setDistLoading(null);
      showToast("Nguồn gen này chưa có thông tin Nơi phân bố", 3500);
      return;
    }

    const { points, resolved } = await geocodeDistribution(text, (done, t) =>
      setDistLoading({ done, total: t })
    );
    setDistLoading(null);

    // Hide the normal markers, draw the glowing distribution points.
    if (layerGroupRef.current && map.hasLayer(layerGroupRef.current)) {
      map.removeLayer(layerGroupRef.current);
    }
    distLayer.clearLayers();
    const bounds: [number, number][] = [];
    points.forEach((p) => {
      const icon = L.divIcon({
        className: "",
        html: `<div class="dist-glow"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const m = L.marker([p.lat, p.lng], { icon, title: p.names.join(", ") });
      m.bindTooltip(p.names.join(", ") + (p.approx ? " — vị trí cấp huyện" : ""), {
        direction: "top",
        offset: [0, -8],
      });
      distLayer.addLayer(m);
      bounds.push([p.lat, p.lng]);
    });

    distActiveRef.current = true;
    setDistInfo({ ten: item.ten, found: resolved });
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    } else {
      showToast("Không định vị được địa danh nào trong Nơi phân bố (OSM thiếu dữ liệu cấp xã)", 4500);
    }
  }, [showToast]);

  const exitDistribution = useCallback(() => {
    const map = mapRef.current;
    distActiveRef.current = false;
    distLayerRef.current?.clearLayers();
    if (map && layerGroupRef.current && !map.hasLayer(layerGroupRef.current)) {
      map.addLayer(layerGroupRef.current);
    }
    setDistInfo(null);
    setDistLoading(null);
  }, []);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: MAP_CENTER,
      zoom: 9,
      zoomControl: false,
    });

    applyBasemap(map, satMapRef.current);

    measureLayerRef.current = L.layerGroup().addTo(map);
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
      spiderLayerRef.current?.clearLayers();
      expandedKeyRef.current = null;
    });

    mapRef.current = map;

    // Admin boundaries (above the basemap/labels, below markers): thin orange
    // lines for the Xã/Phường, plus a thicker outline for the province edge.
    L.geoJSON(THANH_HOA_COMMUNES, {
      interactive: false,
      style: { color: "#ff7800", weight: 0.8, opacity: 0.75 },
    }).addTo(map);
    L.geoJSON(THANH_HOA_BOUNDARY, {
      interactive: false,
      style: { color: "#ff7800", weight: 2.5, fill: false },
    }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    distLayerRef.current = L.layerGroup().addTo(map);
    spiderLayerRef.current = L.layerGroup().addTo(map);

    // Collapse an expanded same-coordinate cluster on zoom.
    map.on("zoomstart", () => { spiderLayerRef.current?.clearLayers(); expandedKeyRef.current = null; });

    // Leaflet measures the container once at init. If the container later grows
    // (layout settling, mobile category bar, orientation change, font/data load
    // shifting flex heights), the map keeps its stale size and leaves a blank
    // band below the tiles. Re-sync on every container resize.
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
      distLayerRef.current = null;
      spiderLayerRef.current = null;
      tileLayerRef.current = null;
      labelLayerRef.current = null;
      measureLayerRef.current = null;
    };
  }, [onAddNewAtPoint, doMeasure, applyBasemap]);

  // Sync markers whenever data changes
  useEffect(() => {
    const map = mapRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    spiderLayerRef.current?.clearLayers();
    expandedKeyRef.current = null;

    // A gene marker (emoji in a white chip) at a given position. `pos` can be an
    // offset position for a spiderfied child, while the data/popup still refer to
    // the real record.
    const geneMarker = (item: NguonGen, pos: [number, number]) => {
      const cat = CATEGORY_MAP[item.nhom];
      const emoji = PHAN_NHOM_ICONS[item.phan_nhom] ?? cat?.icon ?? "📍";
      const imgHtml = twemojiImgHtml(emoji, 20, "display:block;");
      const icon = L.divIcon({
        className: "",
        html: `<div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:rgba(255,255,255,0.95);border:1.5px solid rgba(255,255,255,0.95);box-shadow:0 1px 4px rgba(0,0,0,0.55);">${imgHtml}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const marker = L.marker(pos, { icon, title: item.ten });
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
          doMeasure(pos[0], pos[1]);
          return;
        }
        const point = map.latLngToContainerPoint(pos);
        setPopup({ item, x: point.x, y: point.y });
      });
      return marker;
    };

    // Fan out the records that share one exact coordinate so each is clickable.
    const spiderfy = (lat: number, lng: number, items: NguonGen[]) => {
      const sl = spiderLayerRef.current;
      if (!sl) return;
      sl.clearLayers();
      const center = map.latLngToLayerPoint([lat, lng]);
      const n = items.length;
      const radius = 22 + n * 6;
      items.forEach((item, i) => {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        const p = L.point(center.x + radius * Math.cos(angle), center.y + radius * Math.sin(angle));
        const ll = map.layerPointToLatLng(p);
        L.polyline([[lat, lng], [ll.lat, ll.lng]], { color: "#ffffff", weight: 1, opacity: 0.6 }).addTo(sl);
        sl.addLayer(geneMarker(item, [ll.lat, ll.lng]));
      });
    };

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const itemEmoji = (it: NguonGen) =>
      PHAN_NHOM_ICONS[it.phan_nhom] ?? CATEGORY_MAP[it.nhom]?.icon ?? "📍";

    // A cluster badge for several records stacked on the exact same coordinate.
    // Shows the most common category's emoji plus a count, and a hover tooltip
    // listing the records, so you can tell what's there without clicking.
    const clusterMarker = (lat: number, lng: number, items: NguonGen[], key: string) => {
      const n = items.length;
      const counts = new Map<string, number>();
      for (const it of items) counts.set(itemEmoji(it), (counts.get(itemEmoji(it)) ?? 0) + 1);
      const repEmoji = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const imgHtml = twemojiImgHtml(repEmoji, 18, "display:block;");
      const icon = L.divIcon({
        className: "",
        html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9999px;background:rgba(255,255,255,0.95);border:1.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.55);">${imgHtml}<span style="position:absolute;top:-6px;right:-7px;display:flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 3px;border-radius:9999px;background:#15803d;border:1.5px solid #fff;color:#fff;font-weight:700;font-size:11px;line-height:1;">${n}</span></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      const marker = L.marker([lat, lng], { icon, title: `${n} nguồn gen cùng vị trí` });
      const listHtml = items
        .map((it) => `${itemEmoji(it)} <b>${esc(it.ma)}</b> — ${esc(it.ten)}`)
        .join("<br>");
      marker.bindTooltip(
        `<div style="font-weight:700;margin-bottom:2px;">${n} nguồn gen cùng vị trí</div>${listHtml}`,
        { direction: "top", offset: [0, -14], opacity: 0.97 }
      );
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        const tool = activeToolRef.current;
        if (tool === "measure-distance" || tool === "measure-area") { doMeasure(lat, lng); return; }
        if (tool === "delete") return;
        if (expandedKeyRef.current === key) {
          spiderLayerRef.current?.clearLayers();
          expandedKeyRef.current = null;
        } else {
          setPopup(null);
          spiderfy(lat, lng, items);
          expandedKeyRef.current = key;
        }
      });
      return marker;
    };

    // Group records by exact coordinate; only exact duplicates get a cluster.
    const groups = new Map<string, NguonGen[]>();
    const bounds: [number, number][] = [];
    for (const item of data) {
      const key = `${item.lat.toFixed(5)},${item.lng.toFixed(5)}`;
      const g = groups.get(key);
      if (g) g.push(item);
      else groups.set(key, [item]);
      bounds.push([item.lat, item.lng]);
    }

    for (const [key, items] of groups) {
      if (items.length === 1) {
        group.addLayer(geneMarker(items[0], [items[0].lat, items[0].lng]));
      } else {
        const [lat, lng] = key.split(",").map(Number);
        group.addLayer(clusterMarker(lat, lng, items, key));
      }
    }

    // Don't steal the viewport while the "Nơi phân bố" highlight is showing.
    if (bounds.length > 0 && !distActiveRef.current) map.fitBounds(bounds, { padding: [40, 40] });
  }, [data, onDeleteItem, doMeasure]);

  // Swap the basemap when the dark toggle changes (the init effect already set
  // the initial one, so skip the first run to avoid a redundant tile reload).
  const firstBasemapRun = useRef(true);
  useEffect(() => {
    if (firstBasemapRun.current) { firstBasemapRun.current = false; return; }
    const map = mapRef.current;
    if (!map) return;
    applyBasemap(map, satMap);
  }, [satMap, applyBasemap]);

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

  const linhVucTopPx = (() => {
    const btn = linhVucBtnRef.current;
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

        <ToolButton title={satMap ? "Bản đồ thường" : "Bản đồ vệ tinh"} onClick={() => setSatMap((d) => !d)} active={satMap}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </ToolButton>

        <ToolButton locked={!isAdmin} title="Xóa nguồn gen" onClick={() => requireAdmin(() => { activateTool(activeTool === "delete" ? "none" : "delete"); showToast("Nhấn vào marker để xóa nguồn gen", 4000); })} active={activeTool === "delete"}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </ToolButton>

        <ToolButton locked={!isAdmin} title="Thêm mới nguồn gen" onClick={() => requireAdmin(() => { if (onAddNewAtPoint) { activateTool(activeTool === "add" ? "none" : "add"); showToast("Nhấn vào bản đồ để đặt vị trí nguồn gen mới", 4000); } })} active={activeTool === "add"}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </ToolButton>

        <ToolButton locked={!isAdmin} title="Xuất ảnh bản đồ" onClick={() => requireAdmin(exportMapImage)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </ToolButton>

        <ToolButton locked={!isAdmin} title="Xuất PDF" onClick={() => requireAdmin(exportMapPDF)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </ToolButton>

        <div ref={legendBtnRef}>
          <ToolButton locked={!isAdmin} title="Chú giải" onClick={() => requireAdmin(() => setShowLegend((v) => !v))} active={showLegend}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </ToolButton>
        </div>

        <div ref={linhVucBtnRef}>
          <ToolButton locked={!isAdmin} title="Khai thác dữ liệu theo lĩnh vực" onClick={() => requireAdmin(() => setShowLinhVucPanel((v) => !v))} active={showLinhVucPanel}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </ToolButton>
        </div>

        <ToolButton locked={!isAdmin} title="Xem chi tiết nguồn gen" onClick={() => requireAdmin(() => showToast("Nhấn vào marker để xem chi tiết"))}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </ToolButton>

        <ToolButton locked={!isAdmin} title="Tìm đường" onClick={() => requireAdmin(() => router.push("/tim-duong"))}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </ToolButton>

        <ToolButton locked={!isAdmin} title="Danh mục hiện trạng bảo tồn, khai thác, sử dụng nguồn gen Tỉnh Thanh Hóa" onClick={() => requireAdmin(() => window.open("/danh-muc-hien-trang", "_blank"))}>
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
      {showLegend && (() => {
        const rows = (
          <div className="flex flex-col px-4 py-2 gap-0 overflow-y-auto">
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
        );
        return (
          <>
            {/* Mobile bottom sheet */}
            <div className="sm:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 flex flex-col" style={{ maxHeight: "70%" }}>
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 shrink-0">
                <span className="font-bold text-base text-gray-900">Chú giải</span>
                <button
                  onClick={() => setShowLegend(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg leading-none"
                >✕</button>
              </div>
              {rows}
            </div>

            {/* Desktop floating card */}
            <div
              className="hidden sm:flex absolute z-[1000] bg-white rounded-2xl shadow-xl overflow-hidden flex-col"
              style={{ minWidth: 220, maxWidth: "calc(100vw - 4rem)", right: "3.25rem", top: legendTopPx, maxHeight: `calc(100% - ${legendTopPx}px - 0.75rem)` }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
                <span className="font-bold text-base text-gray-900">Chú giải</span>
                <button
                  onClick={() => setShowLegend(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-base font-bold"
                >›</button>
              </div>
              {rows}
            </div>
          </>
        );
      })()}

      {/* ── Khai thác dữ liệu theo lĩnh vực panel ── */}
      {showLinhVucPanel && (
        <div
          className="absolute z-[1001] bg-white rounded-2xl shadow-xl overflow-hidden"
          style={{ right: "3.25rem", top: linhVucTopPx }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-bold text-sm text-gray-900">Khai thác dữ liệu theo lĩnh vực</span>
            <button
              onClick={() => setShowLinhVucPanel(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-base font-bold ml-3"
            >✕</button>
          </div>
          <div className="flex gap-1 px-3 py-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setShowLinhVucPanel(false);
                  router.push(`/ban-do/${cat.id.toLowerCase()}`);
                }}
                className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl hover:bg-gray-100 transition-colors min-w-[3.5rem]"
                title={cat.label}
              >
                <span className="text-3xl leading-none">{cat.icon}</span>
                <span className="text-[10px] text-gray-600 text-center leading-tight">{cat.label}</span>
              </button>
            ))}
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

      {/* ── "Nơi phân bố" banner ── */}
      {(distLoading || distInfo) && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1001] bg-amber-500 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 max-w-[calc(100%-1.5rem)]">
          {distLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="truncate">
                Đang tìm vị trí phân bố{distLoading.total ? ` (${distLoading.done}/${distLoading.total})` : "…"}
              </span>
            </>
          ) : distInfo ? (
            <>
              <span aria-hidden>📍</span>
              <span className="truncate">
                Nơi phân bố: {distInfo.ten} — {distInfo.found} vị trí
              </span>
              <button
                onClick={exitDistribution}
                className="ml-1 bg-white/20 hover:bg-white/30 rounded-full px-2 py-0.5 shrink-0"
              >
                Thoát
              </button>
            </>
          ) : null}
        </div>
      )}

      {/* ── Marker popup ── */}
      {popup && (() => {
        const item = popup.item;
        const closeBtn = (
          <button onClick={() => setPopup(null)} className="text-gray-400 hover:text-gray-600 shrink-0 text-lg leading-none">✕</button>
        );
        const rows = (
          <div className="space-y-1 text-sm text-gray-700">
            <p><span className="text-gray-500">Mã nguồn gen: </span><span className="font-bold">{item.ma}</span></p>
            <p><span className="text-gray-500">Tên Việt Nam: </span><span className="font-bold">{item.ten}</span></p>
            {item.khoa_hoc && <p><span className="text-gray-500">Tên khoa học: </span><em>{item.khoa_hoc}</em></p>}
            {item.don_vi && <p><span className="text-gray-500">Địa chỉ: </span><span className="font-bold">{item.don_vi}</span></p>}
          </div>
        );
        const actions = (
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex gap-3">
              <button
                onClick={() => { setPopup(null); onViewDetail?.(item); }}
                className="flex-1 text-center text-sm font-medium text-green-700 border border-green-600 rounded-lg py-1.5 hover:bg-green-50 transition-colors"
              >
                Xem thêm
              </button>
              <button
                onClick={() => { const it = popup!.item; setPopup(null); router.push(`/tim-duong?ma=${encodeURIComponent(it.ma)}`); }}
                className="flex-1 text-center text-sm font-medium text-blue-700 border border-blue-500 rounded-lg py-1.5 hover:bg-blue-50 transition-colors"
              >
                Chỉ đường
              </button>
            </div>
            <button
              onClick={() => showDistribution(item)}
              className="w-full text-center text-sm font-medium text-amber-700 border border-amber-500 rounded-lg py-1.5 hover:bg-amber-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <span aria-hidden>📍</span> Nơi phân bố
            </button>
          </div>
        );
        return (
          <>
            {/* Mobile bottom sheet */}
            <div className="sm:hidden absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 p-4">
              <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">{rows}</div>
                {closeBtn}
              </div>
              {actions}
            </div>

            {/* Desktop floating card */}
            <div
              className="hidden sm:block absolute z-[1000] bg-white rounded-xl shadow-xl border border-gray-200 p-4"
              style={{
                left: Math.min(Math.max(popup.x - 130, 8), (containerRef.current?.clientWidth ?? 600) - 276),
                top: Math.max(popup.y - 200, 8),
                width: 260,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">{rows}</div>
                {closeBtn}
              </div>
              {actions}
            </div>
          </>
        );
      })()}

    </div>
  );
}

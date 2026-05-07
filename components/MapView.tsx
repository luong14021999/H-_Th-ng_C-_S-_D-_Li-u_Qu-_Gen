"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NguonGen, CATEGORY_MAP } from "@/data/nguonGen";

const MAP_CENTER: [number, number] = [20.0, 105.5];

interface MapViewProps {
  data: NguonGen[];
}

interface PopupInfo {
  item: NguonGen;
  x: number;
  y: number;
}

export default function MapView({ data }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [popup, setPopup] = useState<PopupInfo | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: MAP_CENTER,
      zoom: 9,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    map.on("click", () => setPopup(null));

    mapRef.current = map;
    layerGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

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
  }, [data]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />

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

      <div className="absolute bottom-6 right-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 text-xs text-gray-600 pointer-events-none">
        Hiển thị <span className="font-bold text-teal-700">{data.length}</span> điểm
      </div>
    </div>
  );
}

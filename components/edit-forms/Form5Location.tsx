"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { NguonGen } from "@/data/nguonGen";

// Fix broken default marker icons in Next.js bundles.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  basic: NguonGen;
  onBasicChange: (updated: NguonGen) => void;
  readOnly?: boolean;
}

const DEFAULT_CENTER: [number, number] = [20.0, 105.5]; // Thanh Hoá

export default function Form5Location({ basic, onBasicChange, readOnly }: Props) {
  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [editing, setEditing] = useState(false);

  // Local input mirrors so the user can type freely without immediately
  // committing invalid intermediate values to basic.
  const [latStr, setLatStr] = useState(String(basic.lat ?? ""));
  const [lngStr, setLngStr] = useState(String(basic.lng ?? ""));

  useEffect(() => { setLatStr(String(basic.lat ?? "")); }, [basic.lat]);
  useEffect(() => { setLngStr(String(basic.lng ?? "")); }, [basic.lng]);

  // Initialize map once.
  useEffect(() => {
    if (!mapHostRef.current || mapRef.current) return;

    const initLat = Number.isFinite(basic.lat) && basic.lat !== 0 ? basic.lat : DEFAULT_CENTER[0];
    const initLng = Number.isFinite(basic.lng) && basic.lng !== 0 ? basic.lng : DEFAULT_CENTER[1];

    const map = L.map(mapHostRef.current, { zoomControl: true }).setView([initLat, initLng], 13);

    // OpenStreetMap — same tiles as the home-page map for visual consistency.
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([initLat, initLng], { draggable: !readOnly }).addTo(map);

    // Click marker to zoom in for a closer look.
    marker.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      const { lat, lng } = marker.getLatLng();
      map.flyTo([lat, lng], Math.max(map.getZoom() + 2, 17), { duration: 0.6 });
    });

    if (!readOnly) {
      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        onBasicChange({ ...basic, lat: +lat.toFixed(6), lng: +lng.toFixed(6) });
      });
      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        onBasicChange({ ...basic, lat: +e.latlng.lat.toFixed(6), lng: +e.latlng.lng.toFixed(6) });
      });
    }

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync marker when basic.lat/lng change externally (e.g. typed in inputs).
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    const lat = Number(basic.lat);
    const lng = Number(basic.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return;
    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng], { animate: true });
  }, [basic.lat, basic.lng]);

  const commitLatLng = () => {
    const lat = Number(latStr);
    const lng = Number(lngStr);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      onBasicChange({ ...basic, lat: +lat.toFixed(6), lng: +lng.toFixed(6) });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Toạ độ header */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
          <h3 className="text-sm font-bold text-red-700">Toạ độ</h3>
          {!readOnly && (
            <button
              type="button"
              onClick={() => {
                if (editing) commitLatLng();
                setEditing((v) => !v);
              }}
              className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
              title={editing ? "Lưu toạ độ" : "Chỉnh sửa toạ độ"}
              aria-label={editing ? "Lưu toạ độ" : "Chỉnh sửa toạ độ"}
            >
              {editing ? (
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 px-3 py-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-blue-700 font-medium w-16">Vĩ độ :</span>
            {editing ? (
              <input
                type="number"
                step="0.000001"
                value={latStr}
                onChange={(e) => setLatStr(e.target.value)}
                onBlur={commitLatLng}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent"
              />
            ) : (
              <span className="flex-1 text-right text-sm text-gray-800 font-mono">
                {basic.lat?.toFixed(5) ?? "—"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-blue-700 font-medium w-16">Kinh độ :</span>
            {editing ? (
              <input
                type="number"
                step="0.000001"
                value={lngStr}
                onChange={(e) => setLngStr(e.target.value)}
                onBlur={commitLatLng}
                className="flex-1 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent"
              />
            ) : (
              <span className="flex-1 text-right text-sm text-gray-800 font-mono">
                {basic.lng?.toFixed(5) ?? "—"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div
        ref={mapHostRef}
        className="w-full rounded-lg border border-gray-200 overflow-hidden"
        style={{ height: "min(60vh, 560px)" }}
      />

      <p className="text-xs text-gray-500 italic">
        Nhấn vào marker để phóng to xem chi tiết.
        {!readOnly && " Kéo marker hoặc nhấn vào bản đồ để đổi vị trí. Có thể nhập trực tiếp vĩ độ / kinh độ bằng nút bút chì ở góc trên bên phải."}
      </p>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { apiGetAll } from "@/lib/api";
import { NguonGen, CATEGORIES, CATEGORY_MAP } from "@/data/nguonGen";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function TimDuongPage() {
  const router = useRouter();
  const [data, setData] = useState<NguonGen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const handleSelect = (item: NguonGen) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="h-dvh flex flex-col bg-white overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-bold text-base text-gray-900">Tìm đường đến nguồn gen</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar ── */}
        <div
          className={`flex flex-col bg-white border-r border-gray-200 shrink-0 transition-all duration-300 ${
            sidebarOpen ? "w-full md:w-[360px]" : "w-0 md:w-0"
          } overflow-hidden`}
        >
          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-100">
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
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 leading-none text-lg">×</button>
              )}
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex gap-2 px-4 py-2 overflow-x-auto shrink-0 border-b border-gray-100">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                !selectedCategory ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  selectedCategory === cat.id ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* List */}
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
                      {/* Thumbnail */}
                      <div
                        className="w-16 h-16 shrink-0 rounded-xl flex items-center justify-center text-3xl"
                        style={{ backgroundColor: `${cat?.color ?? "#888"}22` }}
                      >
                        {cat?.icon ?? "📍"}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{item.ten}</p>
                        {item.phan_nhom && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{item.phan_nhom}</p>
                        )}
                        {item.don_vi && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{item.don_vi}</p>
                        )}
                      </div>
                      {/* Arrow */}
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

        {/* ── Map (desktop only) ── */}
        <div className="hidden md:flex flex-1 relative">
          {/* Toggle sidebar button */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="absolute top-3 left-3 z-[1000] w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
          <MapView data={data} isAdmin={false} />
        </div>
      </div>
    </div>
  );
}

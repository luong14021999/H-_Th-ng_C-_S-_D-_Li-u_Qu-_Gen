"use client";

import { useState } from "react";
import { CATEGORIES, CATEGORY_MAP, PHAN_NHOM_ICONS, NguonGen } from "@/data/nguonGen";
import { ExtendedFormData } from "@/data/extendedTypes";
import { normalizeVi } from "@/lib/text";
import { imageUrl } from "@/lib/images";
import Twemoji from "./Twemoji";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onCategorySelect: (id: string | null) => void;
  counts: Record<string, number>;
  total: number;
  items: NguonGen[];
  extendedMap: Record<string, ExtendedFormData>;
  onItemSelect?: (item: NguonGen) => void;
}

function ItemThumb({ item, extendedMap }: { item: NguonGen; extendedMap: Record<string, ExtendedFormData> }) {
  const cat = CATEGORY_MAP[item.nhom];
  const img = extendedMap[item.ma]?.form1?.hinh_anh?.[0];
  if (img) {
    return <img src={imageUrl(img, { width: 96, height: 96, resize: "cover" })} alt="" loading="lazy" decoding="async" className="w-11 h-11 rounded-lg object-cover shrink-0 border border-gray-200" />;
  }
  const icon = PHAN_NHOM_ICONS[item.phan_nhom] ?? cat?.icon ?? "🌿";
  return (
    <div
      className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center border"
      style={{ backgroundColor: (cat?.color ?? "#6b7280") + "18", borderColor: (cat?.color ?? "#6b7280") + "40" }}
    >
      <Twemoji emoji={icon} size={22} />
    </div>
  );
}

export default function Sidebar({
  open, onClose, selectedCategory, onCategorySelect,
  counts, total, items, extendedMap, onItemSelect,
}: SidebarProps) {
  const [search, setSearch] = useState("");

  const activeCat = selectedCategory ? CATEGORY_MAP[selectedCategory] : null;

  const categoryItems = selectedCategory
    ? items.filter((i) => i.nhom === selectedCategory)
    : [];

  const filteredItems = search.trim()
    ? (() => {
        const q = normalizeVi(search);
        return categoryItems.filter(
          (i) =>
            normalizeVi(i.ten).includes(q) ||
            normalizeVi(i.khoa_hoc).includes(q) ||
            normalizeVi(i.ma).includes(q)
        );
      })()
    : categoryItems;

  const handleBack = () => {
    onCategorySelect(null);
    setSearch("");
  };

  const handleCategoryClick = (id: string) => {
    onCategorySelect(selectedCategory === id ? null : id);
    setSearch("");
  };

  const handleItemClick = (item: NguonGen) => {
    onItemSelect?.(item);
    onClose();
  };

  // Category list view
  const categoryContent = (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phân nhóm nguồn gen</p>
        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600 p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 p-2 flex flex-col gap-1 overflow-y-auto">
        <button
          onClick={() => { onCategorySelect(null); setSearch(""); }}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors text-sm ${
            selectedCategory === null ? "bg-green-600 text-white" : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <span>🗂️</span>
            <span className="font-medium">Tất cả</span>
          </span>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
            selectedCategory === null ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
          }`}>
            {total}
          </span>
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors text-sm ${
              selectedCategory === cat.id ? "text-white" : "hover:bg-gray-100 text-gray-700"
            }`}
            style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
          >
            <span className="flex items-center gap-2">
              <Twemoji emoji={cat.icon} size={18} />
              <span className="font-medium">{cat.label}</span>
            </span>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
              selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {counts[cat.id] ?? 0}
            </span>
          </button>
        ))}
      </div>

    </div>
  );

  // Item drill-down view
  const drilldownContent = (
    <div className="flex flex-col h-full">
      {/* Back header */}
      <div className="flex items-center gap-2 px-2 py-2.5 border-b border-gray-100 shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-green-700 transition-colors px-1 py-0.5 rounded"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span style={{ color: activeCat?.color }}>{activeCat?.icon}</span>
          <span>{activeCat?.label}</span>
        </button>
        <button onClick={onClose} className="md:hidden ml-auto text-gray-400 hover:text-gray-600 p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-2 py-2 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm nguồn gen..."
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1 px-1">{filteredItems.length} kết quả</p>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs">Không tìm thấy kết quả</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <button
              key={item.ma}
              onClick={() => handleItemClick(item)}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-green-50 transition-colors text-left"
            >
              <ItemThumb item={item} extendedMap={extendedMap} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 leading-snug break-words">
                  <span className="text-gray-400 text-xs font-normal">Tên Việt Nam: </span>
                  <span className="font-semibold">{item.ten}</span>
                </p>
                {item.khoa_hoc && (
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug break-words">
                    <span className="text-gray-400">Tên khoa học: </span>
                    <span className="italic">{item.khoa_hoc}</span>
                  </p>
                )}
              </div>
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))
        )}
      </div>
    </div>
  );

  const content = selectedCategory ? drilldownContent : categoryContent;

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 bg-white border-r border-gray-200 flex-col overflow-hidden z-10 shadow-sm">
        {content}
      </aside>

      {/* Mobile: drawer overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[1500] flex">
          <div className="w-4/5 max-w-xs bg-white shadow-2xl flex flex-col h-full">
            {content}
          </div>
          <div className="flex-1 bg-black/40" onClick={onClose} />
        </div>
      )}
    </>
  );
}

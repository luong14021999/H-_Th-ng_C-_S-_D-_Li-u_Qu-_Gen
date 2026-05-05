"use client";

import { CATEGORIES } from "@/data/nguonGen";

interface SidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (id: string | null) => void;
  counts: Record<string, number>;
  total: number;
}

export default function Sidebar({ selectedCategory, onCategorySelect, counts, total }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto z-10 shadow-sm">
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phân nhóm nguồn gen</p>
      </div>

      <div className="flex-1 p-2 flex flex-col gap-1">
        <button
          onClick={() => onCategorySelect(null)}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors text-sm ${
            selectedCategory === null
              ? "bg-teal-700 text-white"
              : "hover:bg-gray-100 text-gray-700"
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
            onClick={() => onCategorySelect(selectedCategory === cat.id ? null : cat.id)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors text-sm ${
              selectedCategory === cat.id
                ? "text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
          >
            <span className="flex items-center gap-2">
              <span>{cat.icon}</span>
              <span className="font-medium">{cat.label}</span>
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {counts[cat.id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Nguồn gen Tỉnh Thanh Hóa</p>
      </div>
    </aside>
  );
}

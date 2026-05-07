"use client";

import { CATEGORIES } from "@/data/nguonGen";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onCategorySelect: (id: string | null) => void;
  counts: Record<string, number>;
  total: number;
}

export default function Sidebar({ open, onClose, selectedCategory, onCategorySelect, counts, total }: SidebarProps) {
  const handleSelect = (id: string | null) => {
    onCategorySelect(id);
    onClose();
  };

  const content = (
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
          onClick={() => handleSelect(null)}
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
            onClick={() => handleSelect(selectedCategory === cat.id ? null : cat.id)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left transition-colors text-sm ${
              selectedCategory === cat.id ? "text-white" : "hover:bg-gray-100 text-gray-700"
            }`}
            style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
          >
            <span className="flex items-center gap-2">
              <span>{cat.icon}</span>
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

      <div className="p-3 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Nguồn gen Tỉnh Thanh Hóa</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 bg-white border-r border-gray-200 flex-col overflow-y-auto z-10 shadow-sm">
        {content}
      </aside>

      {/* Mobile: drawer overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[1500] flex">
          <div className="w-64 bg-white shadow-2xl flex flex-col h-full">
            {content}
          </div>
          <div className="flex-1 bg-black/40" onClick={onClose} />
        </div>
      )}
    </>
  );
}

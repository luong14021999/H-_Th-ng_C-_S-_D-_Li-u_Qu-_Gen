"use client";

import { useState, useMemo } from "react";
import { CATEGORIES, PHAN_NHOM_BY_NHOM, PHAN_NHOM_ICONS } from "@/data/nguonGen";
import Twemoji from "./Twemoji";

const IconFilter = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
);

export default function NhomNguonGenTable() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = useMemo(() => {
    if (!search.trim()) return CATEGORIES;
    const q = search.toLowerCase();
    return CATEGORIES.filter((cat) => {
      if (cat.label.toLowerCase().includes(q)) return true;
      return (PHAN_NHOM_BY_NHOM[cat.id] ?? []).some((p) => p.toLowerCase().includes(q));
    });
  }, [search]);

  let rowIndex = 0;

  return (
    <div className="flex flex-1 overflow-hidden bg-gray-50">
      {/* Mobile backdrop */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileFilterOpen(false)} />
      )}

      {/* Filter aside */}
      <aside className={`fixed inset-y-0 left-0 z-40 md:static md:z-auto w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col transition-transform md:transition-none ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="md:hidden flex items-center justify-between px-4 pt-3 pb-1">
          <span className="text-sm font-semibold text-gray-700">Bộ lọc</span>
          <button onClick={() => setMobileFilterOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Tên nhóm nguồn gen</span>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setSearch("")}>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên nhóm nguồn gen"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-3 md:px-6 py-3 md:py-4 bg-white border-b border-gray-200">
          <button
            className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100 shrink-0"
            onClick={() => setMobileFilterOpen(true)}
          >
            <IconFilter />
          </button>
          <h1 className="text-base md:text-xl font-semibold text-gray-800 flex-1 min-w-0 truncate">
            Nhóm nguồn gen
          </h1>
          <div className="flex gap-1.5 shrink-0">
            <button className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-2.5 md:px-4 py-2 rounded transition-colors">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span className="hidden sm:inline">Xuất file excel</span>
            </button>
            <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-2.5 md:px-4 py-2 rounded transition-colors">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span className="hidden sm:inline">Thêm mới (F2)</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-3 md:px-6 py-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="w-10 px-3 py-3 text-center font-medium">#</th>
                  <th className="px-4 py-3 text-left font-medium">Tên nhóm nguồn gen</th>
                  <th className="w-28 px-4 py-3 text-center font-medium">Hình ảnh</th>
                  <th className="w-28 px-4 py-3 text-center font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => {
                  const isOpen = expanded.has(cat.id);
                  const subGroups = PHAN_NHOM_BY_NHOM[cat.id] ?? [];
                  rowIndex++;
                  const parentIndex = rowIndex;
                  const matchSearch = search.trim() ? cat.label.toLowerCase().includes(search.toLowerCase()) : true;

                  return [
                    <tr key={cat.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => toggle(cat.id)}
                          className="w-5 h-5 border border-gray-400 rounded-sm flex items-center justify-center text-gray-600 hover:bg-gray-100 mx-auto"
                        >
                          {isOpen ? "−" : "+"}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">{parentIndex}. {cat.label}</td>
                      <td className="px-4 py-3 text-center"><Twemoji emoji={cat.icon} size={28} /></td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button className="text-green-600 hover:text-green-800" title="Chỉnh sửa">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <span className="text-gray-300">|</span>
                          <button className="text-red-500 hover:text-red-700" title="Xóa">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>,
                    ...(isOpen
                      ? subGroups
                          .filter((p) => !search.trim() || p.toLowerCase().includes(search.toLowerCase()) || matchSearch)
                          .map((phanNhom, idx) => (
                            <tr key={`${cat.id}-${phanNhom}`} className="border-b border-gray-100 bg-blue-50/40 hover:bg-blue-100/60 transition-colors">
                              <td className="px-3 py-2.5 text-center text-gray-400 text-xs">{idx + 1}</td>
                              <td className="px-4 py-2.5 pl-10 text-gray-700">{phanNhom}</td>
                              <td className="px-4 py-2.5 text-center"><Twemoji emoji={PHAN_NHOM_ICONS[phanNhom] ?? "📁"} size={22} /></td>
                              <td className="px-4 py-2.5 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <button className="text-green-600 hover:text-green-800" title="Chỉnh sửa">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button className="text-red-500 hover:text-red-700" title="Xóa">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      : []),
                  ];
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <button className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30" disabled>{"<"}</button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700">1</button>
            <button className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30" disabled>{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

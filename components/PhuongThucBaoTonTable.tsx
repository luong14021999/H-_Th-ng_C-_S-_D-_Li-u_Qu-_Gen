"use client";

import { useState, useMemo } from "react";
import { PhuongThucBaoTon, danhMucStores } from "@/data/danhMucData";

function formatDate(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${hh}:${mm} ${dd}/${mo}/${d.getUTCFullYear()}`;
}

const IconFilter = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
);

export default function PhuongThucBaoTonTable() {
  const [items, setItems] = useState<PhuongThucBaoTon[]>(danhMucStores.phuongThuc);

  const setItemsSync = (updater: (prev: PhuongThucBaoTon[]) => PhuongThucBaoTon[]) => {
    setItems(prev => { const next = updater(prev); danhMucStores.phuongThuc = next; return next; });
  };
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "kich_hoat" | "an">("kich_hoat");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusOpenId, setStatusOpenId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<PhuongThucBaoTon | null>(null);
  const [editForm, setEditForm] = useState<{ ten: string; ma: string }>({ ten: "", ma: "" });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (statusFilter !== "all" && p.trang_thai !== statusFilter) return false;
      if (search.trim() && !p.ten.toLowerCase().includes(search.toLowerCase())) return false;
      if (fromDate && p.created_at.slice(0, 10) < fromDate) return false;
      if (toDate && p.created_at.slice(0, 10) > toDate) return false;
      return true;
    });
  }, [items, search, statusFilter, fromDate, toDate]);

  const toggleStatus = (id: string) => {
    setItemsSync(prev => prev.map(p => p.id === id ? { ...p, trang_thai: p.trang_thai === "kich_hoat" ? "an" : "kich_hoat" } : p));
    setStatusOpenId(null);
  };

  const openEdit = (p: PhuongThucBaoTon) => { setEditItem(p); setEditForm({ ten: p.ten, ma: p.ma }); };
  const saveEdit = () => {
    if (!editItem) return;
    setItemsSync(prev => prev.map(p => p.id === editItem.id ? { ...p, ten: editForm.ten, ma: editForm.ma } : p));
    setEditItem(null);
  };
  const resetEdit = () => { if (!editItem) return; setEditForm({ ten: editItem.ten, ma: editItem.ma }); };

  return (
    <div className="flex flex-1 overflow-hidden bg-gray-50" onClick={() => setStatusOpenId(null)}>
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
        <FilterSection title="Trạng thái">
          {(["all", "kich_hoat", "an"] as const).map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="status" checked={statusFilter === v} onChange={() => setStatusFilter(v)} className="accent-blue-600" />
              <span className="text-sm text-gray-700">{{ all: "Tất cả", kich_hoat: "Kích hoạt", an: "Ẩn" }[v]}</span>
            </label>
          ))}
        </FilterSection>
        <FilterSection title="Ngày tạo">
          <div className="flex items-center gap-1">
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              className="flex-1 min-w-0 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none" />
            <span className="text-gray-400 text-sm shrink-0">→</span>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
              className="flex-1 min-w-0 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none" />
          </div>
        </FilterSection>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex items-center gap-2 px-3 md:px-6 py-3 md:py-4 bg-white border-b border-gray-200">
          <button className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100 shrink-0" onClick={() => setMobileFilterOpen(true)}>
            <IconFilter />
          </button>
          <h1 className="text-base md:text-xl font-semibold text-gray-800 shrink-0">Phương thức bảo tồn</h1>
          <input type="text" placeholder="Tìm kiếm theo tên" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
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

        <div className="flex-1 overflow-auto px-3 md:px-6 py-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="w-10 px-3 py-3 text-center">#</th>
                  <th className="px-4 py-3 text-left">Tên phương thức <SortIcon /></th>
                  <th className="w-20 px-4 py-3 text-left hidden sm:table-cell">Mã <SortIcon /></th>
                  <th className="w-44 px-4 py-3 text-left whitespace-nowrap hidden md:table-cell">Ngày tạo <SortIcon /></th>
                  <th className="w-32 px-4 py-3 text-center">Trạng thái <SortIcon /></th>
                  <th className="w-20 px-4 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="px-3 py-3 text-center text-gray-600">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-800">
                      <div>{p.ten}</div>
                      <div className="text-xs text-gray-500 sm:hidden">Mã: {p.ma}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{p.ma}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap hidden md:table-cell">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setStatusOpenId(statusOpenId === p.id ? null : p.id)}
                          className={`inline-flex items-center gap-1 text-white text-xs font-medium px-3 py-1 rounded-full ${p.trang_thai === "kich_hoat" ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"}`}
                        >
                          {p.trang_thai === "kich_hoat" ? "Kích hoạt" : "Ẩn"}
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {statusOpenId === p.id && (
                          <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded shadow-lg z-50">
                            <button onClick={() => toggleStatus(p.id)} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              {p.trang_thai === "kich_hoat" ? "Ẩn" : "Kích hoạt"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-green-600 hover:text-green-800" onClick={(e) => { e.stopPropagation(); openEdit(p); }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-1 mt-4">
            <button disabled className="px-2 py-1 text-gray-400 disabled:opacity-30">{"<"}</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-white text-gray-700">1</button>
            <button disabled className="px-2 py-1 text-gray-400 disabled:opacity-30">{">"}</button>
            <span className="ml-2 text-xs text-gray-400">{filtered.length} kết quả</span>
          </div>
        </div>
      </div>

      {editItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditItem(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Sửa thông tin phương thức</h2>
              <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><span className="text-red-500 mr-1">*</span>Tên phương thức</label>
                  <input type="text" value={editForm.ten} onChange={(e) => setEditForm(f => ({ ...f, ten: e.target.value }))}
                    className="w-full border-b border-gray-300 focus:border-green-600 outline-none text-sm py-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã phương thức</label>
                  <input type="text" value={editForm.ma} onChange={(e) => setEditForm(f => ({ ...f, ma: e.target.value }))}
                    className="w-full border-b border-gray-300 focus:border-green-600 outline-none text-sm py-1" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={resetEdit} className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Làm mới (F9)
              </button>
              <button onClick={saveEdit} disabled={!editForm.ten.trim()} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                Lưu lại (F10)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function SortIcon() {
  return (
    <span className="inline-flex flex-col ml-1 opacity-60">
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5l7 7H5z" /></svg>
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 19l-7-7h14z" /></svg>
    </span>
  );
}

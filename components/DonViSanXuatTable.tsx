"use client";

import { useState, useMemo } from "react";
import { NguonGen } from "@/data/nguonGen";

interface Props { data: NguonGen[]; }

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${hh}:${mm} ${dd}/${mo}/${d.getUTCFullYear()}`;
}

const PAGE_SIZES = [20, 50, 100];

const IconFilter = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
);

export default function DonViSanXuatTable({ data }: Props) {
  const [search, setSearch] = useState("");
  const [dateMode, setDateMode] = useState<"all" | "custom">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const allRows = useMemo(() => {
    const map = new Map<string, string>();
    data.forEach((item) => {
      if (item.don_vi && !map.has(item.don_vi)) map.set(item.don_vi, item.created_at ?? "");
    });
    return Array.from(map.entries())
      .map(([ten, created_at]) => ({ ten, created_at }))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [data]);

  const filtered = useMemo(() => {
    let rows = allRows;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.ten.toLowerCase().includes(q));
    }
    if (dateMode === "custom" && (fromDate || toDate)) {
      rows = rows.filter((r) => {
        if (!r.created_at) return false;
        const d = r.created_at.slice(0, 10);
        if (fromDate && d < fromDate) return false;
        if (toDate && d > toDate) return false;
        return true;
      });
    }
    return rows;
  }, [allRows, search, dateMode, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const goPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  const visiblePages = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

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

        {/* Name filter */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Đơn vị sản xuất</span>
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên đơn vị"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Date filter */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Ngày tạo</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="dateMode" checked={dateMode === "all"} onChange={() => { setDateMode("all"); setPage(1); }} className="accent-blue-600" />
              <span className="text-sm text-gray-700">Toàn thời gian</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="dateMode" checked={dateMode === "custom"} onChange={() => setDateMode("custom")} className="accent-blue-600" />
              <span className="text-sm text-gray-700">Lựa chọn khác</span>
            </label>
            {dateMode === "custom" && (
              <div className="flex flex-col gap-1 mt-1 pl-5">
                <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none" />
                <span className="text-xs text-gray-400 text-center">đến</span>
                <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none" />
              </div>
            )}
          </div>
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
            Đơn vị sản xuất cung cấp gen giống
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
                  <th className="px-4 py-3 text-left font-medium">Tên</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Địa chỉ</th>
                  <th className="w-44 px-4 py-3 text-left font-medium whitespace-nowrap hidden sm:table-cell">Ngày tạo</th>
                  <th className="w-24 px-4 py-3 text-center font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">Không có dữ liệu</td></tr>
                ) : pageRows.map((row, idx) => (
                  <tr key={row.ten} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                    <td className="px-3 py-3 text-center text-gray-600">{(page - 1) * pageSize + idx + 1}</td>
                    <td className="px-4 py-3 text-gray-800">
                      <div>{row.ten}</div>
                      <div className="text-xs text-gray-500 sm:hidden">{formatDate(row.created_at)}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell"></td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{formatDate(row.created_at)}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center flex-wrap gap-1 mt-4">
            <button onClick={() => goPage(page - 1)} disabled={page === 1} className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">{"<"}</button>
            {visiblePages.map((p) => (
              <button key={p} onClick={() => goPage(p)}
                className={`px-3 py-1 rounded text-sm border ${p === page ? "bg-white border-gray-400 font-medium text-gray-800" : "border-transparent text-gray-600 hover:bg-white hover:border-gray-300"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => goPage(page + 1)} disabled={page === totalPages} className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">{">"}</button>
            <div className="ml-3">
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none">
                {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / trang</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

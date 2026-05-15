"use client";

import { useState, useMemo, useEffect } from "react";
import { CATEGORY_MAP, NguonGen } from "@/data/nguonGen";
import { ExtendedFormData, defaultForm1, defaultForm2, defaultForm3, defaultForm4 } from "@/data/extendedTypes";
import EditModal from "./EditModal";
import { exportNguonGenExcel, exportDanhSachExcel } from "@/lib/exportExcel";

interface DataTableProps {
  data: NguonGen[];
  extendedMap: Record<string, ExtendedFormData>;
  onEdit: (updated: NguonGen, ext: ExtendedFormData) => void;
  onDelete: (ma: string) => void;
  onAdd: (item: NguonGen, ext: ExtendedFormData) => Promise<void>;
  onOpenEdit?: (ma: string) => Promise<void>;
  onClose: () => void;
  activeCategory?: string;
}

type SortField = "ma" | "ten" | null;

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = d.getUTCFullYear();
  return `${hh}:${mm} ${dd}/${mo}/${yy}`;
}

function SortIcon({ field, active, dir }: { field: SortField; active: SortField; dir: "asc" | "desc" }) {
  return (
    <span className="ml-1 inline-flex flex-col gap-0">
      <svg className={`w-2.5 h-2.5 ${active === field && dir === "asc" ? "opacity-100" : "opacity-30"}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 5l7 7H5z" />
      </svg>
      <svg className={`w-2.5 h-2.5 ${active === field && dir === "desc" ? "opacity-100" : "opacity-30"}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 19l-7-7h14z" />
      </svg>
    </span>
  );
}

export default function DataTable({ data, extendedMap, onEdit, onDelete, onAdd, onOpenEdit, onClose: _onClose, activeCategory }: DataTableProps) {
  const [searchMa, setSearchMa] = useState("");
  const [searchTen, setSearchTen] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>(activeCategory ?? "all");
  const [filterPhanNhom, setFilterPhanNhom] = useState<string>("all");
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (activeCategory !== undefined) {
      setFilterCategory(activeCategory);
      setFilterPhanNhom("all");
      setPage(1);
    }
  }, [activeCategory]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<NguonGen | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<NguonGen | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<string | null>(null);
  const [loadingDownload, setLoadingDownload] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [exportingList, setExportingList] = useState(false);
  const pageSize = 20;

  const activeCat = filterCategory !== "all" ? CATEGORY_MAP[filterCategory] : null;

  const handleExportList = async () => {
    setExportingList(true);
    const label = activeCat ? activeCat.label : "Tất cả nguồn gen";
    const date = new Date().toLocaleDateString("vi-VN").replace(/\//g, "-");
    const fileName = `DanhSach_${activeCat ? activeCat.label : "NguonGen"}_${date}`;
    await exportDanhSachExcel(filtered, label, fileName);
    setExportingList(false);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const handleOpenEdit = async (item: NguonGen) => {
    setLoadingEdit(item.ma);
    await onOpenEdit?.(item.ma);
    setEditItem(item);
    setLoadingEdit(null);
  };

  const handleDownload = async (item: NguonGen) => {
    setLoadingDownload(item.ma);
    if (!extendedMap[item.ma]) await onOpenEdit?.(item.ma);
    const ext = extendedMap[item.ma] ?? { form1: {}, form2: {}, form3: {}, form4: {} };
    await exportNguonGenExcel(item, ext);
    setLoadingDownload(null);
  };

  const handleSave = (updated: NguonGen, ext: ExtendedFormData) => {
    onEdit(updated, ext);
    setEditItem(null);
  };

  const handleDelete = (item: NguonGen) => {
    onDelete(item.ma);
    setDeleteConfirm(null);
  };

  const availablePhanNhom = useMemo(() => {
    const base = filterCategory === "all" ? data : data.filter((i) => i.nhom === filterCategory);
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of base) {
      if (item.phan_nhom && !seen.has(item.phan_nhom)) {
        seen.add(item.phan_nhom);
        result.push(item.phan_nhom);
      }
    }
    return result.sort((a, b) => a.localeCompare(b));
  }, [data, filterCategory]);

  const blankItem = useMemo<NguonGen>(() => ({
    ma: "",
    ten: "",
    khoa_hoc: "",
    don_vi: "",
    phan_nhom: filterCategory !== "all" ? (availablePhanNhom[0] ?? "") : "",
    nhom: filterCategory !== "all" ? filterCategory : "",
    lat: 19.8,
    lng: 105.8,
  }), [filterCategory, availablePhanNhom]);

  const filtered = useMemo(() => {
    let list = data.filter((item) => {
      const matchCat = filterCategory === "all" || item.nhom === filterCategory;
      const matchPhan = filterPhanNhom === "all" || item.phan_nhom === filterPhanNhom;
      const matchMa = !searchMa || item.ma.toLowerCase().includes(searchMa.toLowerCase());
      const matchTen =
        !searchTen ||
        item.ten.toLowerCase().includes(searchTen.toLowerCase()) ||
        item.khoa_hoc.toLowerCase().includes(searchTen.toLowerCase());
      return matchCat && matchPhan && matchMa && matchTen;
    });
    if (sortField === "ma") {
      list = [...list].sort((a, b) => sortDir === "asc" ? a.ma.localeCompare(b.ma) : b.ma.localeCompare(a.ma));
    } else if (sortField === "ten") {
      list = [...list].sort((a, b) => sortDir === "asc" ? a.ten.localeCompare(b.ten) : b.ten.localeCompare(a.ten));
    }
    return list;
  }, [data, searchMa, searchTen, filterCategory, filterPhanNhom, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Reusable filter panel content (used in both sidebar and mobile drawer)
  const filterPanelContent = (
    <div className="flex-1 px-4 py-4 flex flex-col gap-5 overflow-y-auto">
      {/* Mã nguồn gen */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Mã nguồn gen
        </label>
        <input
          type="text"
          value={searchMa}
          onChange={(e) => { setSearchMa(e.target.value); setPage(1); }}
          placeholder="Tìm kiếm theo mã..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
        />
      </div>

      {/* Tên nguồn gen */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Tên nguồn gen
        </label>
        <input
          type="text"
          value={searchTen}
          onChange={(e) => { setSearchTen(e.target.value); setPage(1); }}
          placeholder="Tìm kiếm theo tên..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
        />
      </div>

      {/* Nhóm nguồn gen accordion */}
      <div>
        <button
          onClick={() => setCategoryOpen((v) => !v)}
          className="flex items-center justify-between w-full text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5"
        >
          <span>Nhóm nguồn gen</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {categoryOpen && (
          <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
            <button
              onClick={() => { setFilterPhanNhom("all"); setPage(1); setFilterDrawerOpen(false); }}
              className={`w-full text-left px-3 py-3 text-sm transition-colors ${
                filterPhanNhom === "all" ? "bg-slate-700 text-white" : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              Tất cả
            </button>
            {availablePhanNhom.map((pn) => (
              <button
                key={pn}
                onClick={() => { setFilterPhanNhom(pn); setPage(1); setFilterDrawerOpen(false); }}
                className={`w-full text-left px-3 py-3 text-sm transition-colors ${
                  filterPhanNhom === pn ? "bg-slate-700 text-white" : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                {pn}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ngày nhập liệu */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Ngày nhập liệu
        </label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600"
          />
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <input
            type="date"
            className="flex-1 min-w-0 border border-gray-300 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-600"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex h-full bg-white overflow-hidden">
        {/* ── Left filter sidebar (desktop only) ── */}
        <div className="max-md:hidden md:flex md:w-64 lg:w-72 shrink-0 border-r border-gray-200 flex-col overflow-hidden bg-white">
          <div className="px-4 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeCat ? activeCat.icon : "🗂️"}</span>
              <h2 className="text-base font-bold text-gray-800">
                {activeCat ? activeCat.label : "Tất cả"}
              </h2>
            </div>
          </div>
          {filterPanelContent}
        </div>

        {/* ── Right main content ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top action bar */}
          <div className="px-3 sm:px-5 py-3 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className="md:hidden flex items-center gap-1.5 border border-gray-300 text-gray-600 text-xs font-medium px-3 py-2 rounded-lg transition-colors hover:bg-gray-50 shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                <span>Lọc</span>
                {(searchMa || searchTen || filterPhanNhom !== "all") && (
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </button>
              {activeCat && <span className="text-lg shrink-0 hidden sm:inline">{activeCat.icon}</span>}
              <h2 className="text-sm font-bold text-gray-800 truncate">
                {activeCat ? activeCat.label : "Tất cả nguồn gen"}
              </h2>
              <span className="text-xs text-gray-400 shrink-0">({filtered.length})</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleExportList}
                disabled={exportingList || filtered.length === 0}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-medium px-2.5 py-2 rounded-lg transition-colors"
                title={`Xuất ${filtered.length} bản ghi ra Excel`}
              >
                {exportingList ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                <span className="hidden sm:inline">{exportingList ? "Đang xuất..." : "Xuất Excel"}</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-2.5 py-2 rounded-lg transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Thêm mới</span>
              </button>
            </div>
          </div>

          {/* ── Desktop Table ── */}
          <div className="max-md:hidden md:flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10" style={{ backgroundColor: "#2d4a5e" }}>
                  <tr>
                    <th className="text-left px-3 py-3 font-semibold text-white text-xs w-10">#</th>
                    <th
                      className="text-left px-3 py-3 font-semibold text-white text-xs cursor-pointer select-none whitespace-nowrap"
                      onClick={() => handleSort("ma")}
                    >
                      <span className="flex items-center">
                        Mã nguồn gen
                        <SortIcon field="ma" active={sortField} dir={sortDir} />
                      </span>
                    </th>
                    <th
                      className="text-left px-3 py-3 font-semibold text-white text-xs cursor-pointer select-none"
                      onClick={() => handleSort("ten")}
                    >
                      <span className="flex items-center">
                        Tên
                        <SortIcon field="ten" active={sortField} dir={sortDir} />
                      </span>
                    </th>
                    <th className="text-left px-3 py-3 font-semibold text-white text-xs hidden lg:table-cell whitespace-nowrap">
                      ĐVCC sản xuất
                    </th>
                    <th className="text-left px-3 py-3 font-semibold text-white text-xs hidden xl:table-cell whitespace-nowrap">
                      Nhóm nguồn gen
                    </th>
                    <th className="text-left px-3 py-3 font-semibold text-white text-xs hidden lg:table-cell whitespace-nowrap">
                      Ngày nhập liệu
                    </th>
                    <th className="text-center px-3 py-3 font-semibold text-white text-xs w-24">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((item, idx) => {
                    const cat = CATEGORY_MAP[item.nhom];
                    const rowNum = (page - 1) * pageSize + idx + 1;
                    return (
                      <tr key={item.ma} className="border-b border-gray-100 hover:bg-green-50/60 transition-colors">
                        <td className="px-3 py-2.5 text-gray-400 text-xs">{rowNum}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-gray-700 font-medium whitespace-nowrap">
                          {item.ma}
                        </td>
                        <td className="px-3 py-2.5">
                          <p className="text-sm text-gray-800 leading-snug">
                            <span className="text-gray-400 text-xs">Việt Nam: </span>
                            <span className="font-semibold">{item.ten}</span>
                          </p>
                          {item.khoa_hoc && (
                            <p className="text-xs text-gray-500 leading-snug mt-0.5">
                              <span className="text-gray-400">Khoa học: </span>
                              <span className="italic">{item.khoa_hoc}</span>
                            </p>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-sm text-gray-600 hidden lg:table-cell">
                          {item.don_vi || "—"}
                        </td>
                        <td className="px-3 py-2.5 hidden xl:table-cell">
                          <p className="text-sm text-gray-800">{item.phan_nhom || "—"}</p>
                          {cat && <p className="text-xs text-gray-400 mt-0.5">{cat.icon} {cat.label}</p>}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-500 hidden lg:table-cell whitespace-nowrap">{formatDate(item.created_at)}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              disabled={loadingEdit === item.ma}
                              className="p-2 text-green-700 hover:bg-green-100 rounded transition-colors disabled:opacity-40"
                              title="Chỉnh sửa"
                            >
                              {loadingEdit === item.ma ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(item)}
                              className="p-2 text-red-500 hover:bg-red-100 rounded transition-colors"
                              title="Xóa"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDownload(item)}
                              disabled={loadingDownload === item.ma}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors disabled:opacity-40"
                              title="Tải xuống Excel"
                            >
                              {loadingDownload === item.ma ? (
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">Không tìm thấy kết quả</p>
                </div>
              )}
            </div>

            {/* Desktop Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 shrink-0 bg-gray-50">
                <p className="text-xs text-gray-500">
                  Trang {page} / {totalPages} — {filtered.length} bản ghi
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
                  >
                    ← Trước
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1.5 text-xs border rounded-lg transition-colors ${
                          p === page ? "bg-green-700 text-white border-green-700" : "border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Mobile Card List ── */}
          <div className="md:hidden flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">Không tìm thấy kết quả</p>
                </div>
              ) : (
                paginated.map((item, idx) => {
                  const rowNum = (page - 1) * pageSize + idx + 1;
                  const cat = CATEGORY_MAP[item.nhom];
                  return (
                    <div key={item.ma} className="px-4 py-3 hover:bg-green-50/50 transition-colors">
                      <div className="flex items-start gap-3">
                        {/* Number badge */}
                        <span className="text-xs text-gray-400 mt-0.5 w-5 shrink-0">{rowNum}</span>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-xs text-gray-500 mb-0.5">{item.ma}</p>
                          <p className="font-semibold text-sm text-gray-800 leading-snug">{item.ten}</p>
                          {item.khoa_hoc && (
                            <p className="text-xs text-gray-500 italic mt-0.5">{item.khoa_hoc}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {item.phan_nhom && (
                              <span className="text-xs text-gray-700">{item.phan_nhom}</span>
                            )}
                            {cat && (
                              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                <span>{cat.icon}</span>
                                <span>{cat.label}</span>
                              </span>
                            )}
                            {item.don_vi && (
                              <span className="text-xs text-gray-400">· {item.don_vi}</span>
                            )}
                            <span className="text-xs text-gray-400">{formatDate(item.created_at)}</span>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            disabled={loadingEdit === item.ma}
                            className="p-2.5 text-green-700 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-40"
                            title="Chỉnh sửa"
                          >
                            {loadingEdit === item.ma ? (
                              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item)}
                            className="p-2.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 shrink-0 bg-gray-50">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  ← Trước
                </button>
                <p className="text-xs text-gray-500">{page} / {totalPages}</p>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  Sau →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {filterDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-[2500] flex">
          <div className="w-4/5 max-w-xs bg-white shadow-2xl flex flex-col h-full">
            <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeCat ? activeCat.icon : "🗂️"}</span>
                <h2 className="text-base font-bold text-gray-800">
                  {activeCat ? activeCat.label : "Bộ lọc"}
                </h2>
              </div>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {filterPanelContent}
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setFilterDrawerOpen(false)} />
        </div>
      )}

      {/* Add modal */}
      {showAddModal && (
        <EditModal
          item={blankItem}
          extended={{ form1: defaultForm1(), form2: defaultForm2(), form3: defaultForm3(), form4: defaultForm4() }}
          isNew
          onSave={async (newItem, ext) => {
            await onAdd(newItem, ext);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit modal */}
      {editItem && (
        <EditModal
          item={editItem}
          extended={extendedMap[editItem.ma] ?? { form1: {}, form2: {}, form3: {}, form4: {} }}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Xác nhận xóa</p>
                <p className="text-xs text-gray-500 mt-0.5">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-5">
              Bạn có chắc muốn xóa{" "}
              <span className="font-semibold">{deleteConfirm.ten}</span>{" "}
              <span className="text-gray-400 font-mono text-xs">({deleteConfirm.ma})</span>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 text-sm py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 rounded-lg transition-colors font-medium"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useMemo } from "react";
import { CATEGORIES, CATEGORY_MAP, NguonGen } from "@/data/nguonGen";
import EditModal from "./EditModal";

interface DataTableProps {
  data: NguonGen[];
  onEdit: (updated: NguonGen) => void;
  onDelete: (ma: string) => void;
  onClose: () => void;
}

export default function DataTable({ data, onEdit, onDelete, onClose }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [editItem, setEditItem] = useState<NguonGen | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<NguonGen | null>(null);
  const pageSize = 20;

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchCat = filterCategory === "all" || item.nhom === filterCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.ma.toLowerCase().includes(q) ||
        item.ten.toLowerCase().includes(q) ||
        item.khoa_hoc.toLowerCase().includes(q) ||
        item.don_vi.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [data, search, filterCategory]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
    setPage(1);
  };

  const handleSave = (updated: NguonGen) => {
    onEdit(updated);
    setEditItem(null);
  };

  const handleDelete = (item: NguonGen) => {
    onDelete(item.ma);
    setDeleteConfirm(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-[2000] flex flex-col bg-white">
        {/* Header */}
        <div className="bg-teal-800 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-base">Quản lý nguồn gen</h2>
            <p className="text-teal-200 text-xs">{filtered.length} / {data.length} bản ghi</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Đóng
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 px-4 py-3 border-b border-gray-200 shrink-0 bg-gray-50">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm tên, mã, khoa học, đơn vị..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <select
            value={filterCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="all">Tất cả nhóm</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-gray-600 border-b border-gray-200 w-8">#</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600 border-b border-gray-200 w-20">Mã</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600 border-b border-gray-200">Tên giống</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600 border-b border-gray-200 hidden md:table-cell">Tên khoa học</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600 border-b border-gray-200 hidden lg:table-cell">Đơn vị lưu giữ</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600 border-b border-gray-200 w-28">Nhóm</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-600 border-b border-gray-200 w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item: NguonGen, idx: number) => {
                const cat = CATEGORY_MAP[item.nhom];
                return (
                  <tr key={item.ma} className="border-b border-gray-100 hover:bg-teal-50 transition-colors">
                    <td className="px-3 py-2 text-gray-400 text-xs">{(page - 1) * pageSize + idx + 1}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-600">{item.ma}</td>
                    <td className="px-3 py-2 font-medium text-gray-800">{item.ten}</td>
                    <td className="px-3 py-2 text-gray-500 italic hidden md:table-cell">{item.khoa_hoc || "—"}</td>
                    <td className="px-3 py-2 text-gray-500 hidden lg:table-cell">{item.don_vi}</td>
                    <td className="px-3 py-2">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-medium"
                        style={{ backgroundColor: cat?.color ?? "#6b7280" }}
                      >
                        {cat?.icon} {cat?.label ?? item.nhom}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditItem(item)}
                          className="p-1.5 text-teal-600 hover:bg-teal-100 rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(item)}
                          className="p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors"
                          title="Xóa"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 shrink-0 bg-gray-50">
            <p className="text-xs text-gray-500">Trang {page} / {totalPages}</p>
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
                      p === page ? "bg-teal-700 text-white border-teal-700" : "border-gray-300 hover:bg-gray-100"
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

      {/* Edit modal */}
      {editItem && (
        <EditModal
          item={editItem}
          onSave={handleSave}
          onClose={() => setEditItem(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
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
              Bạn có chắc muốn xóa <span className="font-semibold">{deleteConfirm.ten}</span>{" "}
              <span className="text-gray-400 font-mono text-xs">({deleteConfirm.ma})</span>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition-colors font-medium"
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

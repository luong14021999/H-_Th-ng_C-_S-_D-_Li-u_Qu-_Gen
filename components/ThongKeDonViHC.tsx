"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { NguonGen, CATEGORIES, PHAN_NHOM_BY_NHOM } from "@/data/nguonGen";
import { DISTRICTS_THANH_HOA, WARDS_BY_DISTRICT } from "@/data/thanhHoaAdmin";

interface HCRow {
  district: string;
  count: number;
}

interface Props {
  data: NguonGen[];
}

const PAGE_SIZES = [10, 20, 50];

// Find which Thanh Hóa district the don_vi belongs to by substring match
function extractDistrict(donVi: string): string {
  const dv = (donVi ?? "").toLowerCase();
  for (const d of DISTRICTS_THANH_HOA) {
    if (dv.includes(d.toLowerCase())) return d;
  }
  return "";
}

// ── Bar chart ────────────────────────────────────────────────────────────────
function BarChart({ rows }: { rows: HCRow[] }) {
  const top10 = rows.slice(0, 10);
  const maxCount = Math.max(...top10.map((r) => r.count), 1);
  const tickCount = 5;
  const step = Math.max(1, Math.ceil(maxCount / tickCount));
  const axisMax = step * tickCount;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i * step);

  return (
    <div className="bg-white rounded shadow-sm p-4 sm:p-8 flex flex-col gap-4">
      <h3 className="text-center font-semibold text-gray-700 text-sm sm:text-base">
        Top 10 quận/huyện theo số lượng nguồn gen
      </h3>

      {top10.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Không có dữ liệu</p>
      ) : (
        <>
          <div className="flex gap-0 min-w-0">
            {/* Y-axis labels */}
            <div className="shrink-0 flex flex-col pr-2" style={{ width: 140 }}>
              {top10.map((row, i) => (
                <div
                  key={row.district || `b${i}`}
                  className="flex items-center justify-end text-xs text-gray-600 text-right leading-tight"
                  style={{ height: 32, marginBottom: i < top10.length - 1 ? 8 : 0 }}
                >
                  <span className="line-clamp-2">{row.district || "(Chưa xác định)"}</span>
                </div>
              ))}
            </div>

            {/* Bars + grid */}
            <div className="flex-1 relative min-w-0">
              <div className="absolute inset-0 flex pointer-events-none">
                {ticks.map((t) => (
                  <div
                    key={t}
                    className="absolute top-0 bottom-0 border-l border-gray-200"
                    style={{ left: `${(t / axisMax) * 100}%` }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {top10.map((row, i) => (
                  <div key={row.district || `br${i}`} className="flex items-center gap-2" style={{ height: 32 }}>
                    <div
                      className="h-6 rounded-sm transition-all duration-500"
                      style={{
                        width: `${(row.count / axisMax) * 100}%`,
                        backgroundColor: "#4a90c4",
                        minWidth: row.count > 0 ? 2 : 0,
                      }}
                    />
                    <span className="text-xs font-medium text-gray-600 shrink-0">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* X-axis */}
          <div className="flex" style={{ paddingLeft: 140 }}>
            <div className="flex-1 relative h-5">
              {ticks.map((t) => (
                <span
                  key={t}
                  className="absolute text-xs text-gray-500 -translate-x-1/2"
                  style={{ left: `${(t / axisMax) * 100}%` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: "#4a90c4" }} />
            <span className="text-xs text-gray-600">Số lượng nguồn gen</span>
          </div>
        </>
      )}
    </div>
  );
}

// ── Collapsible sidebar section ───────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        {title}
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

// ── Searchable dropdown ───────────────────────────────────────────────────────
function SearchableDropdown({ placeholder, options, value, onChange }: {
  placeholder: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value ?? ""); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value ?? "");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [value]);

  const filtered = query ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase())) : options;

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center border-b border-gray-300 focus-within:border-green-500">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { setQuery(""); setOpen(true); }}
          placeholder={placeholder}
          className="flex-1 outline-none py-1 px-0 text-base bg-transparent text-gray-700 placeholder:text-gray-400"
        />
        {value ? (
          <button onMouseDown={(e) => { e.preventDefault(); onChange(""); setQuery(""); }} className="text-gray-400 hover:text-gray-600 p-0.5 shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <svg className="w-4 h-4 text-gray-400 shrink-0 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded shadow-lg mt-0.5 max-h-48 overflow-y-auto">
          {filtered.map((opt, i) => (
            <div
              key={`${opt}-${i}`}
              onMouseDown={(e) => { e.preventDefault(); onChange(opt); setQuery(opt); setOpen(false); }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-green-50 ${opt === value ? "bg-green-100 text-green-800" : "text-gray-700"}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Nhóm nguồn gen tree dropdown ─────────────────────────────────────────────
function NhomTreeDropdown({ nhomId, phanNhom, onSelect }: {
  nhomId: string; phanNhom: string;
  onSelect: (nhomId: string, phanNhom: string) => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, true]))
  );
  const [dropOpen, setDropOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const label = phanNhom || (nhomId ? CATEGORIES.find((c) => c.id === nhomId)?.label : "");

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setDropOpen((v) => !v)}
        className="flex items-center border-b border-gray-300 cursor-pointer hover:border-green-500 transition-colors py-1"
      >
        <span className={`flex-1 text-sm ${label ? "text-gray-700" : "text-gray-400"}`}>
          {label || "Tìm kiếm theo nhóm nguồn gen"}
        </span>
        {(nhomId || phanNhom) ? (
          <button
            onMouseDown={(e) => { e.stopPropagation(); onSelect("", ""); }}
            className="text-gray-400 hover:text-gray-600 p-0.5 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <svg className="w-4 h-4 text-gray-400 shrink-0 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      {dropOpen && (
        <div className="absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded shadow-lg mt-1 max-h-72 overflow-y-auto">
          {CATEGORIES.map((cat) => {
            const items = PHAN_NHOM_BY_NHOM[cat.id] ?? [];
            const isOpen = openGroups[cat.id];
            return (
              <div key={cat.id}>
                <div
                  onClick={() => setOpenGroups((p) => ({ ...p, [cat.id]: !p[cat.id] }))}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-800 cursor-pointer hover:bg-gray-50 select-none"
                >
                  <span className="text-gray-400 text-[10px] w-3">{isOpen ? "▼" : "▶"}</span>
                  {cat.label}
                </div>
                {isOpen && items.map((pn) => (
                  <div
                    key={pn}
                    onMouseDown={() => { onSelect(cat.id, pn); setDropOpen(false); }}
                    className={`pl-8 pr-3 py-2.5 text-sm cursor-pointer ${phanNhom === pn ? "bg-[#2d5fa3] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    {pn}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Sidebar content ───────────────────────────────────────────────────────────
function SidebarContent({
  filterDistrict, filterWard, filterNhomId, filterPhanNhom,
  setFilterDistrict, setFilterWard, setFilterNhomId, setFilterPhanNhom,
  setPage, reportType, setReportType, districtOptions,
}: {
  filterDistrict: string; filterWard: string; filterNhomId: string; filterPhanNhom: string;
  setFilterDistrict: (v: string) => void; setFilterWard: (v: string) => void;
  setFilterNhomId: (v: string) => void; setFilterPhanNhom: (v: string) => void;
  setPage: (p: number) => void; reportType: "list" | "chart";
  setReportType: (v: "list" | "chart") => void; districtOptions: string[];
}) {
  const wardOptions = filterDistrict
    ? (WARDS_BY_DISTRICT[filterDistrict] ?? [])
    : Object.values(WARDS_BY_DISTRICT).flat();

  return (
    <>
      <FilterSection title="Loại báo cáo">
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="radio" name="hc-report-type" value="chart" checked={reportType === "chart"} onChange={() => setReportType("chart")} className="accent-green-600" />
            <span className="text-sm text-gray-700">Biểu đồ top 10</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="radio" name="hc-report-type" value="list" checked={reportType === "list"} onChange={() => setReportType("list")} className="accent-green-600" />
            <span className="text-sm text-gray-700">Bảng danh sách</span>
          </label>
        </div>
      </FilterSection>

      <FilterSection title="Tỉnh/tp">
        <input type="text" defaultValue="Thanh Hóa" readOnly className="w-full border-b border-gray-300 py-1 text-sm text-gray-700 bg-transparent outline-none" />
      </FilterSection>

      <FilterSection title="Quận/huyện">
        <SearchableDropdown
          placeholder="Tìm kiếm Quận/huyện"
          options={districtOptions}
          value={filterDistrict}
          onChange={(v) => { setFilterDistrict(v); setFilterWard(""); setPage(1); }}
        />
      </FilterSection>

      <FilterSection title="Xã/Phường">
        <SearchableDropdown
          placeholder="Tìm kiếm Xã/Phường"
          options={wardOptions}
          value={filterWard}
          onChange={(v) => { setFilterWard(v); setPage(1); }}
        />
      </FilterSection>

      <FilterSection title="Nhóm nguồn gen">
        <NhomTreeDropdown
          nhomId={filterNhomId}
          phanNhom={filterPhanNhom}
          onSelect={(nid, pn) => { setFilterNhomId(nid); setFilterPhanNhom(pn); setPage(1); }}
        />
      </FilterSection>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ThongKeDonViHC({ data }: Props) {
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [exporting, setExporting] = useState(false);
  const [reportType, setReportType] = useState<"list" | "chart">("list");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterWard, setFilterWard] = useState("");
  const [filterNhomId, setFilterNhomId] = useState("");
  const [filterPhanNhom, setFilterPhanNhom] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Step 1: filter individual records by nhom/phan_nhom and ward
  const filteredRecords = useMemo(() => {
    return data.filter((item) => {
      if (filterPhanNhom && item.phan_nhom !== filterPhanNhom) return false;
      if (filterNhomId && !filterPhanNhom && item.nhom !== filterNhomId) return false;
      if (filterWard && !(item.don_vi ?? "").toLowerCase().includes(filterWard.toLowerCase())) return false;
      return true;
    });
  }, [data, filterNhomId, filterPhanNhom, filterWard]);

  // Step 2: group by district
  const allRows = useMemo<HCRow[]>(() => {
    const map = new Map<string, number>();
    for (const item of filteredRecords) {
      const d = extractDistrict(item.don_vi ?? "");
      map.set(d, (map.get(d) ?? 0) + 1);
    }
    return Array.from(map.entries()).map(([district, count]) => ({ district, count }));
  }, [filteredRecords]);

  const districtOptions = DISTRICTS_THANH_HOA;

  // Step 3: filter rows by district, then sort
  const rows = useMemo<HCRow[]>(() => {
    let result = filterDistrict
      ? allRows.filter((r) => r.district === filterDistrict)
      : allRows;
    return [...result].sort((a, b) => sortAsc ? a.count - b.count : b.count - a.count);
  }, [allRows, filterDistrict, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);

  const pageNums = useMemo(() => {
    const half = 2;
    const start = Math.max(1, Math.min(page - half, totalPages - half * 2));
    const end = Math.min(totalPages, start + half * 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  const changePage = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

  const handleExport = async () => {
    setExporting(true);
    try {
      const { exportThongKeExcel } = await import("@/lib/exportExcel");
      await exportThongKeExcel(rows.map((r) => ({ ten: r.district || "(Chưa xác định)", dia_chi: "", count: r.count })));
    } finally {
      setExporting(false);
    }
  };

  const activeFilterCount = [filterDistrict, filterWard, filterNhomId || filterPhanNhom].filter(Boolean).length;

  const sidebarProps = {
    filterDistrict, filterWard, filterNhomId, filterPhanNhom,
    setFilterDistrict, setFilterWard, setFilterNhomId, setFilterPhanNhom,
    setPage, reportType, setReportType, districtOptions,
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-72 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
        <SidebarContent {...sidebarProps} />
      </div>

      {/* Mobile bottom sheet */}
      {mounted && mobileSidebarOpen && createPortal(
        <>
          <div className="fixed inset-0 bg-black/40 z-[9998] md:hidden" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-2xl overflow-hidden md:hidden" style={{ maxHeight: "80vh" }}>
            <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-300 rounded-full" /></div>
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <p className="font-semibold text-sm text-gray-700">Bộ lọc</p>
              <button onClick={() => setMobileSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(80vh - 80px)" }}>
              <SidebarContent {...sidebarProps} />
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-white border-b border-gray-200 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden flex items-center gap-1.5 border border-gray-300 text-gray-600 text-xs px-2.5 py-1.5 rounded-lg shrink-0 relative"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Lọc
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-600 text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            <h2 className="font-bold text-sm sm:text-lg text-gray-800 truncate">Nguồn gen theo đơn vị hành chính</h2>
            <div className="hidden sm:flex w-5 h-5 rounded-full bg-green-600 text-white items-center justify-center text-xs font-bold cursor-help shrink-0" title="Thống kê số lượng nguồn gen theo quận/huyện">?</div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm px-2.5 sm:px-4 py-2 rounded transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Xuất file excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-xs sm:text-sm px-2.5 sm:px-4 py-2 rounded transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden sm:inline">In file excel</span>
            </button>
          </div>
        </div>

        {/* Chart or Table */}
        <div className="flex-1 overflow-auto p-2 sm:p-4">
          {reportType === "chart" ? (
            <BarChart rows={rows} />
          ) : (
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ backgroundColor: "#5b8fa8" }} className="text-white">
                    <th className="px-3 sm:px-4 py-3 text-center font-semibold w-10 sm:w-12">#</th>
                    <th className="px-3 sm:px-4 py-3 text-left font-semibold">Quận/huyện</th>
                    <th
                      className="px-3 sm:px-4 py-3 text-right font-semibold cursor-pointer select-none whitespace-nowrap"
                      onClick={() => { setSortAsc((v) => !v); setPage(1); }}
                    >
                      <span className="hidden sm:inline">Số lượng nguồn gen </span>
                      <span className="sm:hidden">SL </span>
                      <span className="opacity-80">{sortAsc ? "↑" : "↓"}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((row, idx) => (
                    <tr key={row.district || `__blank_${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-3 sm:px-4 py-2.5 text-center text-gray-500 border-b border-gray-100 text-xs sm:text-sm">{(page - 1) * pageSize + idx + 1}</td>
                      <td className="px-3 sm:px-4 py-2.5 text-gray-800 border-b border-gray-100 text-xs sm:text-sm">{row.district || "(Chưa xác định)"}</td>
                      <td className="px-3 sm:px-4 py-2.5 text-right text-gray-800 border-b border-gray-100 font-medium text-xs sm:text-sm">{row.count}</td>
                    </tr>
                  ))}
                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center text-gray-400">Không có dữ liệu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className={`shrink-0 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-2.5 bg-white border-t border-gray-200 ${reportType === "chart" ? "hidden" : ""}`}>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="border border-gray-300 rounded px-1.5 py-0.5 text-xs sm:text-sm focus:outline-none focus:border-green-500"
            >
              {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span>/trang · <span className="hidden sm:inline">Tổng </span>{rows.length} quận/huyện</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button onClick={() => changePage(page - 1)} disabled={page === 1} className="px-2 py-1 text-xs sm:text-sm rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">‹</button>
            {pageNums[0] > 1 && (
              <>
                <button onClick={() => changePage(1)} className="px-2 py-1 text-xs sm:text-sm rounded border border-gray-200 hover:bg-gray-50">1</button>
                {pageNums[0] > 2 && <span className="px-0.5 text-gray-400 text-xs">…</span>}
              </>
            )}
            {pageNums.map((p) => (
              <button
                key={p}
                onClick={() => changePage(p)}
                className={`px-2 py-1 text-xs sm:text-sm rounded border transition-colors ${p === page ? "bg-green-700 text-white border-green-700" : "border-gray-200 hover:bg-gray-50"}`}
              >
                {p}
              </button>
            ))}
            {pageNums[pageNums.length - 1] < totalPages && (
              <>
                {pageNums[pageNums.length - 1] < totalPages - 1 && <span className="px-0.5 text-gray-400 text-xs">…</span>}
                <button onClick={() => changePage(totalPages)} className="px-2 py-1 text-xs sm:text-sm rounded border border-gray-200 hover:bg-gray-50">{totalPages}</button>
              </>
            )}
            <button onClick={() => changePage(page + 1)} disabled={page === totalPages} className="px-2 py-1 text-xs sm:text-sm rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

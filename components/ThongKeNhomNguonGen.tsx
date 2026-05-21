"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { NguonGen, CATEGORIES, PHAN_NHOM_BY_NHOM } from "@/data/nguonGen";
import { DISTRICTS_THANH_HOA, WARDS_BY_DISTRICT } from "@/data/thanhHoaAdmin";
import { normalizeVi } from "@/lib/text";

interface NhomRow {
  nhomId: string;
  nhomLabel: string;
  nhomIcon: string;
  count: number;
  phanNhoms: { label: string; count: number }[];
}

interface Props {
  data: NguonGen[];
}

function BarChart({ rows }: { rows: NhomRow[] }) {
  const maxCount = Math.max(...rows.map((r) => r.count), 1);
  const tickCount = 5;
  const step = Math.max(1, Math.ceil(maxCount / tickCount));
  const axisMax = step * tickCount;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i * step);

  return (
    <div className="bg-white rounded shadow-sm p-4 sm:p-8 flex flex-col gap-4">
      <h3 className="text-center font-semibold text-gray-700 text-sm sm:text-base">
        Nguồn gen theo nhóm nguồn gen
      </h3>
      {rows.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Không có dữ liệu</p>
      ) : (
        <>
          <div className="flex gap-0 min-w-0">
            <div className="shrink-0 flex flex-col pr-2" style={{ width: 140 }}>
              {rows.map((row, i) => (
                <div
                  key={row.nhomId}
                  className="flex items-center justify-end text-xs text-gray-600 text-right leading-tight"
                  style={{ height: 32, marginBottom: i < rows.length - 1 ? 8 : 0 }}
                >
                  {row.nhomIcon} {row.nhomLabel}
                </div>
              ))}
            </div>
            <div className="flex-1 relative min-w-0">
              <div className="absolute inset-0 pointer-events-none">
                {ticks.map((t) => (
                  <div
                    key={t}
                    className="absolute top-0 bottom-0 border-l border-gray-200"
                    style={{ left: `${(t / axisMax) * 100}%` }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {rows.map((row) => (
                  <div key={row.nhomId} className="flex items-center gap-2" style={{ height: 32 }}>
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
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "" : "rotate-180"}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

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

  const filtered = query
    ? (() => { const q = normalizeVi(query); return options.filter((o) => normalizeVi(o).includes(q)); })()
    : options;

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
          <button
            onMouseDown={(e) => { e.preventDefault(); onChange(""); setQuery(""); }}
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

function SidebarContent({
  filterDistrict, filterWard, filterDonVi,
  setFilterDistrict, setFilterWard, setFilterDonVi,
  donViOptions, reportType, setReportType,
}: {
  filterDistrict: string; filterWard: string; filterDonVi: string;
  setFilterDistrict: (v: string) => void; setFilterWard: (v: string) => void;
  setFilterDonVi: (v: string) => void;
  donViOptions: string[];
  reportType: string; setReportType: (v: "list" | "chart") => void;
}) {
  return (
    <>
      <FilterSection title="Loại báo cáo">
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="radio" name="report-type-tk" value="chart" checked={reportType === "chart"} onChange={() => setReportType("chart")} className="accent-green-600" />
            <span className="text-sm text-gray-700">Biểu đồ</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="radio" name="report-type-tk" value="list" checked={reportType === "list"} onChange={() => setReportType("list")} className="accent-green-600" />
            <span className="text-sm text-gray-700">Bảng danh sách</span>
          </label>
        </div>
      </FilterSection>

      <FilterSection title="Tỉnh/tp">
        <input type="text" defaultValue="Thanh Hóa" readOnly className="w-full border-b border-gray-300 py-1 text-sm text-gray-700 bg-transparent outline-none" />
      </FilterSection>

      <FilterSection title="Quận/huyện">
        <SearchableDropdown
          placeholder="Tìm kiếm theo Quận/huyện"
          options={DISTRICTS_THANH_HOA}
          value={filterDistrict}
          onChange={(v) => { setFilterDistrict(v); setFilterWard(""); }}
        />
      </FilterSection>

      <FilterSection title="Xã/Phường">
        <SearchableDropdown
          placeholder="Tìm kiếm theo Xã/Phường"
          options={filterDistrict ? (WARDS_BY_DISTRICT[filterDistrict] ?? []) : Object.values(WARDS_BY_DISTRICT).flat()}
          value={filterWard}
          onChange={setFilterWard}
        />
      </FilterSection>

      <FilterSection title="Đơn vị cung cấp">
        <SearchableDropdown
          placeholder="Chọn đơn vị cung cấp sản xuất"
          options={donViOptions}
          value={filterDonVi}
          onChange={setFilterDonVi}
        />
      </FilterSection>
    </>
  );
}

export default function ThongKeTable({ data }: Props) {
  const [sortAsc, setSortAsc] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [reportType, setReportType] = useState<"list" | "chart">("list");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterWard, setFilterWard] = useState("");
  const [filterDonVi, setFilterDonVi] = useState("");
  const [expandedNhoms, setExpandedNhoms] = useState<Set<string>>(new Set());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const donViOptions = useMemo(() => {
    const set = new Set<string>();
    for (const item of data) if (item.don_vi) set.add(item.don_vi);
    return Array.from(set).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const dv = normalizeVi(item.don_vi ?? "");
      if (filterDistrict && !dv.includes(normalizeVi(filterDistrict))) return false;
      if (filterWard && !dv.includes(normalizeVi(filterWard))) return false;
      if (filterDonVi && item.don_vi !== filterDonVi) return false;
      return true;
    });
  }, [data, filterDistrict, filterWard, filterDonVi]);

  const nhomRows = useMemo<NhomRow[]>(() => {
    const result = CATEGORIES.map((cat) => {
      const catItems = filteredData.filter((item) => item.nhom === cat.id);
      const phanNhomCounts = new Map<string, number>();
      for (const item of catItems) {
        const pn = item.phan_nhom ?? "";
        if (pn) phanNhomCounts.set(pn, (phanNhomCounts.get(pn) ?? 0) + 1);
      }
      const phanNhoms = (PHAN_NHOM_BY_NHOM[cat.id] ?? [])
        .map((pn) => ({ label: pn, count: phanNhomCounts.get(pn) ?? 0 }))
        .filter((pn) => pn.count > 0);
      return {
        nhomId: cat.id,
        nhomLabel: cat.label,
        nhomIcon: cat.icon,
        count: catItems.length,
        phanNhoms,
      };
    }).filter((row) => row.count > 0);

    result.sort((a, b) => sortAsc ? a.count - b.count : b.count - a.count);
    return result;
  }, [filteredData, sortAsc]);

  const toggleNhom = (nhomId: string) => {
    setExpandedNhoms((prev) => {
      const next = new Set(prev);
      if (next.has(nhomId)) next.delete(nhomId);
      else next.add(nhomId);
      return next;
    });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const { exportThongKeNhomExcel } = await import("@/lib/exportExcel");
      await exportThongKeNhomExcel(nhomRows);
    } finally {
      setExporting(false);
    }
  };

  const totalCount = nhomRows.reduce((sum, r) => sum + r.count, 0);
  const activeFilterCount = [filterDistrict, filterWard, filterDonVi].filter(Boolean).length;

  const sidebarProps = {
    filterDistrict, filterWard, filterDonVi,
    setFilterDistrict, setFilterWard, setFilterDonVi,
    donViOptions, reportType, setReportType,
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-100">
      {/* Desktop sidebar */}
      <div className="hidden md:block w-72 shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
        <SidebarContent {...sidebarProps} />
      </div>

      {/* Mobile sidebar bottom sheet */}
      {mounted && mobileSidebarOpen && createPortal(
        <>
          <div className="fixed inset-0 bg-black/40 z-[9998] md:hidden" onClick={() => setMobileSidebarOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-2xl overflow-hidden md:hidden" style={{ maxHeight: "80vh" }}>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
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
        {/* Header bar */}
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
            <h2 className="font-bold text-sm sm:text-lg text-gray-800 truncate">Nguồn gen theo nhóm nguồn gen</h2>
            <div className="hidden sm:flex w-5 h-5 rounded-full bg-green-600 text-white items-center justify-center text-xs font-bold cursor-help shrink-0" title="Thống kê số lượng nguồn gen theo nhóm">?</div>
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
              className="flex items-center gap-1.5 border border-gray-300 text-gray-600 text-xs sm:text-sm px-2.5 sm:px-4 py-2 rounded transition-colors hover:bg-gray-50"
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
            <BarChart rows={nhomRows} />
          ) : (
            <div className="bg-white rounded shadow-sm overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ backgroundColor: "#5b8fa8" }} className="text-white">
                    <th className="px-2 sm:px-3 py-3 text-center font-semibold w-12 sm:w-14">#</th>
                    <th className="px-3 sm:px-4 py-3 text-left font-semibold">Tên nhóm nguồn gen</th>
                    <th
                      className="px-2 sm:px-4 py-3 text-right font-semibold cursor-pointer select-none whitespace-nowrap"
                      onClick={() => setSortAsc((v) => !v)}
                    >
                      <span className="hidden sm:inline">Số lượng nguồn gen </span>
                      <span className="sm:hidden">SL </span>
                      <span className="opacity-80">{sortAsc ? "↑" : "↓"}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nhomRows.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center text-gray-400">Không có dữ liệu</td>
                    </tr>
                  )}
                  {nhomRows.flatMap((nhomRow, nhomIdx) => {
                    const isExpanded = expandedNhoms.has(nhomRow.nhomId);
                    const rows = [
                      <tr key={nhomRow.nhomId} className="bg-blue-50 border-b border-gray-200">
                        <td className="px-1 sm:px-3 py-1.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => toggleNhom(nhomRow.nhomId)}
                              className="w-7 h-7 rounded border border-gray-400 text-gray-600 flex items-center justify-center text-sm hover:bg-blue-100 font-mono shrink-0 touch-manipulation"
                            >
                              {isExpanded ? "−" : "+"}
                            </button>
                            <span className="text-xs text-gray-500 w-4 text-center hidden sm:inline">{nhomIdx + 1}</span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-2.5 font-semibold text-gray-800 text-sm">
                          <span className="mr-1">{nhomRow.nhomIcon}</span>
                          {nhomRow.nhomLabel}
                        </td>
                        <td className="px-2 sm:px-4 py-2.5 text-right font-semibold text-gray-800 text-sm">{nhomRow.count}</td>
                      </tr>,
                    ];

                    if (isExpanded) {
                      nhomRow.phanNhoms.forEach((pn, pnIdx) => {
                        rows.push(
                          <tr key={`${nhomRow.nhomId}-${pn.label}`} className={pnIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-1 sm:px-3 py-2 text-center text-xs text-gray-400">{pnIdx + 1}</td>
                            <td className="pl-5 sm:pl-8 pr-2 sm:pr-4 py-2 text-sm text-gray-700 border-b border-gray-100">{pn.label}</td>
                            <td className="px-2 sm:px-4 py-2 text-right text-sm text-gray-700 border-b border-gray-100">{pn.count}</td>
                          </tr>
                        );
                      });
                    }

                    return rows;
                  })}
                </tbody>
                {nhomRows.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-100 border-t-2 border-gray-300">
                      <td colSpan={2} className="px-2 sm:px-4 py-2.5 font-semibold text-gray-700 text-sm">Tổng</td>
                      <td className="px-2 sm:px-4 py-2.5 text-right font-bold text-gray-800 text-sm">{totalCount}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

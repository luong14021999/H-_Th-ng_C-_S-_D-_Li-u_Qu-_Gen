"use client";

import { useState, useRef, useCallback } from "react";
import { importNguonGenExcel, ImportResult } from "@/lib/importExcel";
import { apiCreate, apiUpdate, apiSaveForm } from "@/lib/api";
import { NguonGen, CATEGORY_MAP } from "@/data/nguonGen";

interface ParsedRecord {
  fileName: string;
  result: ImportResult;
  status: "pending" | "saving" | "saved" | "error";
  error?: string;
}

interface ImportModalProps {
  existingData: NguonGen[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportModal({ existingData, onClose, onSuccess }: ImportModalProps) {
  const [records, setRecords] = useState<ParsedRecord[]>([]);
  const [parsing, setParsing] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const existingMaSet = new Set(existingData.map((d) => d.ma));

  const parseFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.name.endsWith(".xlsx"));
    if (!list.length) return;
    setParsing(true);
    const parsed: ParsedRecord[] = [];
    for (const file of list) {
      try {
        const result = await importNguonGenExcel(file);
        parsed.push({ fileName: file.name, result, status: "pending" });
      } catch {
        parsed.push({
          fileName: file.name,
          result: { basic: {}, form1: {}, form2: {}, form3: {}, form4: {} },
          status: "error",
          error: "Không thể đọc file — hãy chọn file Excel đã xuất từ hệ thống.",
        });
      }
    }
    setRecords((prev) => [...prev, ...parsed]);
    setParsing(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) parseFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) parseFiles(e.dataTransfer.files);
  };

  const removeRecord = (idx: number) => {
    setRecords((prev) => prev.filter((_, i) => i !== idx));
  };

  const saveRecord = async (idx: number): Promise<boolean> => {
    const rec = records[idx];
    const { basic, form1, form2, form3, form4 } = rec.result;
    setRecords((prev) => prev.map((r, i) => (i === idx ? { ...r, status: "saving" } : r)));
    try {
      let ma = basic.ma ?? "";
      if (existingMaSet.has(ma)) {
        await apiUpdate(ma, basic);
      } else {
        const created = await apiCreate(basic);
        ma = created.ma;
      }
      await Promise.all([
        Object.keys(form1).length ? apiSaveForm(ma, "form1", form1) : Promise.resolve(),
        Object.keys(form2).length ? apiSaveForm(ma, "form2", form2) : Promise.resolve(),
        Object.keys(form3).length ? apiSaveForm(ma, "form3", form3) : Promise.resolve(),
        Object.keys(form4).length ? apiSaveForm(ma, "form4", form4) : Promise.resolve(),
      ]);
      setRecords((prev) => prev.map((r, i) => (i === idx ? { ...r, status: "saved" } : r)));
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setRecords((prev) => prev.map((r, i) => (i === idx ? { ...r, status: "error", error: msg } : r)));
      return false;
    }
  };

  const handleSaveAll = async () => {
    const pending = records.filter((r) => r.status === "pending");
    if (!pending.length) return;
    setSavingAll(true);
    let anySuccess = false;
    for (let i = 0; i < records.length; i++) {
      if (records[i].status === "pending") {
        const ok = await saveRecord(i);
        if (ok) anySuccess = true;
      }
    }
    setSavingAll(false);
    if (anySuccess) onSuccess();
  };

  const pendingCount = records.filter((r) => r.status === "pending").length;
  const savedCount = records.filter((r) => r.status === "saved").length;
  const errorCount = records.filter((r) => r.status === "error" && r.result.basic.ma === undefined && r.error?.includes("đọc")).length;

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-bold text-base">Nhập từ tệp Excel</h2>
          <p className="text-green-100 text-xs mt-0.5">
            Chọn các file XLSX đã xuất từ hệ thống để nhập hàng loạt
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              onClick={handleSaveAll}
              disabled={savingAll}
              className="flex items-center gap-1.5 bg-white text-green-700 font-semibold text-sm px-4 py-1.5 rounded hover:bg-green-50 transition-colors disabled:opacity-50"
            >
              {savingAll ? (
                <div className="w-3.5 h-3.5 border-2 border-green-700 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              Lưu tất cả ({pendingCount})
            </button>
          )}
          <button onClick={onClose} className="text-green-100 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Drop zone */}
        <div
          onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-colors ${
            dragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          {parsing ? (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Đang đọc file...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Kéo thả file XLSX vào đây hoặc{" "}
                  <span className="text-green-600 font-semibold">nhấn để chọn file</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Có thể chọn nhiều file cùng lúc</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats bar */}
        {records.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-gray-600 px-1">
            <span className="font-medium">{records.length} file đã tải</span>
            {savedCount > 0 && (
              <span className="text-green-600 font-medium">{savedCount} đã lưu</span>
            )}
            {errorCount > 0 && (
              <span className="text-red-500 font-medium">{errorCount} lỗi</span>
            )}
            {pendingCount > 0 && (
              <span className="text-amber-600 font-medium">{pendingCount} chờ lưu</span>
            )}
          </div>
        )}

        {/* Record list */}
        {records.length > 0 && (
          <div className="space-y-2">
            {records.map((rec, idx) => {
              const { basic } = rec.result;
              const isExisting = basic.ma ? existingMaSet.has(basic.ma) : false;
              const cat = basic.nhom ? CATEGORY_MAP[basic.nhom] : null;

              return (
                <div
                  key={idx}
                  className={`border rounded-xl px-4 py-3 flex items-start gap-3 transition-colors ${
                    rec.status === "saved"
                      ? "bg-green-50 border-green-200"
                      : rec.status === "error"
                      ? "bg-red-50 border-red-200"
                      : rec.status === "saving"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {/* Status icon */}
                  <div className="mt-0.5 shrink-0">
                    {rec.status === "saving" && (
                      <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    {rec.status === "saved" && (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {rec.status === "error" && (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {rec.status === "pending" && (
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>

                  {/* Record info */}
                  <div className="flex-1 min-w-0">
                    {rec.status === "error" && !basic.ten ? (
                      <>
                        <p className="text-sm font-medium text-red-700 truncate">{rec.fileName}</p>
                        <p className="text-xs text-red-500 mt-0.5">{rec.error}</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-800 truncate">
                            {basic.ten || "(Chưa có tên)"}
                          </span>
                          {basic.ma && (
                            <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {basic.ma}
                            </span>
                          )}
                          {isExisting ? (
                            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                              Cập nhật
                            </span>
                          ) : (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                              Mới
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {basic.khoa_hoc && (
                            <span className="text-xs text-gray-400 italic">{basic.khoa_hoc}</span>
                          )}
                          {cat && (
                            <span className="text-xs text-gray-500">{cat.icon} {cat.label}</span>
                          )}
                          {basic.phan_nhom && (
                            <span className="text-xs text-gray-500">— {basic.phan_nhom}</span>
                          )}
                          {basic.don_vi && (
                            <span className="text-xs text-gray-400">· {basic.don_vi}</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-300 mt-0.5 truncate">{rec.fileName}</p>
                        {rec.status === "error" && rec.error && (
                          <p className="text-xs text-red-500 mt-1">{rec.error}</p>
                        )}
                        {rec.status === "saved" && (
                          <p className="text-xs text-green-600 mt-0.5">Đã lưu thành công</p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {rec.status === "pending" && (
                      <button
                        onClick={() => saveRecord(idx)}
                        disabled={savingAll}
                        className="text-xs text-green-700 hover:text-green-800 font-medium px-2 py-1 rounded hover:bg-green-100 transition-colors disabled:opacity-40"
                      >
                        Lưu
                      </button>
                    )}
                    {rec.status === "error" && basic.ten && (
                      <button
                        onClick={() => {
                          setRecords((prev) => prev.map((r, i) => i === idx ? { ...r, status: "pending", error: undefined } : r));
                        }}
                        className="text-xs text-amber-700 hover:text-amber-800 font-medium px-2 py-1 rounded hover:bg-amber-100 transition-colors"
                      >
                        Thử lại
                      </button>
                    )}
                    {rec.status !== "saving" && (
                      <button
                        onClick={() => removeRecord(idx)}
                        disabled={savingAll}
                        className="p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded transition-colors disabled:opacity-40"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {records.length === 0 && !parsing && (
          <p className="text-center text-sm text-gray-400 py-8">
            Chưa có file nào được chọn. Kéo thả hoặc nhấn vào ô bên trên để chọn file.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between bg-gray-50 shrink-0">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={parsing || savingAll}
          className="flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm file
        </button>
        <div className="flex items-center gap-2">
          {savedCount > 0 && pendingCount === 0 && (
            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              Hoàn tất
            </button>
          )}
          {pendingCount > 0 && (
            <button
              onClick={handleSaveAll}
              disabled={savingAll}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {savingAll ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              Lưu tất cả ({pendingCount})
            </button>
          )}
          <button
            onClick={onClose}
            disabled={savingAll}
            className="border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

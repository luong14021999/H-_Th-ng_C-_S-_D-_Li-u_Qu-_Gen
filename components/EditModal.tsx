"use client";

import { useState, useRef, useEffect } from "react";
import { NguonGen } from "@/data/nguonGen";
import { ExtendedFormData, Form1Data, Form2Data, Form3Data, Form4Data, defaultForm1, defaultForm2, defaultForm3, defaultForm4 } from "@/data/extendedTypes";
import Form1BasicInfo from "./edit-forms/Form1BasicInfo";
import Form2Survey from "./edit-forms/Form2Survey";
import Form3InitialAssessment from "./edit-forms/Form3InitialAssessment";
import Form4DetailedAssessment from "./edit-forms/Form4DetailedAssessment";
import { importNguonGenExcel } from "@/lib/importExcel";

interface EditModalProps {
  item: NguonGen;
  extended: ExtendedFormData;
  isNew?: boolean;
  onSave: (updated: NguonGen, ext: ExtendedFormData) => void;
  onClose: () => void;
}

const TABS = [
  { label: 'Thông tin cơ bản', short: 'Cơ bản' },
  { label: 'Dữ liệu điều tra, thu thập', short: 'Điều tra' },
  { label: 'Dữ liệu đánh giá ban đầu', short: 'Đánh giá ban đầu' },
  { label: 'Dữ liệu đánh giá chi tiết', short: 'Đánh giá chi tiết' },
];

export default function EditModal({ item, extended, isNew, onSave, onClose }: EditModalProps) {
  const [tab, setTab] = useState(0);
  const [basic, setBasic] = useState<NguonGen>({ ...item });
  const [form1, setForm1] = useState<Partial<Form1Data>>(extended.form1 ?? defaultForm1());
  const [form2, setForm2] = useState<Partial<Form2Data>>(extended.form2 ?? defaultForm2());
  const [form3, setForm3] = useState<Partial<Form3Data>>(extended.form3 ?? defaultForm3());
  const [form4, setForm4] = useState<Partial<Form4Data>>(extended.form4 ?? defaultForm4());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!basic.ten.trim()) {
      setValidationMsg("Vui lòng nhập Tên Việt Nam trước khi lưu.");
      setTab(0);
      return;
    }
    if (!String(form1.nguon_giao ?? "").trim()) {
      setValidationMsg("Vui lòng nhập Người/cơ quan giao, trồng/cấp giống trước khi lưu.");
      setTab(0);
      return;
    }
    const hasLocation =
      String(form1.noi_thu_thap_tinh ?? "").trim() ||
      String(form1.noi_thu_thap_huyen ?? "").trim() ||
      String(form1.noi_thu_thap_xa ?? "").trim();
    if (!hasLocation) {
      setValidationMsg("Vui lòng nhập Nơi thu thập (Tỉnh/Huyện/Xã) trước khi lưu.");
      setTab(0);
      return;
    }
    onSave(basic, { form1, form2, form3, form4 });
  };

  const handleReset = () => {
    if (tab === 0) setForm1(defaultForm1());
    else if (tab === 1) setForm2(defaultForm2());
    else if (tab === 2) setForm3(defaultForm3());
    else if (tab === 3) setForm4(defaultForm4());
    setShowResetConfirm(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setImporting(true);
    try {
      const result = await importNguonGenExcel(file);
      if (result.form2) setForm2(result.form2);
      if (result.form3) setForm3(result.form3);
      if (result.form4) setForm4(result.form4);
      if (result.ma) setBasic((prev) => ({ ...prev, ma: result.ma! }));
    } catch {
      alert("Không thể đọc file. Vui lòng chọn file Excel được xuất từ hệ thống.");
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F9") { e.preventDefault(); setShowResetConfirm(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col bg-white">
      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="min-w-0">
          <h2 className="font-bold text-base">{isNew ? "Thêm mới nguồn gen" : "Chỉnh sửa nguồn gen"}</h2>
          <p className="text-green-100 text-xs font-mono mt-0.5 truncate">{isNew ? "Nhập đầy đủ thông tin bên dưới" : `${item.ma} — ${item.ten}`}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Import XLSX */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-2.5 py-1.5 rounded transition-colors disabled:opacity-50"
            title="Nhập từ tệp XLSX"
          >
            {importing ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            )}
            <span className="hidden sm:inline">Nhập từ tệp XLSX</span>
          </button>
          <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleImport} />

          {/* Reset current form */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-2.5 py-1.5 rounded transition-colors"
            title="Làm mới (F9)"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Làm mới (F9)</span>
          </button>

          <button onClick={handleSave} className="bg-white text-green-700 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded hover:bg-green-50 transition-colors">
            {isNew ? "Lưu lại" : "Lưu lại"}
          </button>
          <button onClick={onClose} className="text-green-100 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50 shrink-0 overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`px-3 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === i ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="sm:hidden">{t.short}</span>
            <span className="hidden sm:inline"><span className="mr-1 text-xs text-gray-400">{i + 1}.</span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4">
        {tab === 0 && <Form1BasicInfo basic={basic} data={form1} isNew={isNew} onBasicChange={setBasic} onDataChange={setForm1} />}
        {tab === 1 && <Form2Survey nhom={basic.nhom} data={form2} onChange={setForm2} />}
        {tab === 2 && <Form3InitialAssessment ma={basic.ma} onMaChange={(v) => setBasic((prev) => ({ ...prev, ma: v }))} nhom={basic.nhom} data={form3} onChange={setForm3} />}
        {tab === 3 && <Form4DetailedAssessment ma={basic.ma} onMaChange={(v) => setBasic((prev) => ({ ...prev, ma: v }))} data={form4} onChange={setForm4} />}
      </div>

      {/* Validation error modal */}
      {validationMsg && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Thông tin bắt buộc</p>
                <p className="text-xs text-gray-500 mt-0.5">Vui lòng kiểm tra lại</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-5">{validationMsg}</p>
            <button
              onClick={() => setValidationMsg(null)}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 rounded-lg transition-colors font-medium"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* Reset confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Xác nhận làm mới</p>
                <p className="text-xs text-gray-500 mt-0.5">Dữ liệu chưa lưu sẽ bị xóa</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-5">
              Bạn có chắc muốn đặt lại toàn bộ dữ liệu của tab <span className="font-semibold">{TABS[tab].label}</span> về mặc định?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 rounded-lg transition-colors font-medium"
              >
                Làm mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer nav */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex gap-1.5">
          {TABS.map((_, i) => (
            <button key={i} onClick={() => setTab(i)}
              className={`w-2 h-2 rounded-full transition-colors ${i === tab ? 'bg-green-600' : 'bg-gray-300'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          {tab > 0 && (
            <button onClick={() => setTab(tab - 1)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              ← Trước
            </button>
          )}
          {tab < 3 ? (
            <button onClick={() => setTab(tab + 1)}
              className="px-3 py-1.5 text-sm bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors">
              Tiếp theo →
            </button>
          ) : (
            <button onClick={handleSave}
              className="px-4 py-1.5 text-sm bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
              {isNew ? "Lưu lại" : "Lưu lại"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

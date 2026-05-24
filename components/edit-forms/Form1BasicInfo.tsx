"use client";

import { useState, useRef, useEffect } from "react";
import { NguonGen, PHAN_NHOM_BY_NHOM } from "@/data/nguonGen";
import { Form1Data, BaoTonEntry, defaultForm1 } from "@/data/extendedTypes";
import SearchSelect from "@/components/SearchableSelect";
import { danhMucStores } from "@/data/danhMucData";
import { apiUploadImage, apiDeleteImage } from "@/lib/api";
import { normalizeVi } from "@/lib/text";
import AutoTextarea from "@/components/AutoTextarea";

// Browser-side image compression: kicks in only for very large files to keep
// upload fast and storage reasonable. Files at or below this threshold are
// sent to Supabase Storage untouched, preserving original quality.
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= MAX_UPLOAD_BYTES) return file;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Không đọc được tệp"));
    r.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Không phải ảnh hợp lệ"));
    i.src = dataUrl;
  });

  let maxEdge = 1920;
  let quality = 0.85;
  for (let attempt = 0; attempt < 8; attempt++) {
    const longest = Math.max(img.width, img.height);
    const scale = longest > maxEdge ? maxEdge / longest : 1;
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Trình duyệt không hỗ trợ canvas");
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Không nén được ảnh"))), "image/jpeg", quality);
    });

    if (blob.size <= MAX_UPLOAD_BYTES) {
      const baseName = file.name.replace(/\.[^.]+$/, "");
      return new File([blob], `${baseName}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
    }

    if (quality > 0.55) quality -= 0.1;
    else maxEdge = Math.round(maxEdge * 0.8);
  }
  throw new Error(`Không nén được ảnh ${file.name} xuống dưới giới hạn`);
}


interface Props {
  basic: NguonGen;
  data: Partial<Form1Data>;
  isNew?: boolean;
  onBasicChange: (updated: NguonGen) => void;
  onDataChange: (updated: Partial<Form1Data>) => void;
}

const Input = ({ label, value, onChange, required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1.5">
      {required && <span className="text-red-500 mr-0.5">*</span>}{label}
    </label>
    <div className="sm:col-span-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-base sm:text-sm bg-transparent"
      />
    </div>
  </div>
);

const Textarea = ({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1.5">{label}</label>
    <div className="sm:col-span-2">
      <AutoTextarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        minRows={2}
        className="w-full border border-gray-200 rounded p-1.5 text-base sm:text-sm focus:outline-none focus:border-green-500 bg-gray-50"
      />
    </div>
  </div>
);

function SearchableSelect({ label, value, onChange, options, required }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [value]);

  const filtered = query
    ? (() => { const q = normalizeVi(query); return options.filter(o => normalizeVi(o).includes(q)); })()
    : options;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
      <label className="text-sm text-gray-600 pt-1.5">
        {required && <span className="text-red-500 mr-0.5">*</span>}{label}
      </label>
      <div className="sm:col-span-2 relative" ref={containerRef}>
        <div className="flex items-center border-b border-gray-300 focus-within:border-green-600">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => { setQuery(''); setOpen(true); }}
            placeholder="Tìm kiếm..."
            className="flex-1 outline-none py-1 px-1 text-base sm:text-sm bg-transparent"
          />
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {open && filtered.length > 0 && (
          <div className="absolute z-50 w-full bg-white border border-gray-200 shadow-lg rounded mt-0.5 max-h-48 overflow-y-auto">
            {filtered.map(opt => (
              <div
                key={opt}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${opt === value ? 'bg-gray-300' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); onChange(opt); setQuery(opt); setOpen(false); }}
              >
                {opt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Form1BasicInfo({ basic, data, isNew, onBasicChange, onDataChange }: Props) {
  const d = { ...defaultForm1(), ...data };
  const set = (field: keyof Form1Data, val: unknown) => onDataChange({ ...d, [field]: val });
  const setBasic = (field: keyof NguonGen, val: string) => onBasicChange({ ...basic, [field]: val });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      const total = (d.hinh_anh ?? []).length;
      if (e.key === "Escape") setLightboxIdx(null);
      else if (e.key === "ArrowRight") setLightboxIdx((i) => (i === null ? null : (i + 1) % total));
      else if (e.key === "ArrowLeft") setLightboxIdx((i) => (i === null ? null : (i - 1 + total) % total));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, d.hinh_anh]);

  const handleFiles = async (files: File[]) => {
    if (!files.length) return;
    setUploadError(null);
    setUploading(true);

    try {
      // Compress sequentially — running canvas on several huge images in
      // parallel can crash mobile browsers from memory pressure.
      const prepared: File[] = [];
      for (const f of files) prepared.push(await compressImage(f));

      const ma = basic.ma?.trim();
      if (!ma) {
        // New record without a code yet — keep base64 fallback so the user can
        // preview before the first save.
        const dataUrls = await Promise.all(
          prepared.map(
            (file) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve(ev.target?.result as string);
                reader.onerror = () => reject(new Error("Không đọc được tệp"));
                reader.readAsDataURL(file);
              })
          )
        );
        set("hinh_anh", [...(d.hinh_anh ?? []), ...dataUrls]);
        setUploadError("Nhập mã nguồn gen rồi lưu một lần để ảnh được tải lên kho. Hiện ảnh đang giữ tạm trong trình duyệt.");
        return;
      }

      const urls = await Promise.all(prepared.map((file) => apiUploadImage(ma, file)));
      set("hinh_anh", [...(d.hinh_anh ?? []), ...urls]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Tải ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (idx: number) => {
    const list = d.hinh_anh ?? [];
    const target = list[idx];
    const next = list.filter((_, i) => i !== idx);
    set("hinh_anh", next);

    // If it's a remote storage URL, also delete from Supabase Storage.
    const ma = basic.ma?.trim();
    if (ma && typeof target === "string" && !target.startsWith("data:")) {
      const marker = `/nguon-gen-images/${ma}/`;
      const i = target.indexOf(marker);
      const filename = i >= 0 ? target.slice(i + marker.length).split("?")[0] : "";
      if (filename) {
        try { await apiDeleteImage(ma, filename); } catch { /* ignore */ }
      }
    }
  };

  const updateBaoTon = (idx: number, field: keyof BaoTonEntry, val: string) => {
    const list = [...(d.bao_ton_list ?? [])];
    list[idx] = { ...list[idx], [field]: val };
    set('bao_ton_list', list);
  };

  const addBaoTon = () => set('bao_ton_list', [...(d.bao_ton_list ?? []), { phuong_thuc: '', hinh_thuc: '', don_vi: '', noi: '' }]);
  const removeBaoTon = (idx: number) => set('bao_ton_list', (d.bao_ton_list ?? []).filter((_, i) => i !== idx));

  return (
    <div className="space-y-5 text-sm">
      {/* Basic identifiers */}
      <div>
        <Input label="Mã nguồn gen" value={basic.ma} onChange={isNew ? (v) => setBasic('ma', v) : () => {}} placeholder={isNew ? "Nhập mã nguồn gen..." : undefined} />
        <Input label="Tên Việt Nam" value={basic.ten} onChange={(v) => setBasic('ten', v)} required />
        <Input label="Tên khoa học" value={basic.khoa_hoc} onChange={(v) => setBasic('khoa_hoc', v)} />
        <Input label="Tên khác" value={d.ten_khac} onChange={(v) => set('ten_khac', v)} />
        <Input label="Tên họ" value={d.ten_ho} onChange={(v) => set('ten_ho', v)} />
        <Input label="Tên bộ" value={d.ten_bo} onChange={(v) => set('ten_bo', v)} />
        <SearchableSelect
          label="Nhóm nguồn gen"
          required
          value={basic.phan_nhom}
          onChange={(v) => setBasic('phan_nhom', v)}
          options={PHAN_NHOM_BY_NHOM[basic.nhom] ?? []}
        />

      </div>

      {/* Nơi thu thập */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2 bg-gray-50 px-2 py-1 rounded">Nơi thu thập</h3>
        <Input label="Người/cơ quan giao, trồng/cấp giống" value={d.nguon_giao} onChange={(v) => set('nguon_giao', v)} required />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
          <label className="text-sm text-gray-600 pt-1.5"><span className="text-red-500 mr-0.5">*</span>Nơi thu thập</label>
          <div className="col-span-2 flex gap-2 flex-wrap">
            {['noi_thu_thap_tinh', 'noi_thu_thap_huyen', 'noi_thu_thap_xa'].map((f, i) => (
              <input key={f} type="text" placeholder={['Tỉnh/TP', 'Huyện', 'Xã'][i]}
                value={d[f as keyof Form1Data] as string}
                onChange={(e) => set(f as keyof Form1Data, e.target.value)}
                className="flex-1 min-w-[80px] border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent" />
            ))}
          </div>
        </div>
        <Textarea label="Địa chỉ chi tiết" value={d.dia_chi_chi_tiet} onChange={(v) => set('dia_chi_chi_tiet', v)} />
        <Textarea label="Mô tả" value={d.mo_ta_thu_thap} onChange={(v) => set('mo_ta_thu_thap', v)} />
      </div>

      {/* Nơi phân bố */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2 bg-gray-50 px-2 py-1 rounded">Nơi phân bố/nuôi/trồng</h3>
        <Textarea label="" value={d.noi_phan_bo} onChange={(v) => set('noi_phan_bo', v)} />
      </div>

      {/* Tình trạng bảo tồn */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2 bg-gray-50 px-2 py-1 rounded">Tình trạng Bảo tồn</h3>
        <div className="py-2 border-b border-gray-100 flex items-center gap-2">
          <input type="checkbox" id="bao_ton" checked={d.dang_bao_ton} onChange={(e) => set('dang_bao_ton', e.target.checked)} className="accent-green-600" />
          <label htmlFor="bao_ton" className="text-sm text-gray-600">Đang bảo tồn</label>
        </div>
        {d.dang_bao_ton && (
          <>
            {(d.bao_ton_list ?? []).map((entry, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3 mb-2 mt-2 bg-gray-50 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-500">Danh sách {idx + 1}</span>
                  {(d.bao_ton_list ?? []).length > 1 && (
                    <button onClick={() => removeBaoTon(idx)} className="text-red-400 hover:text-red-600 text-xs">✕ Xóa</button>
                  )}
                </div>
                {/* Phương thức bảo tồn */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 items-start py-1 border-b border-gray-100">
                  <label className="text-xs text-gray-500"><span className="text-red-500 mr-0.5">*</span>Phương thức bảo tồn</label>
                  <div className="col-span-2">
                    <SearchSelect
                      value={entry.phuong_thuc}
                      onChange={(v) => updateBaoTon(idx, 'phuong_thuc', v)}
                      options={danhMucStores.phuongThuc.filter(p => p.trang_thai === 'kich_hoat').map(p => p.ten)}
                      placeholder="Chọn phương thức bảo tồn..."
                    />
                  </div>
                </div>
                {/* Hình thức bảo tồn */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 items-start py-1 border-b border-gray-100">
                  <label className="text-xs text-gray-500"><span className="text-red-500 mr-0.5">*</span>Hình thức bảo tồn</label>
                  <div className="col-span-2">
                    <SearchSelect
                      value={entry.hinh_thuc}
                      onChange={(v) => updateBaoTon(idx, 'hinh_thuc', v)}
                      options={danhMucStores.hinhThucBaoTon.filter(h =>
                        h.trang_thai === 'kich_hoat' &&
                        h.nhom.includes(basic.nhom) &&
                        (!entry.phuong_thuc || h.phuong_thuc_id === danhMucStores.phuongThuc.find(p => p.ten === entry.phuong_thuc)?.id)
                      ).map(h => h.ten)}
                      placeholder="Chọn hình thức bảo tồn..."
                    />
                  </div>
                </div>
                {/* Đơn vị bảo tồn */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 items-start py-1 border-b border-gray-100">
                  <label className="text-xs text-gray-500"><span className="text-red-500 mr-0.5">*</span>Đơn vị bảo tồn</label>
                  <input type="text" value={entry.don_vi} onChange={(e) => updateBaoTon(idx, 'don_vi', e.target.value)}
                    className="col-span-2 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
                </div>
                {/* Nơi bảo tồn */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 items-start py-1 border-b border-gray-100">
                  <label className="text-xs text-gray-500"><span className="text-red-500 mr-0.5">*</span>Nơi bảo tồn</label>
                  <input type="text" value={entry.noi} onChange={(e) => updateBaoTon(idx, 'noi', e.target.value)}
                    className="col-span-2 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
                </div>
              </div>
            ))}
            <button onClick={addBaoTon} className="mt-1 text-xs text-green-700 border border-green-600 px-3 py-1 rounded hover:bg-green-50 transition-colors">
              + Thêm danh sách
            </button>
          </>
        )}
      </div>

      {/* Tình trạng khai thác */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2 bg-gray-50 px-2 py-1 rounded">Tình trạng Khai thác, sử dụng</h3>
        <div className="py-2 border-b border-gray-100 flex items-center gap-2">
          <input type="checkbox" id="khai_thac" checked={d.dang_khai_thac} onChange={(e) => set('dang_khai_thac', e.target.checked)} className="accent-green-600" />
          <label htmlFor="khai_thac" className="text-sm text-gray-600">Đang khai thác, sử dụng</label>
        </div>
        {d.dang_khai_thac && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
              <label className="text-sm text-gray-600 pt-1.5"><span className="text-red-500 mr-0.5">*</span>Hình thức khai thác, sử dụng</label>
              <div className="sm:col-span-2">
                <SearchSelect
                  value={d.hinh_thuc_khai_thac ?? ''}
                  onChange={(v) => set('hinh_thuc_khai_thac', v)}
                  options={danhMucStores.hinhThucKhaiThac.filter(h => h.trang_thai === 'kich_hoat' && h.nhom.includes(basic.nhom)).map(h => h.ten)}
                  placeholder="Chọn hình thức khai thác, sử dụng..."
                />
              </div>
            </div>
            <Input label="Nơi khai thác, sử dụng" value={d.noi_khai_thac} onChange={(v) => set('noi_khai_thac', v)} required />
            <Input label="Đơn vị khai thác, sử dụng" value={d.don_vi_khai_thac} onChange={(v) => set('don_vi_khai_thac', v)} required />
          </>
        )}
      </div>

      {/* Hình ảnh */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2 bg-gray-50 px-2 py-1 rounded">Hình ảnh</h3>
        <div className="py-2 flex flex-wrap items-center gap-2">
          <label className={`cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-dashed border-green-500 rounded-lg text-sm text-green-700 hover:bg-green-50 transition-colors ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
            {uploading ? (
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {uploading ? "Đang xử lý & tải lên..." : "Chọn ảnh"}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              className="hidden"
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? []);
                e.target.value = "";
                await handleFiles(files);
              }}
            />
          </label>
          <span className="text-xs text-gray-400">Có thể chọn nhiều ảnh — ảnh lớn sẽ được tự động nén</span>
        </div>
        {uploadError && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5 mb-2">{uploadError}</p>
        )}
        {(d.hinh_anh ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {(d.hinh_anh ?? []).map((src, idx) => (
              <div key={idx} className="relative group w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                <button
                  type="button"
                  onClick={() => setLightboxIdx(idx)}
                  className="block w-full h-full rounded-lg border border-gray-200 overflow-hidden hover:ring-2 hover:ring-green-500 transition-all"
                  title="Nhấn để xem to"
                >
                  <img src={src} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10"
                  title="Xóa ảnh"
                >
                  ✕
                </button>
                <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded pointer-events-none">{idx + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (d.hinh_anh ?? [])[lightboxIdx] && (
        <div
          className="fixed inset-0 z-[3500] bg-black/85 flex items-center justify-center p-4 select-none"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
            className="absolute top-4 right-4 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center"
            title="Đóng (Esc)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {(d.hinh_anh ?? []).length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const total = (d.hinh_anh ?? []).length;
                  setLightboxIdx((i) => (i === null ? null : (i - 1 + total) % total));
                }}
                className="absolute left-2 sm:left-6 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center"
                title="Ảnh trước"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const total = (d.hinh_anh ?? []).length;
                  setLightboxIdx((i) => (i === null ? null : (i + 1) % total));
                }}
                className="absolute right-2 sm:right-6 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center"
                title="Ảnh tiếp theo"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          <img
            src={(d.hinh_anh ?? [])[lightboxIdx]}
            alt={`Ảnh ${lightboxIdx + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
            Ảnh {lightboxIdx + 1} / {(d.hinh_anh ?? []).length}
          </span>
        </div>
      )}
    </div>
  );
}

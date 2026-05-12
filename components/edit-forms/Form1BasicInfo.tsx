"use client";

import { useState, useRef, useEffect } from "react";
import { NguonGen, PHAN_NHOM_BY_NHOM } from "@/data/nguonGen";
import { Form1Data, BaoTonEntry, defaultForm1 } from "@/data/extendedTypes";


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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full border border-gray-200 rounded p-1.5 text-base sm:text-sm resize-none focus:outline-none focus:border-green-500 bg-gray-50"
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
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
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
                {(['phuong_thuc', 'hinh_thuc', 'don_vi', 'noi'] as const).map((f) => (
                  <div key={f} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 items-start py-1 border-b border-gray-100">
                    <label className="text-xs text-gray-500">
                      {{ phuong_thuc: '* Phương thức bảo tồn', hinh_thuc: '* Hình thức bảo tồn', don_vi: '* Đơn vị bảo tồn', noi: '* Nơi bảo tồn' }[f]}
                    </label>
                    <input type="text" value={entry[f]} onChange={(e) => updateBaoTon(idx, f, e.target.value)}
                      className="col-span-2 border-b border-gray-300 focus:border-green-600 outline-none px-1 py-0.5 text-sm bg-transparent" />
                  </div>
                ))}
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
            <Input label="* Hình thức khai thác, sử dụng" value={d.hinh_thuc_khai_thac} onChange={(v) => set('hinh_thuc_khai_thac', v)} required />
            <Input label="* Nơi khai thác, sử dụng" value={d.noi_khai_thac} onChange={(v) => set('noi_khai_thac', v)} required />
            <Input label="* Đơn vị khai thác, sử dụng" value={d.don_vi_khai_thac} onChange={(v) => set('don_vi_khai_thac', v)} required />
          </>
        )}
      </div>

      {/* Hình ảnh */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2 bg-gray-50 px-2 py-1 rounded">Hình ảnh</h3>
        <div className="py-2">
          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border border-dashed border-green-500 rounded-lg text-sm text-green-700 hover:bg-green-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Chọn ảnh
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                Promise.all(
                  files.map(
                    (file) =>
                      new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (ev) => resolve(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      })
                  )
                ).then((newImgs) => set('hinh_anh', [...(d.hinh_anh ?? []), ...newImgs]));
                e.target.value = '';
              }}
            />
          </label>
          <span className="ml-2 text-xs text-gray-400">Có thể chọn nhiều ảnh</span>
        </div>
        {(d.hinh_anh ?? []).length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {(d.hinh_anh ?? []).map((src, idx) => (
              <div key={idx} className="relative group aspect-square">
                <img src={src} alt={`Ảnh ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover rounded-lg border border-gray-200" />
                <button
                  type="button"
                  onClick={() => set('hinh_anh', (d.hinh_anh ?? []).filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  ✕
                </button>
                <span className="absolute bottom-1 left-1 bg-black/40 text-white text-xs px-1 rounded z-10">Ảnh {idx + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { NguonGen, CATEGORIES } from "@/data/nguonGen";
import { Form1Data, BaoTonEntry, defaultForm1 } from "@/data/extendedTypes";

interface Props {
  basic: NguonGen;
  data: Partial<Form1Data>;
  onBasicChange: (updated: NguonGen) => void;
  onDataChange: (updated: Partial<Form1Data>) => void;
}

const Input = ({ label, value, onChange, required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string;
}) => (
  <div className="grid grid-cols-3 gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1.5">
      {required && <span className="text-red-500 mr-0.5">*</span>}{label}
    </label>
    <div className="col-span-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent"
      />
    </div>
  </div>
);

const Textarea = ({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) => (
  <div className="grid grid-cols-3 gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1.5">{label}</label>
    <div className="col-span-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full border border-gray-200 rounded p-1.5 text-sm resize-none focus:outline-none focus:border-green-500 bg-gray-50"
      />
    </div>
  </div>
);

export default function Form1BasicInfo({ basic, data, onBasicChange, onDataChange }: Props) {
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
        <Input label="Mã nguồn gen" value={basic.ma} onChange={() => {}} />
        <Input label="* Tên Việt Nam" value={basic.ten} onChange={(v) => setBasic('ten', v)} required />
        <Input label="Tên khoa học" value={basic.khoa_hoc} onChange={(v) => setBasic('khoa_hoc', v)} />
        <Input label="Tên khác" value={d.ten_khac} onChange={(v) => set('ten_khac', v)} />
        <Input label="Tên họ" value={d.ten_ho} onChange={(v) => set('ten_ho', v)} />
        <Input label="Tên bộ" value={d.ten_bo} onChange={(v) => set('ten_bo', v)} />
        <div className="grid grid-cols-3 gap-3 items-start py-2 border-b border-gray-100">
          <label className="text-sm text-gray-600 pt-1.5"><span className="text-red-500 mr-0.5">*</span>Nhóm nguồn gen</label>
          <div className="col-span-2">
            <select
              value={basic.nhom}
              onChange={(e) => setBasic('nhom', e.target.value)}
              className="w-full border-b border-gray-300 focus:border-green-600 outline-none py-1 text-sm bg-transparent"
            >
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 items-start py-2 border-b border-gray-100">
          <label className="text-sm text-gray-600 pt-1.5"><span className="text-red-500 mr-0.5">*</span>Phân nhóm</label>
          <div className="col-span-2">
            <input type="text" value={basic.phan_nhom} onChange={(e) => setBasic('phan_nhom', e.target.value)}
              className="w-full border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent" />
          </div>
        </div>
      </div>

      {/* Nơi thu thập */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2 bg-gray-50 px-2 py-1 rounded">Nơi thu thập</h3>
        <Input label="* Người/cơ quan giao, trồng/cấp giống" value={d.nguon_giao} onChange={(v) => set('nguon_giao', v)} required />
        <div className="grid grid-cols-3 gap-3 items-start py-2 border-b border-gray-100">
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
        {(d.bao_ton_list ?? []).map((entry, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3 mb-2 mt-2 bg-gray-50 relative">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-500">Danh sách {idx + 1}</span>
              {(d.bao_ton_list ?? []).length > 1 && (
                <button onClick={() => removeBaoTon(idx)} className="text-red-400 hover:text-red-600 text-xs">✕ Xóa</button>
              )}
            </div>
            {(['phuong_thuc', 'hinh_thuc', 'don_vi', 'noi'] as const).map((f) => (
              <div key={f} className="grid grid-cols-3 gap-2 items-center py-1 border-b border-gray-100">
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
      </div>

      {/* Tình trạng khai thác */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2 bg-gray-50 px-2 py-1 rounded">Tình trạng Khai thác, sử dụng</h3>
        <div className="py-2 border-b border-gray-100 flex items-center gap-2">
          <input type="checkbox" id="khai_thac" checked={d.dang_khai_thac} onChange={(e) => set('dang_khai_thac', e.target.checked)} className="accent-green-600" />
          <label htmlFor="khai_thac" className="text-sm text-gray-600">Đang khai thác, sử dụng</label>
        </div>
        <Input label="* Hình thức khai thác, sử dụng" value={d.hinh_thuc_khai_thac} onChange={(v) => set('hinh_thuc_khai_thac', v)} required />
        <Input label="* Nơi khai thác, sử dụng" value={d.noi_khai_thac} onChange={(v) => set('noi_khai_thac', v)} required />
        <Input label="* Đơn vị khai thác, sử dụng" value={d.don_vi_khai_thac} onChange={(v) => set('don_vi_khai_thac', v)} required />
      </div>

      {/* Tọa độ */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2 bg-gray-50 px-2 py-1 rounded">Tọa độ trên bản đồ</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2 items-center py-2 border-b border-gray-100">
            <label className="text-sm text-gray-600">Vĩ độ (lat)</label>
            <input type="number" step="0.0001" value={basic.lat}
              onChange={(e) => onBasicChange({ ...basic, lat: parseFloat(e.target.value) })}
              className="border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center py-2 border-b border-gray-100">
            <label className="text-sm text-gray-600">Kinh độ (lng)</label>
            <input type="number" step="0.0001" value={basic.lng}
              onChange={(e) => onBasicChange({ ...basic, lng: parseFloat(e.target.value) })}
              className="border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent" />
          </div>
        </div>
        <Input label="Đơn vị lưu giữ" value={basic.don_vi} onChange={(v) => setBasic('don_vi', v)} />
      </div>
    </div>
  );
}

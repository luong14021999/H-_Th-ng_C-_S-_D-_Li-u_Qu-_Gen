"use client";

import { Form3Data, defaultForm3 } from "@/data/extendedTypes";

interface Props {
  ma: string;
  data: Partial<Form3Data>;
  onChange: (updated: Partial<Form3Data>) => void;
}

const Row = ({ label, value, onChange, rows }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) => (
  <div className="grid grid-cols-3 gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1.5">{label}</label>
    <div className="col-span-2">
      {rows ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded p-1.5 text-sm resize-none focus:outline-none focus:border-green-500 bg-gray-50" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full border-b border-gray-300 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent" />
      )}
    </div>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-bold text-gray-700 mt-5 mb-2 bg-gray-100 px-3 py-1.5 rounded text-xs uppercase tracking-wide">{children}</h3>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="font-semibold text-gray-600 mt-3 mb-1 text-xs">{children}</p>
);

export default function Form3InitialAssessment({ ma, data, onChange }: Props) {
  const d = { ...defaultForm3(), ...data };
  const set = (f: keyof Form3Data, v: string) => onChange({ ...d, [f]: v });

  return (
    <div className="text-sm">
      <SectionTitle>I. Thông tin chung</SectionTitle>
      <div className="grid grid-cols-3 gap-3 py-2 border-b border-gray-100">
        <label className="text-sm text-gray-600">Mã số hệ thống</label>
        <span className="col-span-2 text-sm text-gray-400 py-1">(tự động)</span>
      </div>
      <div className="grid grid-cols-3 gap-3 py-2 border-b border-gray-100">
        <label className="text-sm text-gray-600">Mã nguồn gen</label>
        <span className="col-span-2 text-sm font-mono py-1">{ma}</span>
      </div>
      <Row label="Mã số nhiệm vụ" value={d.ma_so_nhiem_vu} onChange={(v) => set('ma_so_nhiem_vu', v)} />

      <SectionTitle>II. Dữ liệu mô tả và đánh giá ban đầu</SectionTitle>

      <SubTitle>A. Thông tin DNA</SubTitle>
      <Row label="Trình tự DNA nguồn gen" value={d.trinh_tu_dna} onChange={(v) => set('trinh_tu_dna', v)} rows={2} />
      <Row label="Chiều dài DNA" value={d.chieu_dai_dna} onChange={(v) => set('chieu_dai_dna', v)} />
      <Row label="Tỷ lệ A, T, G, C" value={d.ti_le_atgc} onChange={(v) => set('ti_le_atgc', v)} />
      <Row label="Chuỗi acid amin do DNA mã hóa" value={d.chuoi_acid_amin} onChange={(v) => set('chuoi_acid_amin', v)} rows={2} />

      <SubTitle>B. Đặc điểm nông sinh học của nguồn gen</SubTitle>
      <Row label="Thông tin về năng suất" value={d.thong_tin_nang_suat} onChange={(v) => set('thong_tin_nang_suat', v)} rows={2} />
      <Row label="Thông tin về chất lượng" value={d.thong_tin_chat_luong} onChange={(v) => set('thong_tin_chat_luong', v)} rows={2} />
      <Row label="Đặc tính kháng sâu/bệnh" value={d.khang_sau_benh} onChange={(v) => set('khang_sau_benh', v)} />
      <Row label="Đặc tính chịu sinh thái bất thuận" value={d.chiu_sinh_thai_bat_thuong} onChange={(v) => set('chiu_sinh_thai_bat_thuong', v)} />
      <Row label="Đặc tính kinh tế nổi bật" value={d.dac_tinh_kinh_te_noi_bat} onChange={(v) => set('dac_tinh_kinh_te_noi_bat', v)} rows={2} />
      <Row label="Tập quán xã hội liên quan đến nuôi/trồng và sử dụng giống" value={d.tap_quan_xa_hoi} onChange={(v) => set('tap_quan_xa_hoi', v)} rows={2} />

      <SubTitle>C. Đánh giá giá trị của nguồn gen</SubTitle>
      <Row label="Giá trị kinh tế" value={d.gia_tri_kinh_te} onChange={(v) => set('gia_tri_kinh_te', v)} rows={2} />
      <Row label="Giá trị bảo tồn" value={d.gia_tri_bao_ton} onChange={(v) => set('gia_tri_bao_ton', v)} rows={2} />
      <Row label="Giá trị đặc hữu" value={d.gia_tri_dac_huu} onChange={(v) => set('gia_tri_dac_huu', v)} />
      <Row label="Giá trị về môi trường" value={d.gia_tri_moi_truong} onChange={(v) => set('gia_tri_moi_truong', v)} />
      <Row label="Giá trị dinh dưỡng, y, dược" value={d.gia_tri_dinh_duong} onChange={(v) => set('gia_tri_dinh_duong', v)} />
      <Row label="Tiềm năng phát triển của nguồn gen" value={d.tiem_nang_phat_trien} onChange={(v) => set('tiem_nang_phat_trien', v)} rows={2} />
      <Row label="Các thông tin khác" value={d.cac_thong_tin_khac} onChange={(v) => set('cac_thong_tin_khac', v)} rows={2} />

      <SectionTitle>III. Ghi chú</SectionTitle>
      <Row label="" value={d.ghi_chu} onChange={(v) => set('ghi_chu', v)} rows={3} />

      <SectionTitle>IV. Tài liệu tham khảo</SectionTitle>
      <Row label="" value={d.tai_lieu_tham_khao} onChange={(v) => set('tai_lieu_tham_khao', v)} rows={3} />
    </div>
  );
}

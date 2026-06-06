"use client";

import { Form4Data, defaultForm4 } from "@/data/extendedTypes";
import AutoTextarea from "@/components/AutoTextarea";

interface Props {
  ma: string;
  onMaChange: (v: string) => void;
  nhom?: string;
  phan_nhom?: string;
  data: Partial<Form4Data>;
  onChange: (updated: Partial<Form4Data>) => void;
}

const Row = ({ label, value, onChange, rows }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1.5">{label}</label>
    <div className="sm:col-span-2">
      {/* All fields use the boxed auto-growing textarea so long content stays fully visible. */}
      <AutoTextarea minRows={rows ?? 1} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-800 rounded p-1.5 text-base sm:text-sm focus:outline-none focus:border-green-500 bg-gray-50" />
    </div>
  </div>
);


const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-bold text-gray-700 mt-5 mb-2 bg-gray-100 px-3 py-1.5 rounded text-xs uppercase tracking-wide">{children}</h3>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="font-semibold text-gray-600 mt-3 mb-1 text-xs uppercase tracking-wide">{children}</p>
);

export default function Form4DetailedAssessment({ ma, onMaChange, nhom, phan_nhom, data, onChange }: Props) {
  const d = { ...defaultForm4(), ...data };
  const set = (f: keyof Form4Data, v: string) => onChange({ ...d, [f]: v });

  const isCNGiaCam = nhom === 'CN' && phan_nhom === 'Gia cầm và chim';
  const isTTCayngo = nhom === 'TT' && phan_nhom === 'Cây ngô';

  if (isCNGiaCam || isTTCayngo) {
    return (
      <div className="text-sm">
        <SectionTitle>A. Thông tin DNA</SectionTitle>
        <Row label=". Trình tự DNA nguồn gen" value={d.trinh_tu_dna} onChange={(v) => set('trinh_tu_dna', v)} rows={2} />
        <Row label=". Chiều dài DNA" value={d.chieu_dai_dna} onChange={(v) => set('chieu_dai_dna', v)} />
        <Row label=". Tỷ lệ A, T, G, C" value={d.ti_le_atgc} onChange={(v) => set('ti_le_atgc', v)} />
        <Row label=". Chuỗi acid amin do DNA mã hóa" value={d.chuoi_acid_amin} onChange={(v) => set('chuoi_acid_amin', v)} rows={2} />

        <SectionTitle>B. Thông tin chung</SectionTitle>
        <Row label=". Mã số của hệ thống" value={d.ma_so_he_thong} onChange={(v) => set('ma_so_he_thong', v)} />
        <Row label="2. Mã số nhiệm vụ" value={d.ma_so_nhiem_vu} onChange={(v) => set('ma_so_nhiem_vu', v)} />
        <Row label="3. Mã nguồn gen" value={ma} onChange={onMaChange} />
        <Row label=". Nơi nhân giống" value={d.noi_nhan_giong_nuoi} onChange={(v) => set('noi_nhan_giong_nuoi', v)} />
        <Row label="4. Tên giống" value={d.ten_giong} onChange={(v) => set('ten_giong', v)} />
        <Row label="5. Nguồn giống (nguồn giống đem nhân)" value={d.nguon_giong} onChange={(v) => set('nguon_giong', v)} />
        <Row label=". Nơi nhân giống, nuôi/trồng, cấp giống" value={d.noi_nhan_giong} onChange={(v) => set('noi_nhan_giong', v)} />
        <Row label="7. Người mô tả, đánh giá" value={d.nguoi_mo_ta} onChange={(v) => set('nguoi_mo_ta', v)} />
        <Row label="8. Cơ quan mô tả, đánh giá" value={d.co_quan_mo_ta} onChange={(v) => set('co_quan_mo_ta', v)} />

        <SectionTitle>C. Dữ liệu mô tả và đánh giá chi tiết</SectionTitle>
        <SubTitle>I. Đặc điểm nông sinh học của nguồn gen</SubTitle>
        <Row label=". Thông tin về năng suất" value={d.thong_tin_nang_suat} onChange={(v) => set('thong_tin_nang_suat', v)} rows={2} />
        <Row label=". Thông tin về chất lượng" value={d.thong_tin_chat_luong} onChange={(v) => set('thong_tin_chat_luong', v)} rows={2} />
        <Row label=". Đặc tính kháng sâu/bệnh" value={d.khang_sau_benh} onChange={(v) => set('khang_sau_benh', v)} />
        <Row label=". Đặc tính chịu sinh thái bất thuận" value={d.chiu_sinh_thai_bat_thuon} onChange={(v) => set('chiu_sinh_thai_bat_thuon', v)} />
        <Row label=". Các đặc tính kinh tế nổi bật" value={d.dac_tinh_kinh_te_noi_bat} onChange={(v) => set('dac_tinh_kinh_te_noi_bat', v)} rows={2} />
        <Row label=". Tập quán xã hội liên quan đến nuôi/trồng và sử dụng giống" value={d.tap_quan_xa_hoi} onChange={(v) => set('tap_quan_xa_hoi', v)} rows={2} />

        <SubTitle>II. Giá trị của nguồn gen</SubTitle>
        <Row label=". Giá trị kinh tế" value={d.gia_tri_kinh_te} onChange={(v) => set('gia_tri_kinh_te', v)} rows={2} />
        <Row label=". Giá trị bảo tồn" value={d.gia_tri_bao_ton} onChange={(v) => set('gia_tri_bao_ton', v)} rows={2} />
        <Row label=". Giá trị đặc hữu" value={d.gia_tri_dac_huu} onChange={(v) => set('gia_tri_dac_huu', v)} />
        <Row label=". Giá trị phòng hộ, bảo vệ môi trường" value={d.gia_tri_moi_truong} onChange={(v) => set('gia_tri_moi_truong', v)} />
        <Row label=". Giá trị dinh dưỡng, y, dược" value={d.gia_tri_dinh_duong} onChange={(v) => set('gia_tri_dinh_duong', v)} />
        <Row label=". Tiềm năng phát triển của nguồn gen" value={d.tiem_nang_phat_trien} onChange={(v) => set('tiem_nang_phat_trien', v)} rows={2} />
        <Row label=". Các thông tin khác" value={d.cac_thong_tin_khac} onChange={(v) => set('cac_thong_tin_khac', v)} rows={2} />

        <SectionTitle>D. Ghi chú</SectionTitle>
        <Row label=". Ghi chú" value={d.ghi_chu} onChange={(v) => set('ghi_chu', v)} rows={3} />

        <SectionTitle>E. Tài liệu tham khảo</SectionTitle>
        <Row label=". Liệt kê danh mục tài liệu tham khảo để thực hiện Phiếu mô tả, đánh giá chi tiết nguồn gen" value={d.tai_lieu_tham_khao} onChange={(v) => set('tai_lieu_tham_khao', v)} rows={3} />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <SectionTitle>I. Thông tin chung</SectionTitle>
      <Row label="1. Mã số của hệ thống" value={d.ma_so_he_thong} onChange={(v) => set('ma_so_he_thong', v)} />
      <Row label="2. Mã số nhiệm vụ" value={d.ma_so_nhiem_vu} onChange={(v) => set('ma_so_nhiem_vu', v)} />
      <Row label="3. Mã nguồn gen" value={ma} onChange={onMaChange} />
      <Row label="4. Tên giống" value={d.ten_giong} onChange={(v) => set('ten_giong', v)} />
      <Row label="5. Nguồn giống (nguồn giống đem nhân)" value={d.nguon_giong} onChange={(v) => set('nguon_giong', v)} />
      <Row label="6. Nơi nhân giống, nuôi/trồng, cấp giống" value={d.noi_nhan_giong} onChange={(v) => set('noi_nhan_giong', v)} />
      <Row label="7. Người mô tả, đánh giá" value={d.nguoi_mo_ta} onChange={(v) => set('nguoi_mo_ta', v)} />
      <Row label="8. Cơ quan mô tả, đánh giá" value={d.co_quan_mo_ta} onChange={(v) => set('co_quan_mo_ta', v)} />

      <SectionTitle>II. Dữ liệu mô tả, đánh giá chi tiết</SectionTitle>

      <SubTitle>A. Thông tin DNA</SubTitle>
      <Row label="9. Trình tự DNA nguồn gen" value={d.trinh_tu_dna} onChange={(v) => set('trinh_tu_dna', v)} rows={2} />
      <Row label="10. Chiều dài DNA" value={d.chieu_dai_dna} onChange={(v) => set('chieu_dai_dna', v)} />
      <Row label="11. Tỷ lệ A, T, G, C" value={d.ti_le_atgc} onChange={(v) => set('ti_le_atgc', v)} />
      <Row label="12. Chuỗi acid amin do DNA mã hóa" value={d.chuoi_acid_amin} onChange={(v) => set('chuoi_acid_amin', v)} rows={2} />

      <SubTitle>B. Đặc điểm nông sinh học của nguồn gen</SubTitle>
      <Row label="14. Thông tin về năng suất" value={d.thong_tin_nang_suat} onChange={(v) => set('thong_tin_nang_suat', v)} rows={2} />
      <Row label="15. Thông tin về chất lượng" value={d.thong_tin_chat_luong} onChange={(v) => set('thong_tin_chat_luong', v)} rows={2} />
      <Row label="16. Đặc tính kháng sâu/bệnh" value={d.khang_sau_benh} onChange={(v) => set('khang_sau_benh', v)} />
      <Row label="17. Đặc tính chịu sinh thái bất thuận" value={d.chiu_sinh_thai_bat_thuon} onChange={(v) => set('chiu_sinh_thai_bat_thuon', v)} />
      <Row label="18. Các đặc tính kinh tế nổi bật" value={d.dac_tinh_kinh_te_noi_bat} onChange={(v) => set('dac_tinh_kinh_te_noi_bat', v)} rows={2} />
      <Row label="19. Tập quán xã hội liên quan đến nuôi/trồng và sử dụng giống" value={d.tap_quan_xa_hoi} onChange={(v) => set('tap_quan_xa_hoi', v)} rows={2} />

      <SubTitle>C. Đánh giá giá trị của nguồn gen</SubTitle>
      <Row label="20. Giá trị kinh tế" value={d.gia_tri_kinh_te} onChange={(v) => set('gia_tri_kinh_te', v)} rows={2} />
      <Row label="21. Giá trị bảo tồn" value={d.gia_tri_bao_ton} onChange={(v) => set('gia_tri_bao_ton', v)} rows={2} />
      <Row label="22. Giá trị đặc hữu" value={d.gia_tri_dac_huu} onChange={(v) => set('gia_tri_dac_huu', v)} />
      <Row label="23. Giá trị về môi trường" value={d.gia_tri_moi_truong} onChange={(v) => set('gia_tri_moi_truong', v)} />
      <Row label="24. Giá trị dinh dưỡng, y, dược" value={d.gia_tri_dinh_duong} onChange={(v) => set('gia_tri_dinh_duong', v)} />
      <Row label="25. Tiềm năng phát triển của nguồn gen" value={d.tiem_nang_phat_trien} onChange={(v) => set('tiem_nang_phat_trien', v)} rows={2} />
      <Row label="26. Các thông tin khác" value={d.cac_thong_tin_khac} onChange={(v) => set('cac_thong_tin_khac', v)} rows={2} />

      <SectionTitle>III. Ghi chú</SectionTitle>
      <div className="py-2">
        <p className="text-xs text-gray-500 mb-1">Dữ liệu đánh giá ban đầu nguồn gen</p>
        <AutoTextarea minRows={3} value={d.ghi_chu} onChange={(e) => set('ghi_chu', e.target.value)}
          className="w-full border border-gray-800 rounded p-1.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50" />
      </div>

      <SectionTitle>IV. Tài liệu tham khảo</SectionTitle>
      <div className="py-2">
        <p className="text-xs text-gray-500 mb-1">(Liệt kê danh mục tài liệu tham khảo để thực hiện Phiếu mô tả, đánh giá chi tiết nguồn gen)</p>
        <AutoTextarea minRows={3} value={d.tai_lieu_tham_khao} onChange={(e) => set('tai_lieu_tham_khao', e.target.value)}
          className="w-full border border-gray-800 rounded p-1.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50" />
      </div>
    </div>
  );
}

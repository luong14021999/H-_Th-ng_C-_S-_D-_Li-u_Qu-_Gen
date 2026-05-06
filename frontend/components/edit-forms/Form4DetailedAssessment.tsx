"use client";

import { Form4Data, defaultForm4 } from "@/data/extendedTypes";

interface Props {
  ma: string;
  data: Partial<Form4Data>;
  onChange: (updated: Partial<Form4Data>) => void;
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

export default function Form4DetailedAssessment({ ma, data, onChange }: Props) {
  const d = { ...defaultForm4(), ...data };
  const set = (f: keyof Form4Data, v: string) => onChange({ ...d, [f]: v });

  return (
    <div className="text-sm">
      <SectionTitle>I. Thông tin chung</SectionTitle>
      <div className="grid grid-cols-3 gap-3 py-2 border-b border-gray-100">
        <label className="text-sm text-gray-600">Mã nguồn gen</label>
        <span className="col-span-2 text-sm font-mono py-1">{ma}</span>
      </div>
      <Row label="Mã số nhiệm vụ" value={d.ma_so_nhiem_vu} onChange={(v) => set('ma_so_nhiem_vu', v)} />
      <Row label="Nguồn giống (nguồn giống đem nhân)" value={d.nguon_giong} onChange={(v) => set('nguon_giong', v)} />
      <Row label="Nơi nhân giống, nuôi/trồng, cấp giống" value={d.noi_nhan_giong} onChange={(v) => set('noi_nhan_giong', v)} />
      <Row label="Người mô tả, đánh giá" value={d.nguoi_mo_ta} onChange={(v) => set('nguoi_mo_ta', v)} />
      <Row label="Cơ quan mô tả, đánh giá" value={d.co_quan_mo_ta} onChange={(v) => set('co_quan_mo_ta', v)} />

      <SectionTitle>II. Dữ liệu mô tả, đánh giá chi tiết</SectionTitle>

      <SubTitle>A. Thông tin DNA</SubTitle>
      <Row label="Trình tự DNA nguồn gen" value={d.trinh_tu_dna} onChange={(v) => set('trinh_tu_dna', v)} rows={2} />
      <Row label="Chiều dài DNA" value={d.chieu_dai_dna} onChange={(v) => set('chieu_dai_dna', v)} />
      <Row label="Tỷ lệ A, T, G, C" value={d.ti_le_atgc} onChange={(v) => set('ti_le_atgc', v)} />
      <Row label="Chuỗi acid amin do DNA mã hóa" value={d.chuoi_acid_amin} onChange={(v) => set('chuoi_acid_amin', v)} rows={2} />

      <SubTitle>B. Đặc điểm nông sinh học của nguồn gen</SubTitle>
      <Row label="Dạng hình thái (MÔ)" value={d.dang_hinh_thai} onChange={(v) => set('dang_hinh_thai', v)} />
      <Row label="Dạng kinh thân" value={d.dang_kinh_than} onChange={(v) => set('dang_kinh_than', v)} />
      <Row label="Chiều cao cây (cm)" value={d.chieu_cao_cay} onChange={(v) => set('chieu_cao_cay', v)} />
      <Row label="Khoảng cách cây (cm, n=5)" value={d.khoang_cach_cay} onChange={(v) => set('khoang_cach_cay', v)} />
      <Row label="Màu sắc thân" value={d.mau_sac_than} onChange={(v) => set('mau_sac_than', v)} />
      <Row label="Đường kính tán (cm, n=5) Trung bình" value={d.duong_kinh_tan} onChange={(v) => set('duong_kinh_tan', v)} />
      <Row label="Kiểu cán lá" value={d.kieu_can_la} onChange={(v) => set('kieu_can_la', v)} />
      <Row label="Hình dạng lá (elip/thon/hình bầu/lòng chim...)" value={d.hinh_dang_la} onChange={(v) => set('hinh_dang_la', v)} />
      <Row label="Màu lá" value={d.mau_la} onChange={(v) => set('mau_la', v)} />
      <Row label="Màu sắc cánh hoa" value={d.mau_sac_canh_hoa} onChange={(v) => set('mau_sac_canh_hoa', v)} />
      <Row label="Hình dạng hoa" value={d.hinh_dang_hoa} onChange={(v) => set('hinh_dang_hoa', v)} />
      <Row label="Đầu thời gian" value={d.dau_thoi_gian} onChange={(v) => set('dau_thoi_gian', v)} />
      <Row label="Mù mẫu" value={d.mu_mau} onChange={(v) => set('mu_mau', v)} />
      <Row label="Hình dạng quả" value={d.hinh_dang_qua} onChange={(v) => set('hinh_dang_qua', v)} />
      <Row label="Loại quả" value={d.loai_qua} onChange={(v) => set('loai_qua', v)} />
      <Row label="Số hạt trên quả (quan sát 3 quả, n=5)" value={d.so_hat_tren_qua} onChange={(v) => set('so_hat_tren_qua', v)} />
      <Row label="Dạng quả vật lý" value={d.dang_qua_vat_ly} onChange={(v) => set('dang_qua_vat_ly', v)} />
      <Row label="Số mù hạt" value={d.so_mu_hat} onChange={(v) => set('so_mu_hat', v)} />

      <SubTitle>B. Dữ liệu mô tả các đặc điểm sinh thái</SubTitle>
      <Row label="Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
      <Row label="Gió, đổi chướng" value={d.gio_doi_chuong} onChange={(v) => set('gio_doi_chuong', v)} />
      <Row label="Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
      <Row label="Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />

      <SubTitle>C. Dữ liệu mô tả các đặc điểm sinh trưởng, phát triển</SubTitle>
      <Row label="Hình thức sinh trưởng (liên tục/theo đợt...)" value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
      <Row label="Tỷ lệ nảy mầm (%)" value={d.ti_le_nay_mam} onChange={(v) => set('ti_le_nay_mam', v)} />
      <Row label="Điều kiện nảy mầm (nhiệt độ/độ ẩm/ánh sáng...)" value={d.dieu_kien_nay_mam} onChange={(v) => set('dieu_kien_nay_mam', v)} />
      <Row label="Thời vụ gieo trồng" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
      <Row label="Thời gian từ khi gieo đến khi mọc (ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
      <Row label="Thời gian từ gieo đến ra hoa, kết quả" value={d.thoi_gian_gieo_hoa} onChange={(v) => set('thoi_gian_gieo_hoa', v)} />
      <Row label="Thời gian từ trồng đến thu hoạch" value={d.thoi_gian_gieo_qua} onChange={(v) => set('thoi_gian_gieo_qua', v)} />

      <SectionTitle>III. Ghi chú</SectionTitle>
      <Row label="" value={d.ghi_chu} onChange={(v) => set('ghi_chu', v)} rows={3} />

      <SectionTitle>IV. Tài liệu tham khảo</SectionTitle>
      <Row label="" value={d.tai_lieu_tham_khao} onChange={(v) => set('tai_lieu_tham_khao', v)} rows={3} />
    </div>
  );
}

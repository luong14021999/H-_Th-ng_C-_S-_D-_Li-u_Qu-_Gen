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
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
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

const ReadOnly = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600">{label}</label>
    <span className="col-span-2 text-sm font-mono py-1 text-gray-500">{value || '(tự động)'}</span>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-bold text-gray-700 mt-5 mb-2 bg-gray-100 px-3 py-1.5 rounded text-xs uppercase tracking-wide">{children}</h3>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="font-semibold text-gray-600 mt-3 mb-1 text-xs uppercase tracking-wide">{children}</p>
);

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-gray-500 italic mt-2 mb-1">{children}</p>
);

export default function Form3InitialAssessment({ ma, data, onChange }: Props) {
  const d = { ...defaultForm3(), ...data };
  const set = (f: keyof Form3Data, v: string) => onChange({ ...d, [f]: v });

  return (
    <div className="text-sm">
      <SectionTitle>I. Thông tin chung</SectionTitle>
      <ReadOnly label="1. Mã số hệ thống" value={d.ma_so_he_thong} />
      <Row label="2. Mã số nhiệm vụ" value={d.ma_so_nhiem_vu} onChange={(v) => set('ma_so_nhiem_vu', v)} />
      <ReadOnly label="3. Mã nguồn gen" value={ma} />
      <Row label="4. Tên giống" value={d.ten_giong} onChange={(v) => set('ten_giong', v)} />
      <Row label="5. Nguồn giống (nguồn giống đem nhân)" value={d.nguon_giong} onChange={(v) => set('nguon_giong', v)} />
      <Row label="6. Nơi nhân giống/nuôi/trồng/cấp giống" value={d.noi_nhan_giong} onChange={(v) => set('noi_nhan_giong', v)} />
      <Row label="7. Người mô tả, đánh giá" value={d.nguoi_mo_ta} onChange={(v) => set('nguoi_mo_ta', v)} />
      <Row label="8. Cơ quan mô tả, đánh giá" value={d.co_quan_mo_ta} onChange={(v) => set('co_quan_mo_ta', v)} />

      <SectionTitle>II. Dữ liệu mô tả và đánh giá ban đầu</SectionTitle>

      <SubTitle>A. Dữ liệu mô tả đặc điểm hình thái</SubTitle>

      <SubLabel>- Đặc điểm chung</SubLabel>
      <Row label="9." value={d.dac_diem_chung} onChange={(v) => set('dac_diem_chung', v)} rows={2} />

      <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
      <Row label="10. Dạng cây (thân gỗ/thân thảo/cây bụi/dây leo/...)" value={d.dang_cay} onChange={(v) => set('dang_cay', v)} />
      <Row label="11. Đường kính thân (đo tại chỗ có đường kính lớn nhất)" value={d.duong_kinh_than} onChange={(v) => set('duong_kinh_than', v)} />
      <Row label="12. Chiều cao cây (đo từ mặt đất tới đỉnh ngọn) (cm; n = 5)" value={d.chieu_cao_cay} onChange={(v) => set('chieu_cao_cay', v)} />
      <Row label="13. Màu sắc thân (không sắc tố/có sắc tố/xanh/nâu/tím/...)" value={d.mau_sac_than} onChange={(v) => set('mau_sac_than', v)} />
      <Row label="14. Đường kính tán (cm; n = 5) Trung bình" value={d.duong_kinh_tan} onChange={(v) => set('duong_kinh_tan', v)} />
      <Row label="15. Kiểu gân lá (song song/lông chim/chân vịt/...)" value={d.kieu_gan_la} onChange={(v) => set('kieu_gan_la', v)} />
      <Row label="16. Hình dạng lá (hình kim/trứng ngược/trứng/xẻ thùy lông chim/xẻ thùy chân vịt/hình thân/hình mác/hình tên/...)" value={d.hinh_dang_la} onChange={(v) => set('hinh_dang_la', v)} />
      <Row label="17. Màu lá (xanh/xanh nhạt/tím/hỗn hợp/...)" value={d.mau_la} onChange={(v) => set('mau_la', v)} />
      <Row label="18. Kiểu lá (lá đơn/kép chân vịt/kép lông chim/...)" value={d.kieu_la} onChange={(v) => set('kieu_la', v)} />
      <Row label="19. Kiểu hoa (đơn/chùm/...)" value={d.kieu_hoa} onChange={(v) => set('kieu_hoa', v)} />
      <Row label="20. Màu sắc cánh hoa (trắng/vàng/tím/đỏ/hồng/...)" value={d.mau_sac_canh_hoa} onChange={(v) => set('mau_sac_canh_hoa', v)} />
      <Row label="21. Hình dạng hoa (hình chuông/hình phễu/hình ống/hình nhạc/hình đĩa/hình bánh xè/...)" value={d.hinh_dang_hoa} onChange={(v) => set('hinh_dang_hoa', v)} />
      <Row label="22. Bầu (thượng/trung/hạ)" value={d.bau} onChange={(v) => set('bau', v)} />
      <Row label="23. Mùi hoa (không mùi/nhẹ/trung bình/nặng/...)" value={d.mui_hoa} onChange={(v) => set('mui_hoa', v)} />
      <Row label="24. Hình dạng quả (quan sát 5 quả, khi trưởng thành) (hình thoi/tròn/tròn dẹt/...)" value={d.hinh_dang_qua} onChange={(v) => set('hinh_dang_qua', v)} />
      <Row label="25. Loại quả (nang/kén/mọng/hạch/...)" value={d.loai_qua} onChange={(v) => set('loai_qua', v)} />
      <Row label="26. Số hạt trên quả (đếm trung bình 5 quả, n = 5)" value={d.so_hat_tren_qua} onChange={(v) => set('so_hat_tren_qua', v)} />
      <Row label="27. Dạng hạt (hình tròn/hình cầu/hình trứng/dẹt hình thận/...)" value={d.dang_hat} onChange={(v) => set('dang_hat', v)} />
      <Row label="28. Bề mặt hạt (trơn/sần sùi/có lông/...)" value={d.be_mat_hat} onChange={(v) => set('be_mat_hat', v)} />

      <SubTitle>B. Dữ liệu mô tả đặc điểm sinh học, sinh thái</SubTitle>
      <Row label="29. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
      <Row label="30. Đất, thổ nhưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
      <Row label="31. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
      <Row label="32. Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />

      <SubTitle>C. Dữ liệu mô tả đặc điểm sinh trưởng, phát triển</SubTitle>
      <Row label="33. Hình thức sinh trưởng (liên tục/nhịp điệu/...)" value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
      <Row label="34. Tỷ lệ nảy mầm (<50%/50–80%/>80%)" value={d.ti_le_nay_mam} onChange={(v) => set('ti_le_nay_mam', v)} />
      <Row label="35. Điều kiện nảy mầm (gieo trực tiếp/ủ/ổ ấm/...)" value={d.dieu_kien_nay_mam} onChange={(v) => set('dieu_kien_nay_mam', v)} />
      <Row label="36. Thời vụ gieo trồng (xuân/thu/xuân hè/thu đông/quanh năm/...)" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
      <Row label="37. Thời gian từ khi gieo đến khi mọc (ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
      <Row label="38. Thời gian từ trồng đến ra hoa, kết quả (năm)" value={d.thoi_gian_gieo_hoa} onChange={(v) => set('thoi_gian_gieo_hoa', v)} />
      <Row label="39. Thời gian từ trồng đến thu hoạch (năm)" value={d.thoi_gian_gieo_qua} onChange={(v) => set('thoi_gian_gieo_qua', v)} />

      <SectionTitle>III. Ghi chú</SectionTitle>
      <div className="py-2">
        <p className="text-xs text-gray-500 mb-1">(Quan sát khả năng chống chịu sinh thái bất thuận, khả năng kháng sâu/bệnh)</p>
        <textarea rows={3} value={d.ghi_chu} onChange={(e) => set('ghi_chu', e.target.value)}
          className="w-full border border-gray-200 rounded p-1.5 text-sm resize-none focus:outline-none focus:border-green-500 bg-gray-50" />
      </div>

      <SectionTitle>IV. Tài liệu tham khảo</SectionTitle>
      <div className="py-2">
        <p className="text-xs text-gray-500 mb-1">(Liệt kê danh mục tài liệu tham khảo để thực hiện Phiếu mô tả đánh giá ban đầu nguồn gen)</p>
        <textarea rows={3} value={d.tai_lieu_tham_khao} onChange={(e) => set('tai_lieu_tham_khao', e.target.value)}
          className="w-full border border-gray-200 rounded p-1.5 text-sm resize-none focus:outline-none focus:border-green-500 bg-gray-50" />
      </div>
    </div>
  );
}

"use client";

import { Form3Data, defaultForm3 } from "@/data/extendedTypes";
import AutoTextarea from "@/components/AutoTextarea";

interface Props {
  ma: string;
  onMaChange: (v: string) => void;
  nhom?: string;
  phan_nhom?: string;
  data: Partial<Form3Data>;
  onChange: (updated: Partial<Form3Data>) => void;
}

const Row = ({ label, value, onChange, rows, bold }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; bold?: boolean;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
    <label className={`text-sm pt-1.5 ${bold ? 'font-semibold text-gray-700' : 'text-gray-600'}`}>{label}</label>
    <div className="sm:col-span-2">
      {rows ? (
        <AutoTextarea minRows={rows} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-base sm:text-sm bg-transparent" />
      ) : (
        <AutoTextarea minRows={1} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-base sm:text-sm bg-transparent" />
      )}
    </div>
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

const PairRow = ({ label1, value1, onChange1, label2, value2, onChange2 }: {
  label1: string; value1: string; onChange1: (v: string) => void;
  label2: string; value2: string; onChange2: (v: string) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 py-2 border-b border-gray-100">
    <div>
      <label className="text-sm text-gray-600">{label1}</label>
      <AutoTextarea minRows={1} value={value1} onChange={(e) => onChange1(e.target.value)}
        className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-base sm:text-sm bg-transparent mt-0.5" />
    </div>
    <div>
      <label className="text-sm text-gray-600">{label2}</label>
      <AutoTextarea minRows={1} value={value2} onChange={(e) => onChange2(e.target.value)}
        className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-base sm:text-sm bg-transparent mt-0.5" />
    </div>
  </div>
);

const TriRow = ({ label, label1, value1, onChange1, label2, value2, onChange2, label3, value3, onChange3 }: {
  label: string;
  label1: string; value1: string; onChange1: (v: string) => void;
  label2: string; value2: string; onChange2: (v: string) => void;
  label3: string; value3: string; onChange3: (v: string) => void;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1.5">{label}</label>
    <div className="sm:col-span-2">
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-0.5">{label1}</p>
          <AutoTextarea minRows={1} value={value1} onChange={(e) => onChange1(e.target.value)}
            className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-base sm:text-sm bg-transparent" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-0.5">{label2}</p>
          <AutoTextarea minRows={1} value={value2} onChange={(e) => onChange2(e.target.value)}
            className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-base sm:text-sm bg-transparent" />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-400 mb-0.5">{label3}</p>
        <AutoTextarea minRows={1} value={value3} onChange={(e) => onChange3(e.target.value)}
          className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-base sm:text-sm bg-transparent" />
      </div>
    </div>
  </div>
);

const DualRow = ({ label, value1, onChange1, label1, value2, onChange2, label2 }: {
  label: string;
  value1: string; onChange1: (v: string) => void; label1: string;
  value2: string; onChange2: (v: string) => void; label2: string;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 items-start py-2 border-b border-gray-100">
    <label className="text-sm text-gray-600 pt-1.5">{label}</label>
    <div className="sm:col-span-2 flex gap-3">
      <div className="flex-1">
        <p className="text-xs text-gray-400 mb-0.5">{label1}</p>
        <AutoTextarea minRows={1} value={value1} onChange={(e) => onChange1(e.target.value)}
          className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-base sm:text-sm bg-transparent" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400 mb-0.5">{label2}</p>
        <AutoTextarea minRows={1} value={value2} onChange={(e) => onChange2(e.target.value)}
          className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-base sm:text-sm bg-transparent" />
      </div>
    </div>
  </div>
);

export default function Form3InitialAssessment({ ma, onMaChange, nhom, phan_nhom, data, onChange }: Props) {
  const d = { ...defaultForm3(), ...data };
  const set = (f: keyof Form3Data, v: string) => onChange({ ...d, [f]: v });

  const isTT = nhom === 'TT';
  const isTTCayAnQua = isTT && phan_nhom === 'Cây ăn quả';
  const isTTCayche = isTT && phan_nhom === 'Cây chè';
  const isTTCaycoi = isTT && phan_nhom === 'Cây cói';
  const isTTCaylaycu = isTT && phan_nhom === 'Cây lấy củ';
  const isTTCaymia = isTT && phan_nhom === 'Cây mía';
  const isTTCayngo = isTT && phan_nhom === 'Cây ngô';
  const isTTCayrau = isTT && phan_nhom === 'Cây rau';
  const isTTThuocla = isTT && phan_nhom === 'Thuốc lá';
  const isLN = nhom === 'LN';
  const isDL = !nhom || nhom === 'DL';
  const isCN = nhom === 'CN';
  const isCNGiaCam = nhom === 'CN' && phan_nhom === 'Gia cầm và chim';
  const isCNGSGam = nhom === 'CN' && phan_nhom === 'GS nhai lại, gặm nhấm';
  const isCNThuyCam = nhom === 'CN' && phan_nhom === 'Thủy cầm';
  const isCNTieuGiaSuc = nhom === 'CN' && phan_nhom === 'Tiểu gia súc';
  const isLNCayDacSan = nhom === 'LN' && phan_nhom === 'Cây đặc sản';
  const isLNTreNua = nhom === 'LN' && phan_nhom === 'Tre nứa';
  const isTS = nhom === 'TS';
  const isTSCa = isTS && phan_nhom === 'Cá';
  const isTSGiapXac = isTS && phan_nhom === 'Giáp xác';
  const isTSOc = isTS && phan_nhom === 'Ốc';
  const isTSThanMem = isTS && phan_nhom === 'Thân mềm';
  const isVS = nhom === 'VS';

  return (
    <div className="text-sm">
      <SectionTitle>I. Thông tin chung</SectionTitle>
      <Row label="1. Mã số hệ thống" value={d.ma_so_he_thong} onChange={(v) => set('ma_so_he_thong', v)} />
      <Row label="2. Mã số nhiệm vụ" value={d.ma_so_nhiem_vu} onChange={(v) => set('ma_so_nhiem_vu', v)} />
      <Row label="3. Mã nguồn gen" value={ma} onChange={onMaChange} />
      <Row label="4. Tên giống" value={d.ten_giong} onChange={(v) => set('ten_giong', v)} />
      <Row label="5. Nguồn giống (nguồn giống đem nhân)" value={d.nguon_giong} onChange={(v) => set('nguon_giong', v)} />
      <Row label="6. Nơi nhân giống/nuôi/trồng/cấp giống" value={d.noi_nhan_giong} onChange={(v) => set('noi_nhan_giong', v)} />
      <Row label="7. Người mô tả, đánh giá" value={d.nguoi_mo_ta} onChange={(v) => set('nguoi_mo_ta', v)} />
      <Row label="8. Cơ quan mô tả, đánh giá" value={d.co_quan_mo_ta} onChange={(v) => set('co_quan_mo_ta', v)} />

      <SectionTitle>II. Dữ liệu mô tả và đánh giá ban đầu</SectionTitle>

      <SubTitle>A. Dữ liệu mô tả đặc điểm hình thái</SubTitle>
      {!isLNCayDacSan && !isTTCaylaycu && !isTTCaymia && !isTTCayngo && (
        <>
          <SubLabel>- Đặc điểm chung</SubLabel>
          <Row label="9." value={d.dac_diem_chung} onChange={(v) => set('dac_diem_chung', v)} rows={2} bold />
        </>
      )}

      {/* ── TT: Cây ăn quả (Bảng CAQ) ── */}
      {isTTCayAnQua && (
        <>
          <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <Row label="10. Dạng thân" value={d.dang_cay} onChange={(v) => set('dang_cay', v)} />
          <Row label="11. Chiều cao thân" value={d.chieu_cao_cay} onChange={(v) => set('chieu_cao_cay', v)} />
          <Row label="12. Đường kính thân" value={d.duong_kinh_than} onChange={(v) => set('duong_kinh_than', v)} />
          <Row label="13. Sắc tố cành non (xanh vàng/gi sắt/xanh lục/tím/ ...)" value={d.ln_sac_to_canh_non} onChange={(v) => set('ln_sac_to_canh_non', v)} />
          <Row label="14. Lông ở cành non (có/không)" value={d.ln_long_canh_non} onChange={(v) => set('ln_long_canh_non', v)} />
          <Row label="15. Chiều cao phân cành" value={d.caq_chieu_cao_phan_canh} onChange={(v) => set('caq_chieu_cao_phan_canh', v)} />
          <Row label="16. Hình thái tán cây (tròn/trứng/trứng ngược/mâm xôi/ ...)" value={d.ln_hinh_thai_tan} onChange={(v) => set('ln_hinh_thai_tan', v)} />
          <Row label="17. Đường kính tán" value={d.ln_duong_kinh_tan} onChange={(v) => set('ln_duong_kinh_tan', v)} />
          <Row label="18. Hình dạng lá" value={d.ln_hinh_dang_la} onChange={(v) => set('ln_hinh_dang_la', v)} />
          <Row label="19. Kiểu lá (đơn/kép lông chim 1-2 lần lẻ/kép lông chim 1-2 lần chẵn/kép chân vịt/ ...)" value={d.ln_kieu_la} onChange={(v) => set('ln_kieu_la', v)} />
          <Row label="20. Cuống lá (có/không)" value={d.ln_cuong_la} onChange={(v) => set('ln_cuong_la', v)} />
          <DualRow label="21. Kích thước lá" label1="Dài(cm)" value1={d.ln_kich_thuoc_la} onChange1={(v) => set('ln_kich_thuoc_la', v)} label2="Rộng(cm)" value2={d.ln_kich_thuoc_la_rong} onChange2={(v) => set('ln_kich_thuoc_la_rong', v)} />
          <Row label="22. Gân lá (song song/hình lông chim/hình chân vịt/ ...)" value={d.ln_gan_la} onChange={(v) => set('ln_gan_la', v)} />
          <Row label="23. Màu lá (xanh thẫm/xanh nhạt/xanh tím/ ...)" value={d.ln_mau_la} onChange={(v) => set('ln_mau_la', v)} />
          <Row label="24. Màu lá non (xanh vàng/ xanh nhạt/ tím/ ...)" value={d.ln_mau_la_non} onChange={(v) => set('ln_mau_la_non', v)} />
          <Row label="25. Mép lá (liền/lượn sóng, răng cưa/xẻ thùy/ ...)" value={d.ln_mep_la} onChange={(v) => set('ln_mep_la', v)} />
          <Row label="26. Đầu lá (nhọn/tù/tròn/ ...)" value={d.ln_dau_la} onChange={(v) => set('ln_dau_la', v)} />
          <Row label="27. Đuôi lá (hình nêm/tròn/góc tù/hình khiên/ ...)" value={d.ln_duoi_la} onChange={(v) => set('ln_duoi_la', v)} />
          <Row label="28. Xắp xếp lá (mọc cách, mọc đối/mọc vòng/ mọc cụm/ ...)" value={d.ln_sap_xep_la} onChange={(v) => set('ln_sap_xep_la', v)} />
          <Row label="29. Kiểu hoa (đơn/phức/tự đơn trục/tự hợp trục/tự hỗn hợp/ ...)" value={d.ln_kieu_hoa} onChange={(v) => set('ln_kieu_hoa', v)} />
          <Row label="30. Kiểu đính hoa (nách lá/ngọn cành/đôi lá/ ...)" value={d.ln_kieu_dinh_hoa} onChange={(v) => set('ln_kieu_dinh_hoa', v)} />
          <Row label="31. Kích thước đường kính hoa (mm)" value={d.ln_kich_thuoc_hoa} onChange={(v) => set('ln_kich_thuoc_hoa', v)} />
          <Row label="32. Hình dạng hoa (hình chuông/hình phễu/hình ống/hình đĩa/ ...)" value={d.ln_hinh_dang_hoa} onChange={(v) => set('ln_hinh_dang_hoa', v)} />
          <Row label="33. Để hoa (phẳng/lồi/lõm/ ...)" value={d.ln_de_hoa} onChange={(v) => set('ln_de_hoa', v)} />
          <Row label="34. Đài hoa (hình ống/hình chuông/hình bẹ/xẻ thùy/ ...)" value={d.ln_dai_hoa} onChange={(v) => set('ln_dai_hoa', v)} />
          <Row label="35. Tràng hoa (xếp vòng/xếp thìa/xếp vặn/ ....)" value={d.ln_trang_hoa} onChange={(v) => set('ln_trang_hoa', v)} />
          <Row label="36. Màu sắc tràng hoa (trắng/vàng/đỏ/hồng/tím/ ...)" value={d.ln_mau_sac_trang_hoa} onChange={(v) => set('ln_mau_sac_trang_hoa', v)} />
          <Row label="37. Nhị hoa (rời/hợp)" value={d.ln_nhi_hoa} onChange={(v) => set('ln_nhi_hoa', v)} />
          <Row label="38. Nhụy hoa (1 lá noãn/2 lá noãn/nhiều lá noãn/...)" value={d.ln_nhuy_hoa} onChange={(v) => set('ln_nhuy_hoa', v)} />
          <Row label="39. Mùi hoa (không mùi/mùi nhẹ/trung bình/mùi đậm)" value={d.ln_mui_hoa} onChange={(v) => set('ln_mui_hoa', v)} />
          <Row label="40. Hướng mọc của hoa (hướng lên/hướng xuống/thẳng đứng/ ...)" value={d.ln_huong_moc_hoa} onChange={(v) => set('ln_huong_moc_hoa', v)} />
          <Row label="41. Kiểu quả (quả đơn/quả kép/quả đại/quả phức/ ...)" value={d.ln_kieu_qua} onChange={(v) => set('ln_kieu_qua', v)} />
          <Row label="42. Loại quả (nhân/mọng/quả hạch/...)" value={d.ln_loai_qua} onChange={(v) => set('ln_loai_qua', v)} />
          <Row label="43. Hình dạng quả (hình thoi/hình tròn/dẹt/...)" value={d.ln_hinh_dang_qua} onChange={(v) => set('ln_hinh_dang_qua', v)} />
          <DualRow label="44. Kích thước quả" label1="Dài(cm)" value1={d.ln_kich_thuoc_qua} onChange1={(v) => set('ln_kich_thuoc_qua', v)} label2="Rộng(cm)" value2={d.ln_kich_thuoc_qua_rong} onChange2={(v) => set('ln_kich_thuoc_qua_rong', v)} />
          <Row label="45. Màu sắc vỏ quả (đỏ/vàng/tím/nâu/ ...)" value={d.ln_mau_vo_qua} onChange={(v) => set('ln_mau_vo_qua', v)} />
          <Row label="46. Số hạt / quả (TB)" value={d.ln_so_hat_qua} onChange={(v) => set('ln_so_hat_qua', v)} />
          <Row label="47. Hình dạng hạt (tròn dẹt/hình cầu/hình trứng/ ...)" value={d.ln_dang_hat} onChange={(v) => set('ln_dang_hat', v)} />
          <Row label="48. Bề mặt hạt (trơn, sần sùi/có lông/ ..)" value={d.ln_be_mat_hat} onChange={(v) => set('ln_be_mat_hat', v)} />
          <Row label="49. Màu hạt (vàng/nâu/nâu vàng/đỏ/ ...)" value={d.ln_mau_hat} onChange={(v) => set('ln_mau_hat', v)} />
          <DualRow label="50. Kích thước hạt" label1="Dài(cm)" value1={d.ln_kich_thuoc_hat} onChange1={(v) => set('ln_kich_thuoc_hat', v)} label2="Rộng hoặc đường kính(cm)" value2={d.ln_kich_thuoc_hat_rong} onChange2={(v) => set('ln_kich_thuoc_hat_rong', v)} />
          <Row label="51. Trọng lượng 1000 hạt (kg)" value={d.ln_trong_luong_1000_hat} onChange={(v) => set('ln_trong_luong_1000_hat', v)} />
          <Row label="52. Cấu tạo cây mầm (1 lá mầm/2 lá mầm/ nhiều lá mầm)" value={d.ln_cau_tao_cay_mam} onChange={(v) => set('ln_cau_tao_cay_mam', v)} />
        </>
      )}

      {/* ── TT: Cây chè / Thuốc lá ── */}
      {(isTTCayche || isTTThuocla) && (
        <>
          <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <Row label="10. Các dạng thân (thân gỗ/thâm nửa gỗ/thân bụi/...)" value={d.dang_cay} onChange={(v) => set('dang_cay', v)} />
          <Row label="11. Chiều cao thân" value={d.chieu_cao_cay} onChange={(v) => set('chieu_cao_cay', v)} />
          <Row label="12. Hình dạng lá" value={d.ln_hinh_dang_la} onChange={(v) => set('ln_hinh_dang_la', v)} />
          <DualRow label="13. Kích thước lá" label1="Chiều dài(cm)" value1={d.ln_kich_thuoc_la} onChange1={(v) => set('ln_kich_thuoc_la', v)} label2="Chiều rộng(cm)" value2={d.ln_kich_thuoc_la_rong} onChange2={(v) => set('ln_kich_thuoc_la_rong', v)} />
          <Row label="14. Kiểu lá (đơn/kép lông chim 1-2 lần chẵn/... lẻ/ kép chân vịt/ ...)" value={d.ln_kieu_la} onChange={(v) => set('ln_kieu_la', v)} />
          <Row label="15. Màu lá (xanh sáng/xanh vàng/xanh đậm/...)" value={d.ln_mau_la} onChange={(v) => set('ln_mau_la', v)} />
          <Row label="16. Đầu lá (nhọn/nhọn gấp/tù/tròn/...)" value={d.ln_dau_la} onChange={(v) => set('ln_dau_la', v)} />
          <Row label="17. Đuôi lá (hình nêm/tròn/tù/nhọn/...)" value={d.ln_duoi_la} onChange={(v) => set('ln_duoi_la', v)} />
          <Row label="18. Sắp xếp lá (mọc cách/mọc đối/mọc vòng/mọc cụm/...)" value={d.ln_sap_xep_la} onChange={(v) => set('ln_sap_xep_la', v)} />
          <Row label="19. Góc lá (đứng/ngang/rũ xuống/...)" value={d.tt_goc_la} onChange={(v) => set('tt_goc_la', v)} />
          <Row label="20. Mép lá (liền/lượn sóng/răng cưa/xẻ thùy)" value={d.ln_mep_la} onChange={(v) => set('ln_mep_la', v)} />
          <Row label="21. Kiểu hoa (đơn tính/lưỡng tính/ ...)" value={d.ln_kieu_hoa} onChange={(v) => set('ln_kieu_hoa', v)} />
          <Row label="22. Kiểu đính hoa (nách lá/ngọn cành/đối lá/...)" value={d.ln_kieu_dinh_hoa} onChange={(v) => set('ln_kieu_dinh_hoa', v)} />
          <Row label="23. Màu sắc tràng hoa (trắng/vàng/đỏ/hồng/tím/...)" value={d.ln_mau_sac_trang_hoa} onChange={(v) => set('ln_mau_sac_trang_hoa', v)} />
          <Row label="24. Nhụy hoa (1 lá noãn/2 lá noãn/nhiều lá noãn)" value={d.ln_nhuy_hoa} onChange={(v) => set('ln_nhuy_hoa', v)} />
          <Row label="25. Mùi hoa (không mùi/mùi nhẹ/trung bình/mùi đậm)" value={d.ln_mui_hoa} onChange={(v) => set('ln_mui_hoa', v)} />
          <Row label="26. Kiểu quả (đơn khô/quả kép/quả đại/quả phức/...)" value={d.ln_kieu_qua} onChange={(v) => set('ln_kieu_qua', v)} />
          <Row label="27. Loại quả (nhân/mọng/hạch/nang/...)" value={d.ln_loai_qua} onChange={(v) => set('ln_loai_qua', v)} />
          <Row label="28. Số hạt trên quả Hạt/quả (TB)" value={d.ln_so_hat_qua} onChange={(v) => set('ln_so_hat_qua', v)} />
          <Row label="29. Màu hạt (vàng rơm/vàng/nâu/...)" value={d.ln_mau_hat} onChange={(v) => set('ln_mau_hat', v)} />
          <Row label="30. Độ thụ phấn của bông hoa (hữu thụ cao >90%/hữu thụ 75–90%/hữu thụ bộ phận 50–74%/bất thụ cao <50%/bất thụ hoàn toàn 0%)" value={d.tt_do_thu_phan_bong} onChange={(v) => set('tt_do_thu_phan_bong', v)} />
          <Row label="31. Trọng lượng 1000 hạt (kg)" value={d.ln_trong_luong_1000_hat} onChange={(v) => set('ln_trong_luong_1000_hat', v)} />
        </>
      )}

      {/* ── TT: Cây cói ── */}
      {isTTCaycoi && (
        <>
          <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <Row label="10. Cao cây (cm, n=5)" value={d.chieu_cao_cay} onChange={(v) => set('chieu_cao_cay', v)} />
          <Row label="11. Chiều cao đóng bắp (cm, n=5)" value={d.coi_chieu_cao_dong_bap} onChange={(v) => set('coi_chieu_cao_dong_bap', v)} />
          <Row label="12. Số lá/cây (n=5)" value={d.coi_so_la} onChange={(v) => set('coi_so_la', v)} />
          <Row label="13. Màu lá (trắng/xanh đậm/vàng/nâu/tims/ ...)" value={d.ln_mau_la} onChange={(v) => set('ln_mau_la', v)} />
          <Row label="14. Màu gân lá (trắng/xanh đậm/vàng/nâu/tims/ ...)" value={d.coi_mau_gan_la} onChange={(v) => set('coi_mau_gan_la', v)} />
          <Row label="15. Số ngày từ mọc đến 50% cây ra hoa" value={d.coi_so_ngay_ra_hoa} onChange={(v) => set('coi_so_ngay_ra_hoa', v)} />
          <Row label="16. Phản ứng ánh sáng (mẫn cảm/trung gian/không mẫn cảm)" value={d.coi_phan_ung_anh_sang} onChange={(v) => set('coi_phan_ung_anh_sang', v)} />
          <Row label="17. Số hoa trên thân chính cây (n=5)" value={d.coi_so_hoa} onChange={(v) => set('coi_so_hoa', v)} />
          <Row label="18. Sự nở hoa đồng thời (đồng thời/không đồng thời)" value={d.coi_su_no_hoa} onChange={(v) => set('coi_su_no_hoa', v)} />
          <Row label="19. Độ trỗ thoát (vừa thoát/thoát/thoát rất tốt/thoát và gục xuống/...)" value={d.coi_do_tro_thoat} onChange={(v) => set('coi_do_tro_thoat', v)} />
          <Row label="20. Khả năng chống đổ (khỏe/trung bình/yếu)" value={d.coi_kha_nang_chong_do} onChange={(v) => set('coi_kha_nang_chong_do', v)} />
          <DualRow label="21. Độ tàn lá (muộn và chậm/trung bình/sớm và nhanh)" label1="Dài(cm)" value1={d.coi_do_tan_la_dai} onChange1={(v) => set('coi_do_tan_la_dai', v)} label2="Rộng" value2={d.coi_do_tan_la_rong} onChange2={(v) => set('coi_do_tan_la_rong', v)} />
          <Row label="22. Màu sắc thân (xám nâu/nâu/xám vàng/ ...)" value={d.mau_sac_than} onChange={(v) => set('mau_sac_than', v)} />
          <Row label="23. Phân nhánh thứ cấp trên hoa" value={d.tt_phan_nhanh_thu_cap} onChange={(v) => set('tt_phan_nhanh_thu_cap', v)} />
          <Row label="24. Độ thoát cổ hoa (thoát hoàn toàn/trung bình/thoát một phần/không thoát/ ...)" value={d.tt_do_thoat_co_bong} onChange={(v) => set('tt_do_thoat_co_bong', v)} />
          <Row label="25. Trục bông (thẳng đứng/uốn xuống)" value={d.tt_truc_bong} onChange={(v) => set('tt_truc_bong', v)} />
          <Row label="26. Độ tàn lá (muộn và chậm/trung bình/sớm và nhanh)" value={d.tt_do_tan_la} onChange={(v) => set('tt_do_tan_la', v)} />
          <Row label="27. Độ rụng hạt" value={d.tt_do_rung_hat} onChange={(v) => set('tt_do_rung_hat', v)} />
          <Row label="28. Màu hạt (trắng/nâu/đỉnh đỏ/đỉnh tím/ ...)" value={d.ln_mau_hat} onChange={(v) => set('ln_mau_hat', v)} />
          <Row label="29. Độ phủ lông vỏ hạt (nhẵn/có lông/ ...)" value={d.ln_be_mat_hat} onChange={(v) => set('ln_be_mat_hat', v)} />
          <Row label="30. Độ thụ phấn của bông (hữu thụ cao >90%/hữu thụ 75–90%/hữu thụ bộ phận 50–74%/bất thụ cao <50%/bất thụ hoàn toàn 0%)" value={d.tt_do_thu_phan_bong} onChange={(v) => set('tt_do_thu_phan_bong', v)} />
          <Row label="31. Trọng lượng 1000 hạt (kg)" value={d.ln_trong_luong_1000_hat} onChange={(v) => set('ln_trong_luong_1000_hat', v)} />
        </>
      )}

      {/* ── TT: Cây lấy củ ── */}
      {isTTCaylaycu && (
        <>
          <SubLabel>- Đặc điểm chung</SubLabel>
          <Row label="9. Thuộc tính mới" value={d.dac_diem_chung} onChange={(v) => set('dac_diem_chung', v)} rows={2} />
          <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <Row label="10. Hình thành dài bò (không có/có nhiều/có một phần/...)" value={d.lcu_hinh_thanh_dai_bo} onChange={(v) => set('lcu_hinh_thanh_dai_bo', v)} />
          <Row label="11. Số lượng dài bò" value={d.lcu_so_luong_dai_bo} onChange={(v) => set('lcu_so_luong_dai_bo', v)} />
          <Row label="12. Hình thành củ nhánh (không/có)" value={d.lcu_hinh_thanh_cu_nhanh} onChange={(v) => set('lcu_hinh_thanh_cu_nhanh', v)} />
          <Row label="13. Số lượng chồi bên (n=5)" value={d.lcu_so_luong_choi_ben} onChange={(v) => set('lcu_so_luong_choi_ben', v)} />
          <Row label="14. Chiều cao cây (lùn <50cm/trung bình 50-100cm/cao 100-150cm/rất cao >150cm)" value={d.chieu_cao_cay} onChange={(v) => set('chieu_cao_cay', v)} />
          <Row label="15. Dạng lá phổ biến (phẳng/thùy rũ/phẳng mép rũ xuống/hình cốc/hình ô/ ...)" value={d.lcu_dang_la} onChange={(v) => set('lcu_dang_la', v)} />
          <Row label="16. Hướng phiến lá (hướng lên/hướng xuống/ngang/...)" value={d.lcu_huong_phien_la} onChange={(v) => set('lcu_huong_phien_la', v)} />
          <Row label="17. Mép lá (nguyên/gợn sóng/ ...)" value={d.lcu_mep_la} onChange={(v) => set('lcu_mep_la', v)} />
          <Row label="18. Dài phiến lá (cm, n=5)" value={d.lcu_dai_phien_la} onChange={(v) => set('lcu_dai_phien_la', v)} />
          <Row label="19. Rộng phiến lá (cm, n=5)" value={d.lcu_rong_phien_la} onChange={(v) => set('lcu_rong_phien_la', v)} />
          <Row label="20. Dài cuống lá (cm, n=5)" value={d.lcu_dai_cuong_la} onChange={(v) => set('lcu_dai_cuong_la', v)} />
          <Row label="21. Màu đường viền mép lá (xanh/nhạt/tím/đỏ/vàng nhạt/ ...)" value={d.lcu_mau_vien_mep_la} onChange={(v) => set('lcu_mau_vien_mep_la', v)} />
          <Row label="22. Màu phiến lá (xanh nhạt/xanh đậm/vàng/tím nhạt/ tím/ ...)" value={d.lcu_mau_phien_la} onChange={(v) => set('lcu_mau_phien_la', v)} />
          <Row label="23. Đốm lá (có/không)" value={d.lcu_dom_la} onChange={(v) => set('lcu_dom_la', v)} />
          <Row label="24. Độ dày phiến lá (mỏng <0.4 mm/dày >0,4mm/đan xen dày,mỏng/ ...)" value={d.lcu_do_day_phien_la} onChange={(v) => set('lcu_do_day_phien_la', v)} />
          <Row label="25. Màu rốn lá (trắng/vàng/xanh nhạt/đỏ/tím/ ...)" value={d.lcu_mau_ron_la} onChange={(v) => set('lcu_mau_ron_la', v)} />
          <Row label="26. Số gân thứ cấp nối với gân chính tại rốn lá (không có/ hai/ bốn/ ...)" value={d.lcu_so_gan_thu_cap} onChange={(v) => set('lcu_so_gan_thu_cap', v)} />
          <Row label="27. Góc chữ V, đo 10cm từ gân chính (cm, n=5)" value={d.lcu_goc_chu_v} onChange={(v) => set('lcu_goc_chu_v', v)} />
          <Row label="28. Vị trí đường viền mép lá (khoảng cách bằng nhau/khoảng cách thay đổi)" value={d.lcu_vi_tri_vien_mep} onChange={(v) => set('lcu_vi_tri_vien_mep', v)} />
          <Row label="29. Màu sắc gân mặt trên của lá (giống màu lá/nhạt hơn/ đậm hơn/ ...)" value={d.lcu_mau_gan_mat_tren} onChange={(v) => set('lcu_mau_gan_mat_tren', v)} />
          <Row label="30. Màu sắc gân mặt dưới của lá (giống màu lá/nhạt hơn/ đậm hơn/ ...)" value={d.lcu_mau_gan_mat_duoi} onChange={(v) => set('lcu_mau_gan_mat_duoi', v)} />
          <Row label="31. Gân chính và gân phụ (tách rời và có khoảng cách/nối dưới, không nối trên/nối cả 2 mặt/ ...)" value={d.lcu_gan_chinh_phu} onChange={(v) => set('lcu_gan_chinh_phu', v)} />
          <Row label="32. Độ sâu của gian thùy (n=5)" value={d.lcu_do_sau_gian_thuy} onChange={(v) => set('lcu_do_sau_gian_thuy', v)} />
          <Row label="33. Điểm nối từ gân chính đến đáy thùy lá" value={d.lcu_diem_noi_gan_day} onChange={(v) => set('lcu_diem_noi_gan_day', v)} />
          <Row label="34. Hình dạng gốc thùy (hẹp, đỉnh nhọn <45o/rộng, đỉnh nhọn >45o/rộng tròn/hẹp tròn/...)" value={d.lcu_hinh_dang_goc_thuy} onChange={(v) => set('lcu_hinh_dang_goc_thuy', v)} />
          <Row label="35. Màu dọc lá (xanh nhạt/xanh đậm/đỏ/tím/nâu/ ...)" value={d.lcu_mau_doc_la} onChange={(v) => set('lcu_mau_doc_la', v)} />
          <Row label="36. Sự biến đổi màu trên dọc lá (Không đổi/sọc đỏ/mặt trên đậm hơn/sọc xanh nhạt/ ...)" value={d.lcu_bien_doi_mau} onChange={(v) => set('lcu_bien_doi_mau', v)} />
          <Row label="37. Phấn trên cuống lá (có/không)" value={d.lcu_phan_cuong_la} onChange={(v) => set('lcu_phan_cuong_la', v)} />
          <Row label="38. Dài bẹ cuống lá (cm, n=5)" value={d.lcu_dai_be_cuong_la} onChange={(v) => set('lcu_dai_be_cuong_la', v)} />
          <Row label="39. Màu mép bẹ lá (giống màu dọc lá/ nhạt hơn/đậm hơn/hồng/đỏ/tím/ ...)" value={d.lcu_mau_mep_be_la} onChange={(v) => set('lcu_mau_mep_be_la', v)} />
          <Row label="40. Hình dạng bẹ ở vị trí cắt ngang (mở/đóng)" value={d.lcu_hinh_dang_be} onChange={(v) => set('lcu_hinh_dang_be', v)} />
          <Row label="41. Dạng củ cái (không phân nhánh/phân nhánh/phân nhánh ở đầu củ/nhiều đỉnh củ/cụm/ ...)" value={d.lcu_dang_cu_cai} onChange={(v) => set('lcu_dang_cu_cai', v)} />
          <Row label="42. Dài củ cái (cm, n=5)" value={d.lcu_dai_cu_cai} onChange={(v) => set('lcu_dai_cu_cai', v)} />
          <Row label="43. Rộng củ cái (cm, n=5)" value={d.lcu_rong_cu_cai} onChange={(v) => set('lcu_rong_cu_cai', v)} />
          <Row label="44. Khối lượng củ cái (rất nhỏ <0.25kg/nhỏ 0.25-0.5kg/trung bình 0.25-2kg/lớn 2-4kg/rất lớn >4kg)" value={d.lcu_khoi_luong_cu_cai} onChange={(v) => set('lcu_khoi_luong_cu_cai', v)} />
          <Row label="45. Màu thịt củ (trắng/vàng/da cam/đỏ/tím/ ...)" value={d.lcu_mau_thit_cu_cai} onChange={(v) => set('lcu_mau_thit_cu_cai', v)} />
          <Row label="46. Màu xơ củ cái (vàng/da cam/đỏ/tím/ ...)" value={d.lcu_mau_xo_cu_cai} onChange={(v) => set('lcu_mau_xo_cu_cai', v)} />
          <Row label="47. Số củ con (< 5/từ 5-10/> 10)" value={d.lcu_so_cu_con} onChange={(v) => set('lcu_so_cu_con', v)} />
          <Row label="48. Khối lượng củ con (rất nhỏ <50g/nhỏ 50-100g/trung bình 100-250g/lớn 250-500g/rất lớn >500g)" value={d.lcu_khoi_luong_cu_con} onChange={(v) => set('lcu_khoi_luong_cu_con', v)} />
          <Row label="49. Sự sắp xếp củ (phân tán/thành cụm/ ...)" value={d.lcu_sap_xep_cu} onChange={(v) => set('lcu_sap_xep_cu', v)} />
          <Row label="50. Hình dạng củ con (hình cầu/hình trứng/hình trụ/e líp/hỗn hợp/ ...)" value={d.lcu_hinh_dang_cu_con} onChange={(v) => set('lcu_hinh_dang_cu_con', v)} />
          <Row label="51. Dài củ con (cm, n=5)" value={d.lcu_dai_cu_con} onChange={(v) => set('lcu_dai_cu_con', v)} />
          <Row label="52. Rộng củ con (cm, n=5)" value={d.lcu_rong_cu_con} onChange={(v) => set('lcu_rong_cu_con', v)} />
          <Row label="53. Màu thịt củ con (trắng/vàng/da cam/đỏ/tím/ ...)" value={d.lcu_mau_thit_cu_con} onChange={(v) => set('lcu_mau_thit_cu_con', v)} />
          <Row label="54. Màu xơ củ con (vàng/da cam/đỏ/tím/ ...)" value={d.lcu_mau_xo_cu_con} onChange={(v) => set('lcu_mau_xo_cu_con', v)} />
        </>
      )}

      {/* ── TT: Cây mía ── */}
      {isTTCaymia && (
        <>
          <SubLabel>- Đặc điểm chung</SubLabel>
          <Row label="9." value={d.dac_diem_chung} onChange={(v) => set('dac_diem_chung', v)} rows={2} bold />
          <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <Row label="10. Chiều cao cây" value={d.chieu_cao_cay} onChange={(v) => set('chieu_cao_cay', v)} />
          <Row label="11. Chiều dài lá" value={d.tt_chieu_dai_la} onChange={(v) => set('tt_chieu_dai_la', v)} />
          <Row label="12. Chiều rộng lá" value={d.tt_chieu_rong_la} onChange={(v) => set('tt_chieu_rong_la', v)} />
          <Row label="13. Độ phủ lông của lá (Trơn/trung bình/dày lông/ ...)" value={d.tt_do_phu_long_la} onChange={(v) => set('tt_do_phu_long_la', v)} />
          <Row label="14. Màu phiến lá (xanh nhạt/xanh/xanh đậm/tím/ ...)" value={d.tt_mau_phien_la} onChange={(v) => set('tt_mau_phien_la', v)} />
          <Row label="15. Màu bẹ lá (xanh/có sọc tím/tím nhạt/...)" value={d.tt_mau_be_la} onChange={(v) => set('tt_mau_be_la', v)} />
          <Row label="16. Dài thìa lìa" value={d.tt_dai_thia_lia} onChange={(v) => set('tt_dai_thia_lia', v)} />
          <Row label="17. Màu thìa lìa (trắng/sọc tím/tím/ ...)" value={d.tt_mau_thia_lia} onChange={(v) => set('tt_mau_thia_lia', v)} />
          <Row label="18. Dạng thìa lìa (nhọn đến hơi nhọn/hai lưỡi kim/chóp cụt/ ...)" value={d.tt_dang_thia_lia} onChange={(v) => set('tt_dang_thia_lia', v)} />
          <Row label="19. Màu cổ lá (xanh nhạt/xanh/tím/ ...)" value={d.tt_mau_co_la} onChange={(v) => set('tt_mau_co_la', v)} />
          <Row label="20. Màu tai lá (xanh nhạt/tím/ ...)" value={d.tt_mau_tai_la} onChange={(v) => set('tt_mau_tai_la', v)} />
          <Row label="21. Chiều dài lóng" value={d.tt_chieu_dai_than} onChange={(v) => set('tt_chieu_dai_than', v)} />
          <Row label="22. Đường kính lóng" value={d.tt_duong_kinh_ong_da} onChange={(v) => set('tt_duong_kinh_ong_da', v)} />
          <Row label="23. Độ cứng cây" value={d.tt_do_cung_cay} onChange={(v) => set('tt_do_cung_cay', v)} />
          <Row label="24. Dài hoa mía" value={d.tt_dai_bong} onChange={(v) => set('tt_dai_bong', v)} />
          <Row label="25. Phân nhánh thứ cấp trên hoa" value={d.tt_phan_nhanh_thu_cap} onChange={(v) => set('tt_phan_nhanh_thu_cap', v)} />
          <Row label="26. Độ thoát cổ hoa (thoát hoàn toàn/trung bình/thoát 1 phần/ không thoát được/...)" value={d.tt_do_thoat_co_bong} onChange={(v) => set('tt_do_thoat_co_bong', v)} />
          <Row label="27. Trục bông (thẳng đứng/uốn xuống/ ...)" value={d.tt_truc_bong} onChange={(v) => set('tt_truc_bong', v)} />
          <Row label="28. Độ tàn lá (muộn và chậm/trung bình/sớm và nhanh/ ...)" value={d.tt_do_tan_la} onChange={(v) => set('tt_do_tan_la', v)} />
          <Row label="29. Độ rụng hạt" value={d.tt_do_rung_hat} onChange={(v) => set('tt_do_rung_hat', v)} />
          <Row label="30. Màu hạt (trắng/nâu/đỏ/tím/...)" value={d.ln_mau_hat} onChange={(v) => set('ln_mau_hat', v)} />
          <Row label="31. Độ phủ lông vỏ hạt (nhẵn/có lông/lông ngắn/lông dài/...)" value={d.ln_be_mat_hat} onChange={(v) => set('ln_be_mat_hat', v)} />
          <Row label="32. Độ thụ phấn của bông (hữu thụ cao >90%/hữu thụ 75-90%/hữu thụ bộ phận 50-74%/bất thụ cao <50%/bất thụ hoàn toàn 0%)" value={d.tt_do_thu_phan_bong} onChange={(v) => set('tt_do_thu_phan_bong', v)} />
          <Row label="33. Trọng lượng 1000 hạt (kg)" value={d.ln_trong_luong_1000_hat} onChange={(v) => set('ln_trong_luong_1000_hat', v)} />
        </>
      )}

      {/* ── TT: Cây ngô — Section A is title only, no fields ── */}

      {/* ── TT: Cây rau ── */}
      {isTTCayrau && (
        <>
          <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <Row label="10. Dài lá mầm sau khi mọc 2 ngày (nhỏ <2cm/trung bình 2-4cm/rộng >4cm)" value={d.rau_dai_la_mam} onChange={(v) => set('rau_dai_la_mam', v)} />
          <Row label="11. Màu lá mầm (xanh nhạt/trung gian/xanh đậm/...)" value={d.rau_mau_la_mam} onChange={(v) => set('rau_mau_la_mam', v)} />
          <Row label="12. Dạng phiến lá (hình chân vịt/hình thận/hình tròn/khía tai bèo/...)" value={d.rau_dang_phien_la} onChange={(v) => set('rau_dang_phien_la', v)} />
          <Row label="13. Dài lá (cm, n=5)" value={d.ln_kich_thuoc_la} onChange={(v) => set('ln_kich_thuoc_la', v)} />
          <Row label="14. Rộng lá (cm, n=5)" value={d.ln_kich_thuoc_la_rong} onChange={(v) => set('ln_kich_thuoc_la_rong', v)} />
          <Row label="15. Màu sắc lá (xanh nhạt/xanh/xanh đậm)" value={d.ln_mau_la} onChange={(v) => set('ln_mau_la', v)} />
          <Row label="16. Mép lá (nhẵn/răng cưa/...)" value={d.ln_mep_la} onChange={(v) => set('ln_mep_la', v)} />
          <Row label="17. Lông mặt dưới lá (không có/thưa/trung bình/nhiều/...)" value={d.rau_long_mat_duoi_la} onChange={(v) => set('rau_long_mat_duoi_la', v)} />
          <Row label="18. Lông mặt trên lá (không có/thưa/trung bình/nhiều/...)" value={d.rau_long_mat_tren_la} onChange={(v) => set('rau_long_mat_tren_la', v)} />
          <Row label="19. Chiều dài đốt (Đo 3 đốt liên tiếp trên thân chính bắt đầu từ đốt có hoa đầu tiên cho 3 cây)" value={d.rau_chieu_dai_dot} onChange={(v) => set('rau_chieu_dai_dot', v)} />
          <Row label="20. Dạng thân (tròn/góc cạnh/trung gian)" value={d.rau_dang_than} onChange={(v) => set('rau_dang_than', v)} />
          <Row label="21. Tua cuốn (có/không có)" value={d.rau_tua_cuon} onChange={(v) => set('rau_tua_cuon', v)} />
          <Row label="22. Kiểu hoa (đơn/phức/tự hỗn hợp/...)" value={d.ln_kieu_hoa} onChange={(v) => set('ln_kieu_hoa', v)} />
          <Row label="23. Kiểu đính hoa (nách lá/ngọn cành/đối lá/...)" value={d.ln_kieu_dinh_hoa} onChange={(v) => set('ln_kieu_dinh_hoa', v)} />
          <Row label="24. Kích thước đường kính hoa (cm)" value={d.ln_kich_thuoc_hoa} onChange={(v) => set('ln_kich_thuoc_hoa', v)} />
          <Row label="25. Hình dạng hoa (hình chuông/hình phễu/hình ống/hình đĩa/...)" value={d.ln_hinh_dang_hoa} onChange={(v) => set('ln_hinh_dang_hoa', v)} />
          <Row label="26. Hướng mọc của hoa (hướng lên/hướng xuống/thẳng đứng/...)" value={d.ln_huong_moc_hoa} onChange={(v) => set('ln_huong_moc_hoa', v)} />
          <Row label="27. Số quả thu hoạch trên 1 cây" value={d.rau_so_qua} onChange={(v) => set('rau_so_qua', v)} />
          <Row label="28. Dài quả ở giai đoạn quả chín thương mại" value={d.rau_dai_qua_thuong_mai} onChange={(v) => set('rau_dai_qua_thuong_mai', v)} />
          <Row label="29. Đường kính quả (cm, n = 5)" value={d.rau_duong_kinh_qua} onChange={(v) => set('rau_duong_kinh_qua', v)} />
          <Row label="30. Khối lượng quả (gr, n = 5)" value={d.rau_khoi_luong_qua} onChange={(v) => set('rau_khoi_luong_qua', v)} />
          <Row label="31. Độ dày thịt quả (cm, n = 5)" value={d.rau_do_day_thit_qua} onChange={(v) => set('rau_do_day_thit_qua', v)} />
          <Row label="32. Dạng quả (thuôn/dài/cong cổ/...)" value={d.ln_hinh_dang_qua} onChange={(v) => set('ln_hinh_dang_qua', v)} />
          <Row label="33. Màu sắc chính của quả ở giai đoạn quả chín (trắng/xanh/đỏ/...)" value={d.ln_mau_vo_qua} onChange={(v) => set('ln_mau_vo_qua', v)} />
          <Row label="34. Vị của thịt quả (nhạt/trung bình/ngọt/chua/...)" value={d.rau_vi_thit_qua} onChange={(v) => set('rau_vi_thit_qua', v)} />
          <Row label="35. Màu quả ở giai đoạn chín (vàng/đỏ/nâu/tím/...)" value={d.rau_mau_qua_chin} onChange={(v) => set('rau_mau_qua_chin', v)} />
          <Row label="36. Năng suất quả tươi (kg/m2)" value={d.rau_nang_suat_qua_tuoi} onChange={(v) => set('rau_nang_suat_qua_tuoi', v)} />
          <Row label="37. Màu sắc hạt (trắng/vàng/nâu/...)" value={d.ln_mau_hat} onChange={(v) => set('ln_mau_hat', v)} />
          <Row label="38. Hình dạng hạt (bầu dục/tròn dẹt/cầu/...)" value={d.ln_dang_hat} onChange={(v) => set('ln_dang_hat', v)} />
          <Row label="39. Dài hạt (mm, n=5)" value={d.ln_kich_thuoc_hat} onChange={(v) => set('ln_kich_thuoc_hat', v)} />
          <Row label="40. Rộng hạt (mm, n=5)" value={d.ln_kich_thuoc_hat_rong} onChange={(v) => set('ln_kich_thuoc_hat_rong', v)} />
          <Row label="41. Khối lượng 100 hạt (gr, n = 3)" value={d.rau_khoi_luong_100_hat} onChange={(v) => set('rau_khoi_luong_100_hat', v)} />
        </>
      )}

      {/* ── TT: Nông nghiệp / Lúa (Bảng 02) ── */}
      {isTT && !isTTCayAnQua && !isTTCayche && !isTTCaycoi && !isTTCaylaycu && !isTTCaymia && !isTTCayngo && !isTTCayrau && !isTTThuocla && (
        <>
          <SubLabel>- Dữ liệu mô tả đặc điểm hình thái</SubLabel>
          <Row label="10. Chiều cao mạ" value={d.tt_chieu_cao_ma} onChange={(v) => set('tt_chieu_cao_ma', v)} />
          <Row label="11. Chiều dài lá" value={d.tt_chieu_dai_la} onChange={(v) => set('tt_chieu_dai_la', v)} />
          <Row label="12. Chiều rộng lá" value={d.tt_chieu_rong_la} onChange={(v) => set('tt_chieu_rong_la', v)} />
          <Row label="13. Độ phủ lông của lá (Trơn/trung bình/dày lông/...)" value={d.tt_do_phu_long_la} onChange={(v) => set('tt_do_phu_long_la', v)} />
          <Row label="14. Màu phiến lá (xanh nhạt/xanh/xanh đậm/tím/...)" value={d.tt_mau_phien_la} onChange={(v) => set('tt_mau_phien_la', v)} />
          <Row label="15. Màu bẹ lá (xanh/có sọc tím/tím nhạt/...)" value={d.tt_mau_be_la} onChange={(v) => set('tt_mau_be_la', v)} />
          <Row label="16. Góc lá (đứng/ngang/rũ xuống/...)" value={d.tt_goc_la} onChange={(v) => set('tt_goc_la', v)} />
          <Row label="17. Góc lá đòng (đứng/ngang/gập xuống/...)" value={d.tt_goc_la_dong} onChange={(v) => set('tt_goc_la_dong', v)} />
          <Row label="18. Dài thìa lìa" value={d.tt_dai_thia_lia} onChange={(v) => set('tt_dai_thia_lia', v)} />
          <Row label="19. Màu thìa lìa (trắng/sọc tím/tím/...)" value={d.tt_mau_thia_lia} onChange={(v) => set('tt_mau_thia_lia', v)} />
          <Row label="20. Dạng thìa lìa (nhọn đến hơi nhọn/hai lưỡi kim/chóp cụt/...)" value={d.tt_dang_thia_lia} onChange={(v) => set('tt_dang_thia_lia', v)} />
          <Row label="21. Màu cổ lá (xanh nhạt/xanh/tím/...)" value={d.tt_mau_co_la} onChange={(v) => set('tt_mau_co_la', v)} />
          <Row label="22. Màu tai lá (xanh nhạt/tím/...)" value={d.tt_mau_tai_la} onChange={(v) => set('tt_mau_tai_la', v)} />
          <Row label="23. Chiều dài thân" value={d.tt_chieu_dai_than} onChange={(v) => set('tt_chieu_dai_than', v)} />
          <Row label="24. Số rãnh" value={d.tt_so_ranh} onChange={(v) => set('tt_so_ranh', v)} />
          <Row label="25. Góc thân (đứng/trung gian/mở/tòe/bò lan/...)" value={d.tt_goc_than} onChange={(v) => set('tt_goc_than', v)} />
          <Row label="26. Đường kính ống dạ" value={d.tt_duong_kinh_ong_da} onChange={(v) => set('tt_duong_kinh_ong_da', v)} />
          <Row label="27. Màu sắc ống dạ" value={d.tt_mau_sac_ong_da} onChange={(v) => set('tt_mau_sac_ong_da', v)} />
          <Row label="28. Độ cứng cây" value={d.tt_do_cung_cay} onChange={(v) => set('tt_do_cung_cay', v)} />
          <Row label="29. Dài bông" value={d.tt_dai_bong} onChange={(v) => set('tt_dai_bong', v)} />
          <Row label="30. Dạng bông (chụm/trung gian/mở/...)" value={d.tt_dang_bong} onChange={(v) => set('tt_dang_bong', v)} />
          <Row label="31. Phân nhánh thứ cấp trên bông" value={d.tt_phan_nhanh_thu_cap} onChange={(v) => set('tt_phan_nhanh_thu_cap', v)} />
          <Row label="32. Độ thoát cổ bông (hoàn toàn/trung bình/vừa đúng cổ bông/thoát 1 phần/...)" value={d.tt_do_thoat_co_bong} onChange={(v) => set('tt_do_thoat_co_bong', v)} />
          <Row label="33. Trục bông (thẳng đứng/uốn xuống/...)" value={d.tt_truc_bong} onChange={(v) => set('tt_truc_bong', v)} />
          <Row label="34. Độ tàn lá (muộn và chậm/trung bình/sớm và nhanh/...)" value={d.tt_do_tan_la} onChange={(v) => set('tt_do_tan_la', v)} />
          <Row label="35. Độ rụng hạt" value={d.tt_do_rung_hat} onChange={(v) => set('tt_do_rung_hat', v)} />
          <Row label="36. Độ dai của hạt khi tút (khó/dễ/...)" value={d.tt_do_dai_hat_tut} onChange={(v) => set('tt_do_dai_hat_tut', v)} />
          <Row label="37. Râu (không râu/râu ngắn từng phần/râu ngắn toàn phần/râu dài từng phần/râu dài toàn phần/...)" value={d.tt_rau} onChange={(v) => set('tt_rau', v)} />
          <Row label="38. Màu râu (vàng rơm/vàng/nâu/đỏ/...)" value={d.tt_mau_rau} onChange={(v) => set('tt_mau_rau', v)} />
          <Row label="39. Màu mỏ hạt (trắng/nâu/đỉnh đỏ/đỉnh tím/...)" value={d.tt_mau_mo_hat} onChange={(v) => set('tt_mau_mo_hat', v)} />
          <Row label="40. Màu vỏ trấu (vàng rơm/đốm nâu/khía nâu/nâu/hơi đỏ/tím nhạt/...)" value={d.tt_mau_vo_trau} onChange={(v) => set('tt_mau_vo_trau', v)} />
          <Row label="41. Độ phủ lông vỏ trấu (nhăn/có lông ngắn/có lông dài/có lông phần trên/...)" value={d.tt_do_phu_long_vo_trau} onChange={(v) => set('tt_do_phu_long_vo_trau', v)} />
          <Row label="42. Màu mày hạt (vàng rơm/vàng/đỏ/tím/...)" value={d.tt_mau_may_hat} onChange={(v) => set('tt_mau_may_hat', v)} />
          <Row label="43. Chiều dài mày hạt (ngắn <1,5mm/trung bình 1,6–2,5mm/dài >2,5mm)" value={d.tt_chieu_dai_may_hat} onChange={(v) => set('tt_chieu_dai_may_hat', v)} />
          <Row label="44. Độ thụ phấn của bông (hữu thụ cao >90%/hữu thụ 75–90%/hữu thụ bộ phận 50–74%/bất thụ cao <50%/bất thụ hoàn toàn 0%)" value={d.tt_do_thu_phan_bong} onChange={(v) => set('tt_do_thu_phan_bong', v)} />
          <Row label="45. Trọng lượng 1000 hạt" value={d.tt_trong_luong_1000_hat} onChange={(v) => set('tt_trong_luong_1000_hat', v)} />
          <Row label="46. Chiều dài hạt (mm, n = 5)" value={d.tt_chieu_dai_hat} onChange={(v) => set('tt_chieu_dai_hat', v)} />
          <Row label="47. Chiều rộng hạt (mm, n = 5)" value={d.tt_chieu_rong_hat} onChange={(v) => set('tt_chieu_rong_hat', v)} />
          <Row label="48. Màu vỏ gạo (trắng/nâu nhạt/ánh nâu/nâu/đỏ/tím/...)" value={d.tt_mau_vo_gao} onChange={(v) => set('tt_mau_vo_gao', v)} />
        </>
      )}

      {/* ── LN: Lâm nghiệp (Bảng 05) ── */}
      {isLN && !isLNCayDacSan && !isLNTreNua && (
        <>
          <SubLabel>- Dữ liệu hình thái(Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <Row label="10. Dạng cây (gỗ lớn/gỗ nhỏ/cây bụi/...)" value={d.ln_dang_cay} onChange={(v) => set('ln_dang_cay', v)} />
          <DualRow label="11. Chiều cao cây" label1="Chiều cao (Hvn) (m)" value1={d.ln_chieu_cao_hvn} onChange1={(v) => set('ln_chieu_cao_hvn', v)} label2="Chiều cao dưới cành (Hdc) (m)" value2={d.ln_chieu_cao_hdc} onChange2={(v) => set('ln_chieu_cao_hdc', v)} />
          <Row label="12. Đường kính ngang ngực D1.3 (cm)" value={d.ln_duong_kinh_d13} onChange={(v) => set('ln_duong_kinh_d13', v)} />
          <Row label="13. Đặc điểm gốc cây (có đế/có bạnh vè/có rễ khí sinh/có gai/...)" value={d.ln_dac_diem_goc} onChange={(v) => set('ln_dac_diem_goc', v)} />
          <Row label="14. Sắc tố cành non (xanh vàng/xanh lục/gi sắt/tím/...)" value={d.ln_sac_to_canh_non} onChange={(v) => set('ln_sac_to_canh_non', v)} />
          <Row label="15. Lông ở cành non (có/không)" value={d.ln_long_canh_non} onChange={(v) => set('ln_long_canh_non', v)} />
          <Row label="16. Góc phân cành (<45o/45o-90o/>90o)" value={d.ln_goc_phan_canh} onChange={(v) => set('ln_goc_phan_canh', v)} />
          <Row label="17. Hình thái tán cây (tròn/trứng/trứng ngược/thuần/quạt/...)" value={d.ln_hinh_thai_tan} onChange={(v) => set('ln_hinh_thai_tan', v)} />
          <Row label="18. Đường kính tán: (Dt) (m)" value={d.ln_duong_kinh_tan} onChange={(v) => set('ln_duong_kinh_tan', v)} />
          <Row label="19. Hình dạng lá (hình trứng/trứng ngược/xẻ thùy lông chim/xẻ thùy chân vịt/hình tim/hình kiếm/...)" value={d.ln_hinh_dang_la} onChange={(v) => set('ln_hinh_dang_la', v)} />
          <Row label="20. Kiểu lá (đơn/kép lông chim 1-2 lần chẵn/lẻ/kép chân vịt/...)" value={d.ln_kieu_la} onChange={(v) => set('ln_kieu_la', v)} />
          <Row label="21. Cuống lá (có/không)" value={d.ln_cuong_la} onChange={(v) => set('ln_cuong_la', v)} />
          <DualRow label="22. Kích thước lá" label1="Dài (cm)" value1={d.ln_kich_thuoc_la} onChange1={(v) => set('ln_kich_thuoc_la', v)} label2="Rộng (cm)" value2={d.ln_kich_thuoc_la_rong} onChange2={(v) => set('ln_kich_thuoc_la_rong', v)} />
          <Row label="23. Gân lá (song song/hình lông chim/hình chân vịt/...)" value={d.ln_gan_la} onChange={(v) => set('ln_gan_la', v)} />
          <Row label="24. Màu lá (xanh thẫm/xanh nhạt/xanh tím/vàng nhạt/...)" value={d.ln_mau_la} onChange={(v) => set('ln_mau_la', v)} />
          <Row label="25. Màu lá non (xanh thẫm/xanh nhạt/xanh tím/vàng nhạt/...)" value={d.ln_mau_la_non} onChange={(v) => set('ln_mau_la_non', v)} />
          <Row label="26. Mép lá (liền/lượn sóng/răng cưa/xẻ thùy/...)" value={d.ln_mep_la} onChange={(v) => set('ln_mep_la', v)} />
          <Row label="27. Đầu lá (nhọn/nhọn gấp/tù/tròn/...)" value={d.ln_dau_la} onChange={(v) => set('ln_dau_la', v)} />
          <Row label="28. Đuôi lá (hình nêm/tròn/tù/hình khiên/...)" value={d.ln_duoi_la} onChange={(v) => set('ln_duoi_la', v)} />
          <Row label="29. Sắp xếp lá (mọc cách/mọc đối/mọc vòng/...)" value={d.ln_sap_xep_la} onChange={(v) => set('ln_sap_xep_la', v)} />
          <Row label="30. Kiểu hoa (đơn/phức/tự đơn trục/tự hợp trục/tự hỗn hợp/...)" value={d.ln_kieu_hoa} onChange={(v) => set('ln_kieu_hoa', v)} />
          <Row label="31. Kiểu đính hoa (nách lá/ngọn cành/đối lá/...)" value={d.ln_kieu_dinh_hoa} onChange={(v) => set('ln_kieu_dinh_hoa', v)} />
          <Row label="32. Kích thước đường kính hoa (mm)" value={d.ln_kich_thuoc_hoa} onChange={(v) => set('ln_kich_thuoc_hoa', v)} />
          <Row label="33. Hình dạng hoa (hình chuông/hình phễu/hình ống/hình đĩa/...)" value={d.ln_hinh_dang_hoa} onChange={(v) => set('ln_hinh_dang_hoa', v)} />
          <Row label="34. Đế hoa (phẳng/lồi/lõm/...)" value={d.ln_de_hoa} onChange={(v) => set('ln_de_hoa', v)} />
          <Row label="35. Đài hoa (hình ống/hình chuông/hình bẹ/xẻ thùy/...)" value={d.ln_dai_hoa} onChange={(v) => set('ln_dai_hoa', v)} />
          <Row label="36. Tràng hoa (xếp vòng/xếp thìa/xếp vặn/...)" value={d.ln_trang_hoa} onChange={(v) => set('ln_trang_hoa', v)} />
          <Row label="37. Màu sắc tràng hoa (trắng/vàng/đỏ/hồng/tím/...)" value={d.ln_mau_sac_trang_hoa} onChange={(v) => set('ln_mau_sac_trang_hoa', v)} />
          <Row label="38. Nhị hoa (rời/hợp)" value={d.ln_nhi_hoa} onChange={(v) => set('ln_nhi_hoa', v)} />
          <Row label="39. Bao phấn (hình mũi tên/ống nhị/cột nhị/...)" value={d.ln_bao_phan} onChange={(v) => set('ln_bao_phan', v)} />
          <Row label="40. Nhụy hoa (1 lá noãn/2 lá noãn/nhiều lá noãn/...)" value={d.ln_nhuy_hoa} onChange={(v) => set('ln_nhuy_hoa', v)} />
          <Row label="41. Mùi hoa (không mùi/nhẹ/trung bình/nặng/...)" value={d.ln_mui_hoa} onChange={(v) => set('ln_mui_hoa', v)} />
          <Row label="42. Hướng mọc của hoa (đứng/ngang/rủ xuống/...)" value={d.ln_huong_moc_hoa} onChange={(v) => set('ln_huong_moc_hoa', v)} />
          <Row label="43. Kiểu quả (đơn/kép/...)" value={d.ln_kieu_qua} onChange={(v) => set('ln_kieu_qua', v)} />
          <Row label="44. Loại quả (hạch/nang/đậu/cánh/mọng/...)" value={d.ln_loai_qua} onChange={(v) => set('ln_loai_qua', v)} />
          <Row label="45. Hình dạng quả (tròn/bầu dục/hình trụ/...)" value={d.ln_hinh_dang_qua} onChange={(v) => set('ln_hinh_dang_qua', v)} />
          <DualRow label="46. Kích thước quả (cm)" label1="Dài" value1={d.ln_kich_thuoc_qua} onChange1={(v) => set('ln_kich_thuoc_qua', v)} label2="Rộng/đường kính" value2={d.ln_kich_thuoc_qua_rong} onChange2={(v) => set('ln_kich_thuoc_qua_rong', v)} />
          <Row label="47. Màu sắc vỏ quả khi chín" value={d.ln_mau_vo_qua} onChange={(v) => set('ln_mau_vo_qua', v)} />
          <Row label="48. Số hạt trên quả (TB)" value={d.ln_so_hat_qua} onChange={(v) => set('ln_so_hat_qua', v)} />
          <Row label="49. Dạng hạt (hình tròn/hình cầu/hình trứng/...)" value={d.ln_dang_hat} onChange={(v) => set('ln_dang_hat', v)} />
          <Row label="50. Bề mặt hạt (trơn/sần sùi/có lông/...)" value={d.ln_be_mat_hat} onChange={(v) => set('ln_be_mat_hat', v)} />
          <Row label="51. Màu hạt" value={d.ln_mau_hat} onChange={(v) => set('ln_mau_hat', v)} />
          <DualRow label="52. Kích thước hạt (mm)" label1="Dài" value1={d.ln_kich_thuoc_hat} onChange1={(v) => set('ln_kich_thuoc_hat', v)} label2="Rộng" value2={d.ln_kich_thuoc_hat_rong} onChange2={(v) => set('ln_kich_thuoc_hat_rong', v)} />
          <Row label="53. Trọng lượng 1000 hạt (Kg)" value={d.ln_trong_luong_1000_hat} onChange={(v) => set('ln_trong_luong_1000_hat', v)} />
          <Row label="54. Cấu tạo cây mầm" value={d.ln_cau_tao_cay_mam} onChange={(v) => set('ln_cau_tao_cay_mam', v)} />
        </>
      )}

      {/* ── LN: Tre nứa (Bảng 06) ── */}
      {isLNTreNua && (
        <>
          <SubLabel>- Dữ liệu hình thái(Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <Row label="10. Thân ngầm (mọc cum/mọc phân tán/mọc tản/...)" value={d.tn_than_ngam} onChange={(v) => set('tn_than_ngam', v)} />
          <DualRow label="11. Thân khí sinh" label1="Chiều cao (TB)" value1={d.tn_chieu_cao_than} onChange1={(v) => set('tn_chieu_cao_than', v)} label2="Đường kính (TB)" value2={d.tn_duong_kinh_than} onChange2={(v) => set('tn_duong_kinh_than', v)} />
          <Row label="12. Chiều dài lóng (TB) (cm)" value={d.tn_chieu_dai_long} onChange={(v) => set('tn_chieu_dai_long', v)} />
          <Row label="13. Chiều dài lá (TB) (cm)" value={d.tn_chieu_dai_la} onChange={(v) => set('tn_chieu_dai_la', v)} />
          <Row label="14. Chiều rộng lá (TB) (cm)" value={d.tn_chieu_rong_la} onChange={(v) => set('tn_chieu_rong_la', v)} />
          <Row label="15. Độ phủ lông của lá (trơn/trung bình/phủ lông/...)" value={d.tn_do_phu_long_la} onChange={(v) => set('tn_do_phu_long_la', v)} />
          <Row label="16. Màu phiến lá (xanh/xanh nhạt/xanh đậm/...)" value={d.tn_mau_phien_la} onChange={(v) => set('tn_mau_phien_la', v)} />
          <Row label="17. Màu góc bẹ lá (xanh/có sọc tím/tím nhạt/tím/...)" value={d.tn_mau_goc_be_la} onChange={(v) => set('tn_mau_goc_be_la', v)} />
          <Row label="18. Góc lá (đứng/ngang/rũ xuống/...)" value={d.tn_goc_la} onChange={(v) => set('tn_goc_la', v)} />
          <Row label="19. Màu cổ lá (xanh/xanh nhạt/tím/...)" value={d.tn_mau_co_la} onChange={(v) => set('tn_mau_co_la', v)} />
          <Row label="20. Màu tai lá (xanh nhạt/tím/...)" value={d.tn_mau_tai_la} onChange={(v) => set('tn_mau_tai_la', v)} />
          <Row label="21. Hình dạng mo thân (hình tam giác/hình thang rộng/hình thang hẹp/...)" value={d.tn_hinh_dang_mo_than} onChange={(v) => set('tn_hinh_dang_mo_than', v)} />
          <Row label="22. Màu sắc mo thân (xanh nhạt/xanh lục/vàng rơm/nâu nhạt/...)" value={d.tn_mau_sac_mo_than} onChange={(v) => set('tn_mau_sac_mo_than', v)} />
          <Row label="23. Màu lông mo (xám/nâu/nâu vàng/tím đen/...)" value={d.tn_mau_long_mo} onChange={(v) => set('tn_mau_long_mo', v)} />
          <Row label="24. Tai mo (có/không)" value={d.tn_tai_mo} onChange={(v) => set('tn_tai_mo', v)} />
          <Row label="25. Lá mo (hình tam giác/hình trứng/hình thuôn hẹp/...)" value={d.tn_la_mo} onChange={(v) => set('tn_la_mo', v)} />
          <Row label="26. Dạng bông/khuy (chụm/trung gian/mở/...)" value={d.tn_dang_bong} onChange={(v) => set('tn_dang_bong', v)} />
          <Row label="27. Phân nhánh thứ cấp trên bông (không/nhẹ/nặng/dề cụm/...)" value={d.tn_phan_nhanh} onChange={(v) => set('tn_phan_nhanh', v)} />
          <Row label="28. Màu hạt (trắng/đỉnh đỏ/nâu/đỉnh tím/...)" value={d.tn_mau_hat} onChange={(v) => set('tn_mau_hat', v)} />
          <Row label="29. Trọng lượng 1000 hạt (kg)" value={d.ln_trong_luong_1000_hat} onChange={(v) => set('ln_trong_luong_1000_hat', v)} />
          <Row label="30. Chiều dài hạt (mm)" value={d.ln_kich_thuoc_hat} onChange={(v) => set('ln_kich_thuoc_hat', v)} />
          <Row label="31. Chiều rộng hạt (mm)" value={d.ln_kich_thuoc_hat_rong} onChange={(v) => set('ln_kich_thuoc_hat_rong', v)} />
        </>
      )}

      {/* ── DL: Dược liệu (Bảng 08) ── */}
      {isDL && (
        <>
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
          <Row label="21. Hình dạng hoa (hình chuông/hình phễu/hình ống/hình nhạc/hình đĩa/...)" value={d.hinh_dang_hoa} onChange={(v) => set('hinh_dang_hoa', v)} />
          <Row label="22. Bầu (thượng/trung/hạ)" value={d.bau} onChange={(v) => set('bau', v)} />
          <Row label="23. Mùi hoa (không mùi/nhẹ/trung bình/nặng/...)" value={d.mui_hoa} onChange={(v) => set('mui_hoa', v)} />
          <Row label="24. Hình dạng quả (quan sát 5 quả, khi trưởng thành) (hình thoi/tròn/tròn dẹt/...)" value={d.hinh_dang_qua} onChange={(v) => set('hinh_dang_qua', v)} />
          <Row label="25. Loại quả (nang/kén/mọng/hạch/...)" value={d.loai_qua} onChange={(v) => set('loai_qua', v)} />
          <Row label="26. Số hạt trên quả (đếm trung bình 5 quả, n = 5)" value={d.so_hat_tren_qua} onChange={(v) => set('so_hat_tren_qua', v)} />
          <Row label="27. Dạng hạt (hình tròn/hình cầu/hình trứng/dẹt hình thận/...)" value={d.dang_hat} onChange={(v) => set('dang_hat', v)} />
          <Row label="28. Bề mặt hạt (trơn/sần sùi/có lông/...)" value={d.be_mat_hat} onChange={(v) => set('be_mat_hat', v)} />
        </>
      )}

      {/* ── CN: Vật nuôi (Bảng 11) ── */}
      {isCN && (
        isCNGiaCam ? (
          <>
            <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
            <Row label="10. Hình thái lông (Bình thường/Quăn/Mượt/Dạng khác)" value={d.cn_hinh_thai_long} onChange={(v) => set('cn_hinh_thai_long', v)} />
            <Row label="11. Phân bố lông (Bình thường/có trụi/ bàn chân và cẳng có lông, tai và cằm có lông/ mào có chòm lông/ từ khùy chân lông dài phủ)" value={d.cn_phan_bo_long} onChange={(v) => set('cn_phan_bo_long', v)} />
            <Row label="12. Kiểu bộ lông (Trơn tru/sọc/ có viền, lóm đốm/ khác)" value={d.cn_kieu_bo_long} onChange={(v) => set('cn_kieu_bo_long', v)} />
            <Row label="13. Màu bộ lông (Trắng/đen/xanh/đỏ/vàng rơm/khác)" value={d.cn_mau_bo_long} onChange={(v) => set('cn_mau_bo_long', v)} />
            <Row label="14. Màu da (Trắng/vàng/đen/khác)" value={d.cn_mau_da} onChange={(v) => set('cn_mau_da', v)} />
            <Row label="15. Màu dài tai (Trắng/đỏ/khác)" value={d.cn_mau_dai_tai} onChange={(v) => set('cn_mau_dai_tai', v)} />
            <Row label="16. Kiểu mào (Đơn/hạt dổ/hoa hồng/dâu tây/hai cánh/hạt dổ/hoa hồng/ khác)" value={d.cn_kieu_mao} onChange={(v) => set('cn_kieu_mao', v)} />
            <Row label="17. Độ lớn của mào" value={d.cn_do_lon_mao} onChange={(v) => set('cn_do_lon_mao', v)} />
            <Row label="18. Màu mắt" value={d.cn_mau_mat} onChange={(v) => set('cn_mau_mat', v)} />
            <Row label="19. Các dạng bộ xương" value={d.cn_cac_dang_bo_xuong} onChange={(v) => set('cn_cac_dang_bo_xuong', v)} />
            <Row label="20. Các chiều đo (8 Chiều đo)" value={d.cn_cac_chieu_do} onChange={(v) => set('cn_cac_chieu_do', v)} rows={2} />
          </>
        ) : isCNGSGam ? (
          <>
            <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
            <Row label="10. Hình thái lông (Bình thường/Quăn/Mượt/...)" value={d.cn_hinh_thai_long} onChange={(v) => set('cn_hinh_thai_long', v)} />
            <Row label="11. Phân bố lông (Bình thường/có trụi/ bàn chân và càng có lông, tai và cằm có lông/...)" value={d.cn_phan_bo_long} onChange={(v) => set('cn_phan_bo_long', v)} />
            <Row label="12. Mào (có chòm lông/ từ khủy chân lông dài phủ.)" value={d.cn_mao} onChange={(v) => set('cn_mao', v)} />
            <Row label="13. Kiểu bộ lông (Trơn trụi/sóc/ có viền, lốm đốm/ khác)" value={d.cn_kieu_bo_long} onChange={(v) => set('cn_kieu_bo_long', v)} />
            <Row label="14. Màu bộ lông (Trắng/đen/xanh/đỏ/vàng rơm/khác)" value={d.cn_mau_bo_long} onChange={(v) => set('cn_mau_bo_long', v)} />
            <Row label="15. Màu da (Trắng/vàng/đen/khác)" value={d.cn_mau_da} onChange={(v) => set('cn_mau_da', v)} />
            <Row label="16. Màu dái tai (Trắng/đỏ/khác)" value={d.cn_mau_dai_tai} onChange={(v) => set('cn_mau_dai_tai', v)} />
            <Row label="17. Kiểu mào (Đơn/hạt đỗ/hoa hồng/dâu tây/hai cánh/hạt đỏ/hoa hồng/ khác)" value={d.cn_kieu_mao} onChange={(v) => set('cn_kieu_mao', v)} />
            <Row label="18. Độ lớn của mào" value={d.cn_do_lon_mao} onChange={(v) => set('cn_do_lon_mao', v)} />
            <Row label="19. Màu mắt" value={d.cn_mau_mat} onChange={(v) => set('cn_mau_mat', v)} />
            <Row label="20. Các dạng bộ xương" value={d.cn_cac_dang_bo_xuong} onChange={(v) => set('cn_cac_dang_bo_xuong', v)} />
            <Row label="21. Các chiều đo (8 Chiều đo)" value={d.cn_cac_chieu_do} onChange={(v) => set('cn_cac_chieu_do', v)} rows={2} />
            <Row label="22. Các đặc điểm khác" value={d.cn_dac_diem_khac} onChange={(v) => set('cn_dac_diem_khac', v)} rows={2} />
          </>
        ) : isCNThuyCam ? (
          <>
            <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
            <Row label="10. Hình thái lông (Bình thường/Quăn/Mượt/Dạng khác)" value={d.cn_hinh_thai_long} onChange={(v) => set('cn_hinh_thai_long', v)} />
            <Row label="11. Phân bố lông (Bình thường/có trụi/ bàn chân và càng có lông, tai và cằm có lông/mào có chòm lông/ từ khủy chân lông dài phủ.)" value={d.cn_phan_bo_long} onChange={(v) => set('cn_phan_bo_long', v)} />
            <Row label="12. Kiểu bộ lông (Trơn trụi/sóc/ có viền, lốm đốm/ khác)" value={d.cn_kieu_bo_long} onChange={(v) => set('cn_kieu_bo_long', v)} />
            <Row label="13. Màu bộ lông (Trắng/đen/xanh/đỏ/vàng rơm/khác)" value={d.cn_mau_bo_long} onChange={(v) => set('cn_mau_bo_long', v)} />
            <Row label="14. Màu da (Trắng/vàng/đen/khác)" value={d.cn_mau_da} onChange={(v) => set('cn_mau_da', v)} />
            <Row label="15. Màu dái tai (Trắng/đỏ/khác)" value={d.cn_mau_dai_tai} onChange={(v) => set('cn_mau_dai_tai', v)} />
            <Row label="16. Kiểu mào (Đơn/hạt đỗ/hoa hồng/dâu tây/hai cánh/hạt đỏ/hoa hồng/ khác)" value={d.cn_kieu_mao} onChange={(v) => set('cn_kieu_mao', v)} />
            <Row label="17. Độ lớn của mào" value={d.cn_do_lon_mao} onChange={(v) => set('cn_do_lon_mao', v)} />
            <Row label="18. Màu mắt" value={d.cn_mau_mat} onChange={(v) => set('cn_mau_mat', v)} />
            <Row label="19. Các dạng bộ xương" value={d.cn_cac_dang_bo_xuong} onChange={(v) => set('cn_cac_dang_bo_xuong', v)} />
            <Row label="20. Các chiều đo (8 Chiều đo)" value={d.cn_cac_chieu_do} onChange={(v) => set('cn_cac_chieu_do', v)} rows={2} />
          </>
        ) : isCNTieuGiaSuc ? (
          <>
            <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
            <Row label="10. Lông (Quăn/Thẳng/Ngắn – Dài/Rậm/Thưa)" value={d.tgs_long} onChange={(v) => set('tgs_long', v)} />
            <Row label="11. Mõm (Dài và mỏng – Ngắn và tròn – Kiểu khác)" value={d.tgs_mom} onChange={(v) => set('tgs_mom', v)} />
            <Row label="12. Răng nanh (Có/Không)" value={d.tgs_rang_nanh} onChange={(v) => set('tgs_rang_nanh', v)} />
            <Row label="13. Bộ lông (Một kiểu/chập và – Không khuôn mẫu)" value={d.cn_kieu_bo_long} onChange={(v) => set('cn_kieu_bo_long', v)} />
            <Row label="14. Màu lông (Trắng, đen/đỏ thẫm/đỏ sáng/ nâu vàng/màu khác)" value={d.cn_mau_bo_long} onChange={(v) => set('cn_mau_bo_long', v)} />
            <Row label="15. Đầu (Lõm/Thẳng/Gồ)" value={d.tgs_dau} onChange={(v) => set('tgs_dau', v)} />
            <Row label="16. Kiểu tai (Cụp/rủ/thông/dựng lên)" value={d.tgs_kieu_tai} onChange={(v) => set('tgs_kieu_tai', v)} />
            <Row label="17. Hướng tai (Hướng trước/ngang/sau)" value={d.tgs_huong_tai} onChange={(v) => set('tgs_huong_tai', v)} />
            <Row label="18. Da (Trơn/nhăn)" value={d.tgs_da} onChange={(v) => set('tgs_da', v)} />
            <Row label="19. Đuôi (Thẳng cong)" value={d.tgs_duoi} onChange={(v) => set('tgs_duoi', v)} />
            <Row label="20. Lưng (Thẳng/võng/kiểu khác)" value={d.tgs_lung} onChange={(v) => set('tgs_lung', v)} />
            <Row label="21. Chân (Ngắn, dài, TB so với cơ thể)" value={d.tgs_chan} onChange={(v) => set('tgs_chan', v)} />
            <Row label="22. Các chiều đo" value={d.cn_cac_chieu_do} onChange={(v) => set('cn_cac_chieu_do', v)} />
            <Row label="23. KLCT" value={d.tgs_klct} onChange={(v) => set('tgs_klct', v)} />
            <Row label="24. Dài thân" value={d.cn_chieu_dai_than} onChange={(v) => set('cn_chieu_dai_than', v)} />
            <Row label="25. Dài đầu" value={d.tgs_dai_dau} onChange={(v) => set('tgs_dai_dau', v)} />
            <Row label="26. Dài tai" value={d.tgs_dai_tai} onChange={(v) => set('tgs_dai_tai', v)} />
            <Row label="27. Dài đuôi" value={d.tgs_dai_duoi} onChange={(v) => set('tgs_dai_duoi', v)} />
            <Row label="28. Vòng ngực" value={d.cn_vong_nguc} onChange={(v) => set('cn_vong_nguc', v)} />
            <Row label="29. Cao vai" value={d.cn_chieu_cao_vai} onChange={(v) => set('cn_chieu_cao_vai', v)} />
            <Row label="30. Số vú" value={d.tgs_so_vu} onChange={(v) => set('tgs_so_vu', v)} />
            <Row label="31. Trọng lượng trưởng thành(kg)" value={d.cn_trong_luong_truong_thanh} onChange={(v) => set('cn_trong_luong_truong_thanh', v)} />
            <Row label="32. Đặc điểm khác" value={d.cn_dac_diem_khac} onChange={(v) => set('cn_dac_diem_khac', v)} rows={2} />
          </>
        ) : (
          <>
            <SubLabel>- Dữ liệu hình thái ngoại hình</SubLabel>
            <Row label="10. Hình thái lông (Bình thường/Quăn/Mượt/...)" value={d.cn_hinh_thai_long} onChange={(v) => set('cn_hinh_thai_long', v)} />
            <Row label="11. Phân bố lông (Bình thường/cổ trụi/bàn chân và cẳng có lông/...)" value={d.cn_phan_bo_long} onChange={(v) => set('cn_phan_bo_long', v)} />
            <Row label="12. Mào (có chòm lông/từ khủy chân lông dài phủ/...)" value={d.cn_mao} onChange={(v) => set('cn_mao', v)} />
            <Row label="13. Kiểu bộ lông (Trơn tru/sọc/có viền, lốm đốm/khác)" value={d.cn_kieu_bo_long} onChange={(v) => set('cn_kieu_bo_long', v)} />
            <Row label="14. Màu bộ lông (Trắng/đen/xanh/đỏ/vàng rơm/khác)" value={d.cn_mau_bo_long} onChange={(v) => set('cn_mau_bo_long', v)} />
            <Row label="15. Màu da (Trắng/vàng/đen/khác)" value={d.cn_mau_da} onChange={(v) => set('cn_mau_da', v)} />
            <Row label="16. Màu dái tai (Trắng/đỏ/khác)" value={d.cn_mau_dai_tai} onChange={(v) => set('cn_mau_dai_tai', v)} />
            <Row label="17. Kiểu mào (Đơn/hạt đỗ/hoa hồng/dâu tây/hai cánh/khác)" value={d.cn_kieu_mao} onChange={(v) => set('cn_kieu_mao', v)} />
            <Row label="18. Độ lớn của mào" value={d.cn_do_lon_mao} onChange={(v) => set('cn_do_lon_mao', v)} />
            <Row label="19. Màu mắt" value={d.cn_mau_mat} onChange={(v) => set('cn_mau_mat', v)} />
            <Row label="20. Các dạng bộ xương" value={d.cn_cac_dang_bo_xuong} onChange={(v) => set('cn_cac_dang_bo_xuong', v)} />
            <Row label="21. Các chiều đo (8 chiều đo: dài thân, cao vai, vòng ngực, vòng bụng, dài đầu, rộng đầu, dài cổ, nặng)" value={d.cn_cac_chieu_do} onChange={(v) => set('cn_cac_chieu_do', v)} rows={2} />
            <Row label="22. Các đặc điểm khác" value={d.cn_dac_diem_khac} onChange={(v) => set('cn_dac_diem_khac', v)} />
          </>
        )
      )}

      {/* ── TS: Thủy sản — Cá (Bảng 14) ── */}
      {isTSCa && (
        <>
          <SubLabel>- Dữ liệu hình thái cơ thể (cm; n = 10)</SubLabel>
          <PairRow
            label1="10. Chiều dài toàn thân (cm)" value1={d.ts_chieu_dai_toan_than} onChange1={(v) => set('ts_chieu_dai_toan_than', v)}
            label2="Chiều cao đầu (cm)" value2={d.ts_chieu_cao_dau} onChange2={(v) => set('ts_chieu_cao_dau', v)}
          />
          <PairRow
            label1="11. Chiều dài kinh tế (cm)" value1={d.ts_chieu_dai_kinh_te} onChange1={(v) => set('ts_chieu_dai_kinh_te', v)}
            label2="Chiều rộng đầu (cm)" value2={d.ts_chieu_rong_dau} onChange2={(v) => set('ts_chieu_rong_dau', v)}
          />
          <PairRow
            label1="12. Dài trước vây lưng (cm)" value1={d.ts_dai_truoc_vay_lung} onChange1={(v) => set('ts_dai_truoc_vay_lung', v)}
            label2="Chiều cao thân (cm)" value2={d.ts_chieu_cao_than} onChange2={(v) => set('ts_chieu_cao_than', v)}
          />
          <PairRow
            label1="13. Dài trước vây ngực (cm)" value1={d.ts_dai_truoc_vay_nguc} onChange1={(v) => set('ts_dai_truoc_vay_nguc', v)}
            label2="Chiều dày thân (cm)" value2={d.ts_chieu_day_than} onChange2={(v) => set('ts_chieu_day_than', v)}
          />
          <PairRow
            label1="14. Dài trước vây bụng (cm)" value1={d.ts_dai_truoc_vay_bung} onChange1={(v) => set('ts_dai_truoc_vay_bung', v)}
            label2="Số tia vây lưng" value2={d.ts_so_tia_vay_lung} onChange2={(v) => set('ts_so_tia_vay_lung', v)}
          />
          <PairRow
            label1="15. Dài trước vây hậu môn (cm)" value1={d.ts_dai_truoc_vay_hau_mon} onChange1={(v) => set('ts_dai_truoc_vay_hau_mon', v)}
            label2="Số tia vây ngực" value2={d.ts_so_tia_vay_nguc} onChange2={(v) => set('ts_so_tia_vay_nguc', v)}
          />
          <PairRow
            label1="16. Chiều dài đầu (cm)" value1={d.ts_chieu_dai_dau} onChange1={(v) => set('ts_chieu_dai_dau', v)}
            label2="Số tia vây bụng" value2={d.ts_so_tia_vay_bung} onChange2={(v) => set('ts_so_tia_vay_bung', v)}
          />
          <PairRow
            label1="17. Chiều dài mõm (cm)" value1={d.ts_chieu_dai_mom} onChange1={(v) => set('ts_chieu_dai_mom', v)}
            label2="Số tia vây hậu môn" value2={d.ts_so_tia_vay_hau_mon} onChange2={(v) => set('ts_so_tia_vay_hau_mon', v)}
          />
          <PairRow
            label1="18. Đường kính mắt (cm)" value1={d.ts_duong_kinh_mat} onChange1={(v) => set('ts_duong_kinh_mat', v)}
            label2="Số tia vây đuôi" value2={d.ts_so_tia_vay_duoi} onChange2={(v) => set('ts_so_tia_vay_duoi', v)}
          />
          <PairRow
            label1="19. Khoảng cách hai mắt (cm)" value1={d.ts_khoang_cach_hai_mat} onChange1={(v) => set('ts_khoang_cach_hai_mat', v)}
            label2="Số vảy đường bên" value2={d.ts_so_vay_duong_ben} onChange2={(v) => set('ts_so_vay_duong_ben', v)}
          />
          <Row label="20. Trọng lượng (g; n = 10)" value={d.ts_trong_luong_truong_thanh} onChange={(v) => set('ts_trong_luong_truong_thanh', v)} />
          <Row label="21. Cơ quan sinh sản" value={d.ts_co_quan_sinh_san} onChange={(v) => set('ts_co_quan_sinh_san', v)} rows={2} />
        </>
      )}

      {/* ── TS: Thủy sản — Ốc / Thân mềm ── */}
      {(isTSOc || isTSThanMem) && (
        <>
          <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <Row label="10. Chiều dài vỏ" value={d.oc_chieu_dai_vo} onChange={(v) => set('oc_chieu_dai_vo', v)} />
          <Row label="11. Chiều rộng vỏ" value={d.oc_chieu_rong_vo} onChange={(v) => set('oc_chieu_rong_vo', v)} />
          <Row label="12. Chiều dày vỏ" value={d.oc_chieu_day_vo} onChange={(v) => set('oc_chieu_day_vo', v)} />
          <Row label="13. Cơ quan sinh dục" value={d.oc_co_quan_sinh_duc} onChange={(v) => set('oc_co_quan_sinh_duc', v)} rows={2} />
          <Row label="14. Màu sắc" value={d.oc_mau_sac} onChange={(v) => set('oc_mau_sac', v)} rows={2} />
        </>
      )}

      {/* ── TS: Thủy sản — Giáp xác ── */}
      {isTSGiapXac && (
        <>
          <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <Row label="10. Hình dạng chùy" value={d.gx_hinh_dang_chuy} onChange={(v) => set('gx_hinh_dang_chuy', v)} />
          <Row label="11. Số gai chùy" value={d.gx_so_gai_chuy} onChange={(v) => set('gx_so_gai_chuy', v)} />
          <Row label="12. Các loại gai (gai gan, gai mắt, gai râu, gai vò mang, gai má)" value={d.gx_cac_loai_gai} onChange={(v) => set('gx_cac_loai_gai', v)} rows={2} />
          <Row label="13. Các loại gờ (gờ mặt vị, gờ mang tim, gờ cổ, gờ bên chùy, gờ sau chùy, gờ trán vị)" value={d.gx_cac_loai_go} onChange={(v) => set('gx_cac_loai_go', v)} rows={2} />
          <Row label="14. Các loại rãnh (rãnh râu mắt, rãnh gan, rãnh mang tim, rãnh bên chùy, rãnh giữa, rãnh cổ, rãnh dọc, rãnh trán vị, rãnh mắt sau)" value={d.gx_cac_loai_ranh} onChange={(v) => set('gx_cac_loai_ranh', v)} rows={2} />
          <Row label="15. Phần bụng: Số đốt" value={d.gx_so_dot_bung} onChange={(v) => set('gx_so_dot_bung', v)} />
          <DualRow label="16. Phần phụ đầu" label1="Râu I" value1={d.gx_rau_1} onChange1={(v) => set('gx_rau_1', v)} label2="Râu II" value2={d.gx_rau_2} onChange2={(v) => set('gx_rau_2', v)} />
          <TriRow
            label="17."
            label1="Hàm trên" value1={d.gx_ham_tren} onChange1={(v) => set('gx_ham_tren', v)}
            label2="Hàm dưới I" value2={d.gx_ham_duoi_1} onChange2={(v) => set('gx_ham_duoi_1', v)}
            label3="Hàm dưới II" value3={d.gx_ham_duoi_2} onChange3={(v) => set('gx_ham_duoi_2', v)}
          />
          <TriRow
            label="18."
            label1="Chân hàm I" value1={d.gx_chan_ham_1} onChange1={(v) => set('gx_chan_ham_1', v)}
            label2="Chân hàm II" value2={d.gx_chan_ham_2} onChange2={(v) => set('gx_chan_ham_2', v)}
            label3="Chân hàm III" value3={d.gx_chan_ham_3} onChange3={(v) => set('gx_chan_ham_3', v)}
          />
          <DualRow label="19." label1="Chân bơi I" value1={d.gx_chan_boi_1} onChange1={(v) => set('gx_chan_boi_1', v)} label2="Chân bơi II" value2={d.gx_chan_boi_2} onChange2={(v) => set('gx_chan_boi_2', v)} />
          <Row label="20. Chân bơi III-V" value={d.gx_chan_boi_3_5} onChange={(v) => set('gx_chan_boi_3_5', v)} />
          <Row label="21. Chân đuôi" value={d.gx_chan_duoi} onChange={(v) => set('gx_chan_duoi', v)} />
          <DualRow label="22." label1="Mang bên" value1={d.gx_mang_ben} onChange1={(v) => set('gx_mang_ben', v)} label2="Mang khớp" value2={d.gx_mang_khop} onChange2={(v) => set('gx_mang_khop', v)} />
          <DualRow label="23." label1="Mang nhánh" value1={d.gx_mang_nhanh} onChange1={(v) => set('gx_mang_nhanh', v)} label2="Mang chân" value2={d.gx_mang_chan} onChange2={(v) => set('gx_mang_chan', v)} />
          <Row label="24. Phần phụ sinh dục đực" value={d.gx_phan_phu_sinh_duc_duc} onChange={(v) => set('gx_phan_phu_sinh_duc_duc', v)} rows={2} />
          <Row label="25. Phần phụ sinh dục cái" value={d.gx_phan_phu_sinh_duc_cai} onChange={(v) => set('gx_phan_phu_sinh_duc_cai', v)} rows={2} />
          <Row label="26. Màu sắc" value={d.gx_mau_sac} onChange={(v) => set('gx_mau_sac', v)} />
        </>
      )}

      {/* ── VS: Vi sinh vật/Nấm (Bảng 17) ── */}
      {isVS && (
        <>
          <SubLabel>- Dữ liệu hình thái (Mô tả hình thái cơ quan sinh dưỡng, cơ quan sinh sản)</SubLabel>
          <p className="text-sm font-semibold text-gray-700 mt-2 mb-1">10. Cơ quan sinh dưỡng (sợi nấm/tế bào khuẩn)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 py-2 border-b border-gray-100">
            <div>
              <label className="text-sm text-gray-600">Hình dạng</label>
              <AutoTextarea minRows={2} value={d.vs_soi_nam_hinh_dang} onChange={(e) => set('vs_soi_nam_hinh_dang', e.target.value)}
                className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent mt-0.5" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Kích thước</label>
              <AutoTextarea minRows={2} value={d.vs_soi_nam_kich_thuoc} onChange={(e) => set('vs_soi_nam_kich_thuoc', e.target.value)}
                className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent mt-0.5" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Màu sắc</label>
              <AutoTextarea minRows={2} value={d.vs_mau_sac} onChange={(e) => set('vs_mau_sac', e.target.value)}
                className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent mt-0.5" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Đa bào/đơn bào</label>
              <AutoTextarea minRows={2} value={d.vs_soi_nam_co_vach} onChange={(e) => set('vs_soi_nam_co_vach', e.target.value)}
                className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent mt-0.5" />
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-2 mb-1">11. Cơ quan sinh sản (bào tử)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 py-2 border-b border-gray-100">
            <div>
              <label className="text-sm text-gray-600">Hình dạng</label>
              <AutoTextarea minRows={2} value={d.vs_bao_tu_vo_tinh} onChange={(e) => set('vs_bao_tu_vo_tinh', e.target.value)}
                className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent mt-0.5" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Kích thước</label>
              <AutoTextarea minRows={2} value={d.vs_kich_thuoc_than} onChange={(e) => set('vs_kich_thuoc_than', e.target.value)}
                className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent mt-0.5" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Màu sắc</label>
              <AutoTextarea minRows={2} value={d.vs_kich_thuoc_re} onChange={(e) => set('vs_kich_thuoc_re', e.target.value)}
                className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent mt-0.5" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Đa bào/đơn bào</label>
              <AutoTextarea minRows={2} value={d.vs_kich_thuoc_mu_dam} onChange={(e) => set('vs_kich_thuoc_mu_dam', e.target.value)}
                className="w-full border-b-2 border-gray-800 focus:border-green-600 outline-none px-1 py-1 text-sm bg-transparent mt-0.5" />
            </div>
          </div>
        </>
      )}

      {/* ── II.B Sinh học, sinh thái ── */}
      <SubTitle>{(isLNCayDacSan || isTTCayngo) ? '. Dữ liệu mô tả đặc điểm sinh học, sinh thái' : 'B. Dữ liệu mô tả đặc điểm sinh học, sinh thái'}</SubTitle>
      {isTTCayAnQua && (
        <>
          <Row label="53. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
          <Row label="54. Đất, thổ nhưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          <Row label="55. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
          <Row label="56. Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />
        </>
      )}
      {(isTTCayche || isTTCaycoi || isTTThuocla) && (
        <>
          <Row label="32. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
          <Row label="33. Đất, thổ nhưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          <Row label="34. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
          <Row label="35. Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />
        </>
      )}
      {isTTCaylaycu && (
        <>
          <Row label="55. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
          <Row label="56. Đất, thổ nhưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          <Row label="57. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
          <Row label="58. Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />
        </>
      )}
      {isTTCaymia && (
        <>
          <Row label="34. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
          <Row label="35. Đất, thổ nhưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          <Row label="36. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
          <Row label="37. Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />
        </>
      )}
      {isTTCayngo && (
        <Row label="" value={d.ngo_sinh_hoc_st} onChange={(v) => set('ngo_sinh_hoc_st', v)} rows={4} />
      )}
      {isTTCayrau && (
        <>
          <Row label="42. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
          <Row label="43. Đất, thổ nhưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          <Row label="44. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
          <Row label="45. Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />
        </>
      )}
      {isTT && !isTTCayAnQua && !isTTCayche && !isTTCaycoi && !isTTCaylaycu && !isTTCaymia && !isTTCayngo && !isTTCayrau && !isTTThuocla && (
        <>
          <Row label="49. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
          <Row label="50. Đất, thổ nhưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          <Row label="51. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
          <Row label="52. Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />
        </>
      )}
      {isLN && !isLNCayDacSan && !isLNTreNua && (
        <>
          <Row label="55. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
          <Row label="56. Đất, thổ nhưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          <Row label="57. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
          <Row label="58. Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />
        </>
      )}
      {isLNCayDacSan && (
        <Row label="" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} rows={2} />
      )}
      {isLNTreNua && (
        <>
          <Row label="32. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
          <Row label="33. Đất, thổ nhưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          <Row label="34. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
          <Row label="35. Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />
        </>
      )}
      {isDL && (
        <>
          <Row label="29. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
          <Row label="30. Đất, thổ nhưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          <Row label="31. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
          <Row label="32. Độ ẩm" value={d.do_am} onChange={(v) => set('do_am', v)} />
        </>
      )}
      {isCN && (
        isCNGiaCam ? (
          <>
            <SubLabel>(Đặc điểm về môi trường sống và chế độ dinh dưỡng)</SubLabel>
            <Row label="21." value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
            <Row label="22." value={d.do_am} onChange={(v) => set('do_am', v)} />
            <Row label="23." value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
            <Row label="24." value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
            <Row label="25." value={d.cn_dac_diem_khac} onChange={(v) => set('cn_dac_diem_khac', v)} />
          </>
        ) : isCNGSGam ? (
          <>
            <SubLabel>. (Đặc điểm về môi trường sống và chế độ dinh dưỡng)</SubLabel>
            <Row label="23." value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} rows={4} />
            <Row label="24." value={d.do_am} onChange={(v) => set('do_am', v)} rows={4} />
            <Row label="25." value={d.anh_sang} onChange={(v) => set('anh_sang', v)} rows={4} />
            <Row label="26." value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          </>
        ) : isCNThuyCam ? (
          <>
            <SubLabel>. (Đặc điểm về môi trường sống và chế độ dinh dưỡng)</SubLabel>
            <Row label="21." value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} rows={4} />
            <Row label="22." value={d.do_am} onChange={(v) => set('do_am', v)} rows={4} />
            <Row label="23." value={d.anh_sang} onChange={(v) => set('anh_sang', v)} rows={4} />
            <Row label="24." value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} rows={4} />
            <Row label="25." value={d.cn_dac_diem_khac} onChange={(v) => set('cn_dac_diem_khac', v)} rows={4} />
          </>
        ) : isCNTieuGiaSuc ? (
          <>
            <SubLabel>. (Đặc điểm về môi trường sống và chế độ dinh dưỡng)</SubLabel>
            <Row label="33." value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} rows={4} />
            <Row label="34." value={d.do_am} onChange={(v) => set('do_am', v)} rows={4} />
            <Row label="35." value={d.anh_sang} onChange={(v) => set('anh_sang', v)} rows={4} />
            <Row label="36." value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} rows={4} />
          </>
        ) : (
          <>
            <Row label="23. Nhiệt độ thích hợp (°C)" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
            <Row label="24. Độ ẩm chuồng trại (%)" value={d.do_am} onChange={(v) => set('do_am', v)} />
            <Row label="25. Điều kiện ánh sáng/chuồng trại" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
            <Row label="26. Yêu cầu đất/nền chuồng và chế độ dinh dưỡng" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          </>
        )
      )}
      {(isTSCa || isTSOc) && (
        <>
          <Row label="22. Môi trường sống (nước mặn, nước lợ, nước ngọt)" value={d.ts_moi_truong_song} onChange={(v) => set('ts_moi_truong_song', v)} rows={2} />
          <Row label="23. Đặc điểm về dinh dưỡng" value={d.ts_dac_diem_dinh_duong} onChange={(v) => set('ts_dac_diem_dinh_duong', v)} rows={2} />
          <Row label="24. Đặc điểm về sinh sản" value={d.ts_dac_diem_sinh_san} onChange={(v) => set('ts_dac_diem_sinh_san', v)} rows={2} />
          <Row label="25." value={d.ts_mua_vu_sinh_san} onChange={(v) => set('ts_mua_vu_sinh_san', v)} rows={2} />
        </>
      )}
      {isTSGiapXac && (
        <>
          <Row label="28. Môi trường sống (nước mặn, nước lợ, nước ngọt)" value={d.ts_moi_truong_song} onChange={(v) => set('ts_moi_truong_song', v)} rows={2} />
          <Row label="29. Đặc điểm về dinh dưỡng" value={d.ts_dac_diem_dinh_duong} onChange={(v) => set('ts_dac_diem_dinh_duong', v)} rows={2} />
          <Row label="30. Đặc điểm về sinh sản" value={d.ts_dac_diem_sinh_san} onChange={(v) => set('ts_dac_diem_sinh_san', v)} rows={2} />
        </>
      )}
      {isTSThanMem && (
        <>
          <Row label="16. Môi trường sống (nước mặn, nước lợ, nước ngọt)" value={d.ts_moi_truong_song} onChange={(v) => set('ts_moi_truong_song', v)} rows={2} />
          <Row label="17. Đặc điểm về dinh dưỡng" value={d.ts_dac_diem_dinh_duong} onChange={(v) => set('ts_dac_diem_dinh_duong', v)} rows={2} />
          <Row label="18. Đặc điểm về sinh sản" value={d.ts_dac_diem_sinh_san} onChange={(v) => set('ts_dac_diem_sinh_san', v)} rows={2} />
        </>
      )}
      {isVS && (
        <>
          <Row label="13. Địa hình" value={d.dat_tho_nhuong} onChange={(v) => set('dat_tho_nhuong', v)} />
          <Row label="14. Thổ nhưỡng/ giá thể sinh dưỡng" value={d.vs_tho_nhuong} onChange={(v) => set('vs_tho_nhuong', v)} />
          <Row label="15. Nhiệt độ" value={d.nhiet_do} onChange={(v) => set('nhiet_do', v)} />
          <Row label="16. Ẩm độ" value={d.do_am} onChange={(v) => set('do_am', v)} />
          <Row label="17. Ánh sáng" value={d.anh_sang} onChange={(v) => set('anh_sang', v)} />
          <Row label="18. Dinh dưỡng" value={d.vs_dinh_duong} onChange={(v) => set('vs_dinh_duong', v)} />
          <Row label="19. Biện pháp phân lập, làm thuần và nhân sinh khố" value={d.vs_bien_phap_canh_tac} onChange={(v) => set('vs_bien_phap_canh_tac', v)} rows={2} />
        </>
      )}

      {/* ── II.C Sinh trưởng, phát triển ── */}
      <SubTitle>{(isLNCayDacSan || isTTCayngo) ? '. Dữ liệu sinh trưởng và phát triển' : 'C. Dữ liệu mô tả đặc điểm sinh trưởng, phát triển'}</SubTitle>
      {isTTCayAnQua && (
        <>
          <Row label="57. Thời vụ gieo trồng" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
          <Row label="58. Thời gian từ khi gieo đến khi mọc(ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
          <Row label="59. Thời gian từ trồng đến ra hoa(ngày)" value={d.caq_thoi_gian_ra_hoa} onChange={(v) => set('caq_thoi_gian_ra_hoa', v)} />
          <Row label="60. Thời gian từ trồng đến đậu quả(ngày)" value={d.caq_thoi_gian_dau_qua} onChange={(v) => set('caq_thoi_gian_dau_qua', v)} />
          <Row label="61. Thời gian từ ra hoa đến thu hoạch(ngày)" value={d.caq_thoi_gian_thu_hoach} onChange={(v) => set('caq_thoi_gian_thu_hoach', v)} />
        </>
      )}
      {(isTTCayche || isTTThuocla) && (
        <>
          <Row label="36. Thời vụ gieo trồng" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
          <Row label="37. Thời gian từ khi gieo đến khi mọc(ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
          <Row label="38. Thời gian từ trồng để ra hoa(năm)" value={d.che_thoi_gian_ra_hoa} onChange={(v) => set('che_thoi_gian_ra_hoa', v)} />
          <Row label="39. Thời gian từ trồng đến đậu quả(năm)" value={d.che_thoi_gian_dau_qua} onChange={(v) => set('che_thoi_gian_dau_qua', v)} />
          <Row label="40. Thời gian từ ra hoa đến thu hoạch(ngày)" value={d.caq_thoi_gian_thu_hoach} onChange={(v) => set('caq_thoi_gian_thu_hoach', v)} />
          <Row label="41." value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
        </>
      )}
      {isTTCaycoi && (
        <>
          <Row label="36. Thời vụ gieo trồng" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} rows={2} />
          <Row label="37. Thời gian từ khi gieo đến khi mọc(ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
          <Row label="38. Thời gian từ trồng để ra hoa(năm)" value={d.che_thoi_gian_ra_hoa} onChange={(v) => set('che_thoi_gian_ra_hoa', v)} />
          <Row label="39. Thời gian từ trồng đến đậu quả(năm)" value={d.che_thoi_gian_dau_qua} onChange={(v) => set('che_thoi_gian_dau_qua', v)} />
          <Row label="40. Thời vụ gieo trồng" value={d.coi_thoi_vu_thu_hoach} onChange={(v) => set('coi_thoi_vu_thu_hoach', v)} />
        </>
      )}
      {isTTCaylaycu && (
        <>
          <Row label="59. Thời vụ gieo trồng" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
          <Row label="60. Thời gian từ khi gieo đến khi mọc(ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
          <Row label="61. Thời gian từ trồng để ra hoa(năm)" value={d.che_thoi_gian_ra_hoa} onChange={(v) => set('che_thoi_gian_ra_hoa', v)} />
          <Row label="62. Thời gian từ trồng đến đậu quả(năm)" value={d.che_thoi_gian_dau_qua} onChange={(v) => set('che_thoi_gian_dau_qua', v)} />
          <Row label="63. Thời gian từ ra hoa đến thu hoạch(ngày)" value={d.caq_thoi_gian_thu_hoach} onChange={(v) => set('caq_thoi_gian_thu_hoach', v)} />
        </>
      )}
      {isTTCaymia && (
        <>
          <Row label="38. Thời vụ gieo trồng" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
          <Row label="39. Thời gian từ khi gieo đến khi mọc(ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
          <Row label="40. Thời gian từ trồng để ra hoa(năm)" value={d.che_thoi_gian_ra_hoa} onChange={(v) => set('che_thoi_gian_ra_hoa', v)} />
          <Row label="41. Thời gian từ trồng đến đậu quả(năm)" value={d.che_thoi_gian_dau_qua} onChange={(v) => set('che_thoi_gian_dau_qua', v)} />
          <Row label="42. Thời gian từ ra hoa đến thu hoạch(ngày)" value={d.caq_thoi_gian_thu_hoach} onChange={(v) => set('caq_thoi_gian_thu_hoach', v)} />
          <Row label="... Thuộc tính mới" value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
        </>
      )}
      {isTTCayngo && (
        <Row label="" value={d.ngo_sinh_truong_pt} onChange={(v) => set('ngo_sinh_truong_pt', v)} rows={4} />
      )}
      {isTTCayrau && (
        <>
          <Row label="46. Thời vụ gieo trồng" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
          <Row label="47. Thời gian từ khi gieo đến khi mọc(ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
          <Row label="48. Thời gian từ trồng để ra hoa(năm)" value={d.che_thoi_gian_ra_hoa} onChange={(v) => set('che_thoi_gian_ra_hoa', v)} />
          <Row label="49. Thời gian từ trồng đến đậu quả(năm)" value={d.che_thoi_gian_dau_qua} onChange={(v) => set('che_thoi_gian_dau_qua', v)} />
          <Row label="50. Thời gian từ ra hoa đến thu hoạch(ngày)" value={d.caq_thoi_gian_thu_hoach} onChange={(v) => set('caq_thoi_gian_thu_hoach', v)} />
          <Row label="..." value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
        </>
      )}
      {isTT && !isTTCayAnQua && !isTTCayche && !isTTCaycoi && !isTTCaylaycu && !isTTCaymia && !isTTCayngo && !isTTCayrau && !isTTThuocla && (
        <>
          <Row label="54. Hình thức sinh trưởng" value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
          <Row label="55. Tỷ lệ nảy mầm" value={d.ti_le_nay_mam} onChange={(v) => set('ti_le_nay_mam', v)} />
          <Row label="56. Điều kiện nảy mầm" value={d.dieu_kien_nay_mam} onChange={(v) => set('dieu_kien_nay_mam', v)} />
          <Row label="57. Thời vụ gieo trồng" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
          <Row label="58. Thời gian từ khi gieo đến khi mọc" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
          <Row label="59. Thời gian từ trồng đến trổ bông" value={d.tt_thoi_gian_tro_bong} onChange={(v) => set('tt_thoi_gian_tro_bong', v)} />
          <Row label="60. Thời gian từ trồng đến chín (thu hoạch)" value={d.tt_thoi_gian_sinh_truong_ngay} onChange={(v) => set('tt_thoi_gian_sinh_truong_ngay', v)} />
        </>
      )}
      {isLNCayDacSan && (
        <Row label="" value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} rows={4} />
      )}
      {isLNTreNua && (
        <>
          <Row label="36. Tỷ lệ nảy mầm (<50%/50–80%/>80%)" value={d.ti_le_nay_mam} onChange={(v) => set('ti_le_nay_mam', v)} />
          <Row label="37. Điều kiện nảy mầm (gieo trực tiếp/xử lý/ủ ấm/...)" value={d.dieu_kien_nay_mam} onChange={(v) => set('dieu_kien_nay_mam', v)} />
          <Row label="38. Thời vụ gieo trồng (xuân/thu/...)" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
          <Row label="39. Thời gian từ khi gieo đến khi mọc (ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
          <Row label="40. Thời gian từ trồng đến ra hoa, kết quả (năm)" value={d.ln_thoi_gian_ra_hoa} onChange={(v) => set('ln_thoi_gian_ra_hoa', v)} />
          <Row label="41. Thời gian từ trồng đến thu hoạch (năm)" value={d.ln_thoi_gian_thu_hoach} onChange={(v) => set('ln_thoi_gian_thu_hoach', v)} />
        </>
      )}
      {isLN && !isLNCayDacSan && !isLNTreNua && (
        <>
          <Row label="59. Hình thức sinh trưởng (liên tục/nhịp điệu/...)" value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
          <Row label="60. Tỷ lệ nảy mầm (<50%/50–80%/>80%)" value={d.ti_le_nay_mam} onChange={(v) => set('ti_le_nay_mam', v)} />
          <Row label="61. Điều kiện nảy mầm (gieo trực tiếp/ủ/...)" value={d.dieu_kien_nay_mam} onChange={(v) => set('dieu_kien_nay_mam', v)} />
          <Row label="62. Thời vụ gieo trồng (xuân/thu/xuân hè/thu đông/quanh năm/...)" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
          <Row label="63. Thời gian từ khi gieo đến khi mọc (ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
          <Row label="64. Thời gian từ trồng đến ra hoa, kết quả (năm)" value={d.ln_thoi_gian_ra_hoa} onChange={(v) => set('ln_thoi_gian_ra_hoa', v)} />
          <Row label="65. Thời gian từ trồng đến thu hoạch (năm)" value={d.ln_thoi_gian_thu_hoach} onChange={(v) => set('ln_thoi_gian_thu_hoach', v)} />
        </>
      )}
      {isDL && (
        <>
          <Row label="33. Hình thức sinh trưởng (liên tục/nhịp điệu/...)" value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
          <Row label="34. Tỷ lệ nảy mầm (<50%/50–80%/>80%)" value={d.ti_le_nay_mam} onChange={(v) => set('ti_le_nay_mam', v)} />
          <Row label="35. Điều kiện nảy mầm (gieo trực tiếp/ủ/ổ ấm/...)" value={d.dieu_kien_nay_mam} onChange={(v) => set('dieu_kien_nay_mam', v)} />
          <Row label="36. Thời vụ gieo trồng (xuân/thu/xuân hè/thu đông/quanh năm/...)" value={d.thoi_vu_gieo_trong} onChange={(v) => set('thoi_vu_gieo_trong', v)} />
          <Row label="37. Thời gian từ khi gieo đến khi mọc (ngày)" value={d.thoi_gian_khi_gieo_moc} onChange={(v) => set('thoi_gian_khi_gieo_moc', v)} />
          <Row label="38. Thời gian từ trồng đến ra hoa, kết quả (năm)" value={d.thoi_gian_gieo_hoa} onChange={(v) => set('thoi_gian_gieo_hoa', v)} />
          <Row label="39. Thời gian từ trồng đến thu hoạch (năm)" value={d.thoi_gian_gieo_qua} onChange={(v) => set('thoi_gian_gieo_qua', v)} />
        </>
      )}
      {isCN && (
        isCNGiaCam ? (
          <>
            <SubLabel>(Các chỉ tiêu về kinh tế, kỹ thuật bao gồm tất cả các đặc tính về sinh trưởng, phát triển, thích nghi và sản xuất của vật nuôi)</SubLabel>
            <Row label="26." value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
            <Row label="27." value={d.cn_tuoi_thanh_thuc} onChange={(v) => set('cn_tuoi_thanh_thuc', v)} />
            <Row label="28." value={d.cn_thoi_gian_mang_thai} onChange={(v) => set('cn_thoi_gian_mang_thai', v)} />
            <Row label="29." value={d.cn_so_lua_nam} onChange={(v) => set('cn_so_lua_nam', v)} />
            <Row label="30." value={d.cn_san_xuat_trung} onChange={(v) => set('cn_san_xuat_trung', v)} />
          </>
        ) : isCNGSGam ? (
          <>
            <SubLabel>. (Các chỉ tiêu về kinh tế, kỹ thuật bao gồm tất cả các đặc tính về sinh trưởng, phát triển, thích nghi và sản xuất của vật nuôi)</SubLabel>
            <Row label="27." value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} rows={4} />
            <Row label="28." value={d.cn_tuoi_thanh_thuc} onChange={(v) => set('cn_tuoi_thanh_thuc', v)} rows={4} />
            <Row label="29." value={d.cn_thoi_gian_mang_thai} onChange={(v) => set('cn_thoi_gian_mang_thai', v)} rows={4} />
            <Row label="30." value={d.cn_so_lua_nam} onChange={(v) => set('cn_so_lua_nam', v)} />
            <Row label="31." value={d.cn_so_con_lua} onChange={(v) => set('cn_so_con_lua', v)} />
            <Row label="32." value={d.cn_san_xuat_trung} onChange={(v) => set('cn_san_xuat_trung', v)} />
          </>
        ) : isCNThuyCam ? (
          <>
            <SubLabel>(Các chỉ tiêu về kinh tế, kỹ thuật bao gồm tất cả các đặc tính về sinh trưởng, phát triển, thích nghi và sản xuất của vật nuôi)</SubLabel>
            <Row label="26." value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} rows={4} />
            <Row label="27." value={d.cn_tuoi_thanh_thuc} onChange={(v) => set('cn_tuoi_thanh_thuc', v)} rows={4} />
            <Row label="28." value={d.cn_thoi_gian_mang_thai} onChange={(v) => set('cn_thoi_gian_mang_thai', v)} rows={4} />
            <Row label="29." value={d.cn_so_lua_nam} onChange={(v) => set('cn_so_lua_nam', v)} rows={4} />
            <Row label="30." value={d.cn_so_con_lua} onChange={(v) => set('cn_so_con_lua', v)} rows={4} />
          </>
        ) : isCNTieuGiaSuc ? (
          <>
            <SubLabel>(Các chỉ tiêu về kinh tế, kỹ thuật bao gồm tất cả các đặc tính về sinh trưởng, phát triển, thích nghi và sản xuất của vật nuôi)</SubLabel>
            <Row label="37." value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} rows={4} />
            <Row label="38." value={d.cn_tuoi_thanh_thuc} onChange={(v) => set('cn_tuoi_thanh_thuc', v)} rows={4} />
            <Row label="39." value={d.cn_thoi_gian_mang_thai} onChange={(v) => set('cn_thoi_gian_mang_thai', v)} rows={4} />
            <Row label="40." value={d.cn_so_lua_nam} onChange={(v) => set('cn_so_lua_nam', v)} rows={4} />
            <Row label="41." value={d.cn_so_con_lua} onChange={(v) => set('cn_so_con_lua', v)} rows={4} />
            <Row label="42." value={d.cn_san_xuat_trung} onChange={(v) => set('cn_san_xuat_trung', v)} rows={4} />
          </>
        ) : (
          <>
            <Row label="27. Hình thức sinh trưởng (liên tục/theo mùa/...)" value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
            <Row label="28. Tuổi thành thục sinh dục (tháng)" value={d.cn_tuoi_thanh_thuc} onChange={(v) => set('cn_tuoi_thanh_thuc', v)} />
            <Row label="29. Thời gian mang thai/ấp trứng (ngày)" value={d.cn_thoi_gian_mang_thai} onChange={(v) => set('cn_thoi_gian_mang_thai', v)} />
            <Row label="30. Số lứa/năm" value={d.cn_so_lua_nam} onChange={(v) => set('cn_so_lua_nam', v)} />
            <Row label="31. Số con/lứa (trung bình)" value={d.cn_so_con_lua} onChange={(v) => set('cn_so_con_lua', v)} />
            <Row label="32. Sản lượng trứng/sữa (quả hoặc L/chu kỳ, N/A nếu không áp dụng)" value={d.cn_san_xuat_trung} onChange={(v) => set('cn_san_xuat_trung', v)} />
          </>
        )
      )}
      {(isTSCa || isTSOc) && (
        <>
          <Row label="26. Thời gian sinh trưởng" value={d.ts_thoi_gian_sinh_truong_ts} onChange={(v) => set('ts_thoi_gian_sinh_truong_ts', v)} rows={2} />
          <Row label="27. Các giai đoạn sinh trưởng (ấu trùng, con non, trưởng thành)" value={d.ts_cac_giai_doan_sinh_truong} onChange={(v) => set('ts_cac_giai_doan_sinh_truong', v)} rows={2} />
          <Row label="28. Thời gian thành thục sinh dục" value={d.ts_thoi_gian_thanh_thuc_sinh_duc} onChange={(v) => set('ts_thoi_gian_thanh_thuc_sinh_duc', v)} rows={2} />
        </>
      )}
      {isTSGiapXac && (
        <>
          <Row label="31. Thời gian sinh trưởng" value={d.ts_thoi_gian_sinh_truong_ts} onChange={(v) => set('ts_thoi_gian_sinh_truong_ts', v)} rows={2} />
          <Row label="32. Các giai đoạn sinh trưởng (ấu trùng, con non, trưởng thành)" value={d.ts_cac_giai_doan_sinh_truong} onChange={(v) => set('ts_cac_giai_doan_sinh_truong', v)} rows={2} />
          <Row label="33. Thời gian thành thục sinh dục" value={d.ts_thoi_gian_thanh_thuc_sinh_duc} onChange={(v) => set('ts_thoi_gian_thanh_thuc_sinh_duc', v)} rows={2} />
          <Row label="... ..." value={d.ts_mua_vu_sinh_san} onChange={(v) => set('ts_mua_vu_sinh_san', v)} rows={2} />
        </>
      )}
      {isTSThanMem && (
        <>
          <Row label="19. Thời gian sinh trưởng" value={d.ts_thoi_gian_sinh_truong_ts} onChange={(v) => set('ts_thoi_gian_sinh_truong_ts', v)} rows={2} />
          <Row label="20. Các giai đoạn sinh trưởng (ấu trùng, con non, trưởng thành)" value={d.ts_cac_giai_doan_sinh_truong} onChange={(v) => set('ts_cac_giai_doan_sinh_truong', v)} rows={2} />
          <Row label="21. Thời gian thành thục sinh dục" value={d.ts_thoi_gian_thanh_thuc_sinh_duc} onChange={(v) => set('ts_thoi_gian_thanh_thuc_sinh_duc', v)} rows={2} />
        </>
      )}
      {isVS && (
        <>
          <Row label="20. Sinh trưởng (giai đoạn phát triển sợi nấm)" value={d.vs_toc_do_sinh_truong} onChange={(v) => set('vs_toc_do_sinh_truong', v)} />
          <Row label="21. Phát triển (giai đoạn hình thành bào tử)" value={d.hinh_thuc_sinh_truong} onChange={(v) => set('hinh_thuc_sinh_truong', v)} />
          <Row label="22. Yêu cầu về môi trường nuôi cấy" value={d.vs_thoi_gian_khuan_lac} onChange={(v) => set('vs_thoi_gian_khuan_lac', v)} />
        </>
      )}

      <SectionTitle>III. Ghi chú</SectionTitle>
      <div className="py-2">
        <p className="text-xs text-gray-500 mb-1">{(isLNCayDacSan || isTTCayngo) ? '. Quan sát đánh giá khả năng chống chịu điều kiện bất thuận, sâu bệnh, chất lượng' : '(Quan sát khả năng chống chịu sinh thái bất thuận, khả năng kháng sâu/bệnh)'}</p>
        <AutoTextarea minRows={3} value={d.ghi_chu} onChange={(e) => set('ghi_chu', e.target.value)}
          className="w-full border-b-2 border-gray-800 px-1 py-1 text-sm outline-none focus:border-green-600 bg-transparent" />
      </div>

      <SectionTitle>IV. Tài liệu tham khảo</SectionTitle>
      <div className="py-2">
        <p className="text-xs text-gray-500 mb-1">(Liệt kê danh mục tài liệu tham khảo để thực hiện Phiếu mô tả đánh giá ban đầu nguồn gen)</p>
        <AutoTextarea minRows={3} value={d.tai_lieu_tham_khao} onChange={(e) => set('tai_lieu_tham_khao', e.target.value)}
          className="w-full border-b-2 border-gray-800 px-1 py-1 text-sm outline-none focus:border-green-600 bg-transparent" />
      </div>
    </div>
  );
}

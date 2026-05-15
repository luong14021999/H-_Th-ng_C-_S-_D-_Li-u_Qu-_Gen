import ExcelJS from "exceljs";
import { NguonGen } from "@/data/nguonGen";
import { ExtendedFormData, defaultForm2, defaultForm3, defaultForm4 } from "@/data/extendedTypes";

type WB = ExcelJS.Workbook;
type WS = ExcelJS.Worksheet;

function headerStyle(ws: WS, row: number, col: number, value: string) {
  const cell = ws.getCell(row, col);
  cell.value = value;
  cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1B5E20" } };
  cell.alignment = { vertical: "middle", wrapText: true };
}

function sectionStyle(ws: WS, row: number, value: string) {
  ws.mergeCells(row, 1, row, 3);
  const cell = ws.getCell(row, 1);
  cell.value = value;
  cell.font = { bold: true, size: 10 };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F5E9" } };
  cell.alignment = { vertical: "middle" };
  ws.getRow(row).height = 20;
}

function dataRow(ws: WS, row: number, label: string, value: string) {
  const labelCell = ws.getCell(row, 1);
  labelCell.value = label;
  labelCell.font = { size: 10 };
  labelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF9FBE7" } };
  labelCell.alignment = { vertical: "top", wrapText: true };

  ws.mergeCells(row, 2, row, 3);
  const valCell = ws.getCell(row, 2);
  valCell.value = value || "";
  valCell.font = { size: 10 };
  valCell.alignment = { vertical: "top", wrapText: true };
  valCell.border = { bottom: { style: "thin", color: { argb: "FFCCCCCC" } } };

  const lines = Math.max(1, Math.ceil((value || "").length / 60));
  ws.getRow(row).height = Math.max(18, lines * 15);
}

function titleRow(ws: WS, row: number, title: string, subtitle: string) {
  ws.mergeCells(row, 1, row, 3);
  const c1 = ws.getCell(row, 1);
  c1.value = title;
  c1.font = { bold: true, size: 13 };
  c1.alignment = { horizontal: "center" };
  ws.getRow(row).height = 22;

  ws.mergeCells(row + 1, 1, row + 1, 3);
  const c2 = ws.getCell(row + 1, 1);
  c2.value = subtitle;
  c2.font = { bold: true, size: 11, color: { argb: "FF388E3C" } };
  c2.alignment = { horizontal: "center" };
  ws.getRow(row + 1).height = 18;
}

function setupColumns(ws: WS) {
  ws.columns = [
    { width: 40 },
    { width: 30 },
    { width: 30 },
  ];
}

function buildForm2Sheet(ws: WS, item: NguonGen, ext: ExtendedFormData) {
  setupColumns(ws);
  const f2 = { ...defaultForm2(), ...ext.form2 };
  const nhom = item.nhom;
  const isTTLN = !nhom || ['TT', 'LN'].includes(nhom);
  const isDL = nhom === 'DL';
  const isCN = nhom === 'CN';
  const isTS = nhom === 'TS';
  const isVS = nhom === 'VS';

  titleRow(ws, 1, "PHIẾU ĐIỀU TRA THU THẬP NGUỒN GEN", "PHIẾU SỐ 01/ĐTNG");
  headerStyle(ws, 3, 1, "Chỉ tiêu");
  headerStyle(ws, 3, 2, "Giá trị");
  ws.mergeCells(3, 2, 3, 3);
  ws.getRow(3).height = 22;

  let r = 4;
  sectionStyle(ws, r++, "I. THÔNG TIN CHUNG");
  dataRow(ws, r++, "1. Mã thu thập", f2.ma_thu_thap);
  dataRow(ws, r++, "2. Tên nguồn gen — Tên Việt Nam (Bộ/Họ/Chi/Loài)", `${f2.ten_viet_bo} / ${f2.ten_viet_ho} / ${f2.ten_viet_chi} / ${f2.ten_viet_loai}`);
  dataRow(ws, r++, "   Tên khoa học (Bộ/Họ/Chi/Loài)", `${f2.ten_khoa_bo} / ${f2.ten_khoa_ho} / ${f2.ten_khoa_chi} / ${f2.ten_khoa_loai}`);
  dataRow(ws, r++, "   Tên khác", f2.ten_khac_2);
  dataRow(ws, r++, "3. Ngày thu thập", f2.ngay_thu_thap);
  dataRow(ws, r++, "4. Nơi thu thập (Thôn/Xã/Huyện/Tỉnh)", `${f2.thon_ban} / ${f2.xa_phuong} / ${f2.huyen_thi_tp} / ${f2.tinh}`);
  dataRow(ws, r++, "   Tọa độ X / Y", `${f2.toa_do_x} / ${f2.toa_do_y}`);
  dataRow(ws, r++, "   Độ cao (m)", f2.do_cao);
  dataRow(ws, r++, "5. Tên người/cơ quan gieo, trồng/cấp giống", f2.ten_nguon_goc);
  dataRow(ws, r++, "6. Tên người thu thập", f2.ten_nguoi_thu_thap);
  dataRow(ws, r++, "7. Cơ quan điều tra, thu thập", f2.co_quan_dieu_tra);

  sectionStyle(ws, r++, "II. THÔNG TIN MẪU THU THẬP");
  dataRow(ws, r++, "8. Nguồn gốc mẫu thu thập", f2.nguon_goc_mau);
  dataRow(ws, r++, "9. Dạng mẫu được thu thập", `${f2.dang_mau}${f2.dang_mau_khac ? ' — ' + f2.dang_mau_khac : ''}`);
  dataRow(ws, r++, "10. Bản chất di truyền của mẫu", f2.ban_chat_truyen);
  dataRow(ws, r++, "11. Mức độ thuần của mẫu", f2.muc_do_thuan);
  dataRow(ws, r++, "12. Thời gian tồn tại của giống/loài", f2.thoi_gian_ton_tai);
  dataRow(ws, r++, "13. Mức độ phổ biến", f2.muc_do_pho_bien);
  dataRow(ws, r++, "14. Xu hướng phát triển", f2.xu_huong_phat_trien);

  sectionStyle(ws, r++, "III. ĐIỀU KIỆN SINH TRƯỞNG CỦA LOÀI");
  if (isTTLN) {
    dataRow(ws, r++, "16. Địa hình", f2.dia_hinh);
    dataRow(ws, r++, "17. Loại đất", `${f2.loai_dat}${f2.loai_dat_khac ? ' — ' + f2.loai_dat_khac : ''}`);
    dataRow(ws, r++, "18. Màu đất", f2.mau_dat);
    dataRow(ws, r++, "19. Độ chua của đất", f2.do_chua);
    dataRow(ws, r++, "20. Vật liệu nhân giống", `${f2.vat_lieu_nhan_giong}${f2.vat_lieu_nhan_giong_khac ? ' — ' + f2.vat_lieu_nhan_giong_khac : ''}`);
    dataRow(ws, r++, "21. Nguồn gốc giống", f2.nguon_giong_ruong);
    dataRow(ws, r++, "22. Phương thức canh tác", f2.phuong_thuc_canh_tac);
    dataRow(ws, r++, "23. Phương pháp gieo trồng", f2.phuong_phap_gieo_trong);
    dataRow(ws, r++, "24. Thời vụ trồng", f2.thoi_vu_trong);
    dataRow(ws, r++, "25. Thời gian sinh trưởng hoặc thành thục", f2.thoi_gian_sinh_truong);
    dataRow(ws, r++, "26. Phân bón", f2.phan_bon);
    dataRow(ws, r++, "27. Biện pháp phòng trừ sâu bệnh", f2.phong_tru_sau_benh);
  } else if (isDL) {
    dataRow(ws, r++, "16. Nguồn gốc giống", f2.nguon_giong_ruong);
    dataRow(ws, r++, "17. Loại hình nuôi trồng", f2.dl_loai_hinh_nuoi_trong);
    dataRow(ws, r++, "18. Kỹ thuật nuôi trồng", f2.dl_ky_thuat_nuoi_trong);
    dataRow(ws, r++, "19. Thời vụ trồng", f2.thoi_vu_trong);
    dataRow(ws, r++, "20. Thời vụ thu hoạch", f2.dl_thoi_vu_thu_hoach);
    dataRow(ws, r++, "21. Vật liệu nhân giống", `${f2.vat_lieu_nhan_giong}${f2.vat_lieu_nhan_giong_khac ? ' — ' + f2.vat_lieu_nhan_giong_khac : ''}`);
    dataRow(ws, r++, "22. Thời gian sinh trưởng (từ trồng đến thu hoạch)", f2.thoi_gian_sinh_truong);
    dataRow(ws, r++, "23. Phân bón/dinh dưỡng bổ sung", f2.phan_bon);
    dataRow(ws, r++, "24. Biện pháp phòng trừ sâu bệnh", f2.phong_tru_sau_benh);
  } else if (isCN) {
    dataRow(ws, r++, "16. Nguồn gốc giống", f2.cn_nguon_goc_giong);
    dataRow(ws, r++, "17. Loại hình nuôi/trồng", f2.cn_hinh_thuc_chan_nuoi);
    dataRow(ws, r++, "18. Thức ăn", f2.cn_thuc_an);
    dataRow(ws, r++, "19. Nguồn gốc giống (tự để giống/mua từ CSSX/...)", f2.nguon_giong_ruong);
    dataRow(ws, r++, "20. Phương thức nuôi", f2.cn_phuong_thuc_nuoi);
    dataRow(ws, r++, "21. Thời gian sinh trưởng hoặc tuổi thành thục", f2.thoi_gian_sinh_truong);
    dataRow(ws, r++, "22. Biện pháp phòng trừ sâu bệnh", f2.cn_phong_dich);
  } else if (isTS) {
    dataRow(ws, r++, "16. Nguồn gốc giống", f2.ts_nguon_goc_giong);
    dataRow(ws, r++, "17. Loại hình nuôi/trồng", f2.ts_loai_hinh_nuoi);
    dataRow(ws, r++, "18. Thức ăn", f2.ts_thuc_an);
    dataRow(ws, r++, "19. Nguồn gốc giống (tự để giống/mua từ CSSX/...)", f2.nguon_giong_ruong);
    dataRow(ws, r++, "20. Phương thức nuôi", f2.ts_phuong_thuc_nuoi);
    dataRow(ws, r++, "21. Thời gian sinh trưởng hoặc tuổi thành thục", f2.thoi_gian_sinh_truong);
    dataRow(ws, r++, "22. Biện pháp phòng trừ sâu bệnh", f2.phong_tru_sau_benh);
  } else if (isVS) {
    dataRow(ws, r++, "12. Nguồn gốc giống/chủng VSV", f2.nguon_giong_ruong);
    dataRow(ws, r++, "13. Loại hình sản xuất", f2.dl_loai_hinh_nuoi_trong);
    dataRow(ws, r++, "14. Kỹ thuật nuôi trồng", f2.dl_ky_thuat_nuoi_trong);
    dataRow(ws, r++, "15. Thời vụ trồng", f2.thoi_vu_trong);
    dataRow(ws, r++, "16. Thời vụ thu hoạch", f2.dl_thoi_vu_thu_hoach);
    dataRow(ws, r++, "17. Vật liệu nhân giống", `${f2.vat_lieu_nhan_giong}${f2.vat_lieu_nhan_giong_khac ? ' — ' + f2.vat_lieu_nhan_giong_khac : ''}`);
    dataRow(ws, r++, "18. Môi trường giá thể dinh dưỡng", f2.vs_moi_truong_nuoi_cay);
  }

  sectionStyle(ws, r++, "IV. SỬ DỤNG, BẢO QUẢN, CHẾ BIẾN");
  if (isDL) {
    dataRow(ws, r++, "25. Mục đích sử dụng chính", f2.muc_dich_su_dung);
    dataRow(ws, r++, "26. Bộ phận thu hoạch, sử dụng chính", f2.phan_cay_su_dung);
    dataRow(ws, r++, "27. Phương pháp thu hoạch sản phẩm", f2.thu_hoach);
    dataRow(ws, r++, "28. Phương pháp bảo quản sản phẩm", f2.phuong_phap_bao_quan_sp);
    dataRow(ws, r++, "29. Cách chế biến", f2.cach_che_bien);
    dataRow(ws, r++, "30. Phương pháp để giống", f2.phuong_phap_de_giong);
    dataRow(ws, r++, "31. Kinh nghiệm, tiêu chí chọn giống", f2.kinh_nghiem_chon_giong);
  } else if (isCN || isTS) {
    dataRow(ws, r++, "23. Bộ phận được thu hoạch, sử dụng chính", f2.phan_cay_su_dung);
    dataRow(ws, r++, "24. Mục đích sử dụng chính", f2.muc_dich_su_dung);
    dataRow(ws, r++, "25. Phương pháp thu hoạch sản phẩm", f2.thu_hoach);
    dataRow(ws, r++, "26. Phương pháp bảo quản sản phẩm", f2.phuong_phap_bao_quan_sp);
    dataRow(ws, r++, "27. Cách chế biến", f2.cach_che_bien);
    dataRow(ws, r++, "28. Phương pháp để giống", f2.phuong_phap_de_giong);
    dataRow(ws, r++, "29. Kinh nghiệm, tiêu chí chọn giống", f2.kinh_nghiem_chon_giong);
  } else if (isVS) {
    dataRow(ws, r++, "19. Mục đích sử dụng chính", f2.muc_dich_su_dung);
    dataRow(ws, r++, "20. Bộ phận được thu hoạch, sử dụng chính", f2.phan_cay_su_dung);
    dataRow(ws, r++, "21. Khai thác sản phẩm", f2.thu_hoach);
    dataRow(ws, r++, "22. Phương pháp bảo quản sản phẩm", f2.phuong_phap_bao_quan_sp);
    dataRow(ws, r++, "23. Phương pháp sản xuất, chế biến", f2.cach_che_bien);
    dataRow(ws, r++, "24. Phương pháp duy trì, bảo quản", f2.phuong_phap_de_giong);
    dataRow(ws, r++, "25. Kinh nghiệm, tiêu chí chọn chủng/giống", f2.kinh_nghiem_chon_giong);
  } else {
    // TT / LN
    dataRow(ws, r++, "28. Bộ phận của cây được thu hoạch, sử dụng chính", f2.phan_cay_su_dung);
    dataRow(ws, r++, "29. Mục đích sử dụng chính", f2.muc_dich_su_dung);
    dataRow(ws, r++, "30. Phương pháp thu hoạch sản phẩm", f2.thu_hoach);
    dataRow(ws, r++, "31. Phương pháp bảo quản sản phẩm", f2.phuong_phap_bao_quan_sp);
    dataRow(ws, r++, "32. Cách chế biến", f2.cach_che_bien);
    dataRow(ws, r++, "33. Phương pháp để giống", f2.phuong_phap_de_giong);
    dataRow(ws, r++, "34. Kinh nghiệm, tiêu chí chọn giống", f2.kinh_nghiem_chon_giong);
  }

  sectionStyle(ws, r++, "V. ĐẶC TÍNH NỔI BẬT");
  dataRow(ws, r++, "Đặc tính nổi bật", f2.dac_tinh_noi_bat);
}

function buildForm3Sheet(ws: WS, item: NguonGen, ext: ExtendedFormData) {
  setupColumns(ws);
  const f3 = { ...defaultForm3(), ...ext.form3 };
  const nhom = item.nhom;
  const isTT = nhom === 'TT';
  const isLN = nhom === 'LN';
  const isDL = !nhom || nhom === 'DL';
  const isCN = nhom === 'CN';
  const isTS = nhom === 'TS';
  const isVS = nhom === 'VS';
  const phan_nhom = item.phan_nhom;
  const isCNGiaCam = isCN && phan_nhom === 'Gia cầm và chim';
  const isCNGSGam = isCN && phan_nhom === 'GS nhai lại, gặm nhấm';
  const isCNThuyCam = isCN && phan_nhom === 'Thủy cầm';
  const isCNTieuGiaSuc = isCN && phan_nhom === 'Tiểu gia súc';
  const isLNCayDacSan = isLN && phan_nhom === 'Cây đặc sản';
  const isLNTreNua = isLN && phan_nhom === 'Tre nứa';

  titleRow(ws, 1, "PHIẾU MÔ TẢ, ĐÁNH GIÁ BAN ĐẦU NGUỒN GEN", "PHIẾU SỐ 02/ĐGBĐ");
  headerStyle(ws, 3, 1, "Chỉ tiêu");
  headerStyle(ws, 3, 2, "Giá trị");
  ws.mergeCells(3, 2, 3, 3);
  ws.getRow(3).height = 22;

  let r = 4;
  sectionStyle(ws, r++, "I. THÔNG TIN CHUNG");
  dataRow(ws, r++, "1. Mã số hệ thống", f3.ma_so_he_thong);
  dataRow(ws, r++, "2. Mã số nhiệm vụ", f3.ma_so_nhiem_vu);
  dataRow(ws, r++, "3. Mã nguồn gen", item.ma);
  dataRow(ws, r++, "4. Tên giống", f3.ten_giong);
  dataRow(ws, r++, "5. Nguồn giống (nguồn giống đem nhân)", f3.nguon_giong);
  dataRow(ws, r++, "6. Nơi nhân giống/nuôi/trồng/cấp giống", f3.noi_nhan_giong);
  dataRow(ws, r++, "7. Người mô tả, đánh giá", f3.nguoi_mo_ta);
  dataRow(ws, r++, "8. Cơ quan mô tả, đánh giá", f3.co_quan_mo_ta);

  sectionStyle(ws, r++, "II.A DỮ LIỆU MÔ TẢ ĐẶC ĐIỂM HÌNH THÁI");
  if (!isLNCayDacSan) dataRow(ws, r++, "9. Đặc điểm chung", f3.dac_diem_chung);

  if (isTT) {
    dataRow(ws, r++, "10. Chiều cao mạ", f3.tt_chieu_cao_ma);
    dataRow(ws, r++, "11. Chiều dài lá", f3.tt_chieu_dai_la);
    dataRow(ws, r++, "12. Chiều rộng lá", f3.tt_chieu_rong_la);
    dataRow(ws, r++, "13. Độ phủ lông của lá", f3.tt_do_phu_long_la);
    dataRow(ws, r++, "14. Màu phiến lá", f3.tt_mau_phien_la);
    dataRow(ws, r++, "15. Màu bẹ lá", f3.tt_mau_be_la);
    dataRow(ws, r++, "16. Góc lá", f3.tt_goc_la);
    dataRow(ws, r++, "17. Góc lá đòng", f3.tt_goc_la_dong);
    dataRow(ws, r++, "18. Dài thìa lìa", f3.tt_dai_thia_lia);
    dataRow(ws, r++, "19. Màu thìa lìa", f3.tt_mau_thia_lia);
    dataRow(ws, r++, "20. Dạng thìa lìa", f3.tt_dang_thia_lia);
    dataRow(ws, r++, "21. Màu cổ lá", f3.tt_mau_co_la);
    dataRow(ws, r++, "22. Màu tai lá", f3.tt_mau_tai_la);
    dataRow(ws, r++, "23. Chiều dài thân", f3.tt_chieu_dai_than);
    dataRow(ws, r++, "24. Số rãnh", f3.tt_so_ranh);
    dataRow(ws, r++, "25. Góc thân", f3.tt_goc_than);
    dataRow(ws, r++, "26. Đường kính ống dạ", f3.tt_duong_kinh_ong_da);
    dataRow(ws, r++, "27. Màu sắc ống dạ", f3.tt_mau_sac_ong_da);
    dataRow(ws, r++, "28. Độ cứng cây", f3.tt_do_cung_cay);
    dataRow(ws, r++, "29. Dài bông", f3.tt_dai_bong);
    dataRow(ws, r++, "30. Dạng bông", f3.tt_dang_bong);
    dataRow(ws, r++, "31. Phân nhánh thứ cấp trên bông", f3.tt_phan_nhanh_thu_cap);
    dataRow(ws, r++, "32. Độ thoát cổ bông", f3.tt_do_thoat_co_bong);
    dataRow(ws, r++, "33. Trục bông", f3.tt_truc_bong);
    dataRow(ws, r++, "34. Độ tàn lá", f3.tt_do_tan_la);
    dataRow(ws, r++, "35. Độ rụng hạt", f3.tt_do_rung_hat);
    dataRow(ws, r++, "36. Độ dai của hạt khi tút", f3.tt_do_dai_hat_tut);
    dataRow(ws, r++, "37. Râu", f3.tt_rau);
    dataRow(ws, r++, "38. Màu râu", f3.tt_mau_rau);
    dataRow(ws, r++, "39. Màu mỏ hạt", f3.tt_mau_mo_hat);
    dataRow(ws, r++, "40. Màu vỏ trấu", f3.tt_mau_vo_trau);
    dataRow(ws, r++, "41. Độ phủ lông vỏ trấu", f3.tt_do_phu_long_vo_trau);
    dataRow(ws, r++, "42. Màu mày hạt", f3.tt_mau_may_hat);
    dataRow(ws, r++, "43. Chiều dài mày hạt", f3.tt_chieu_dai_may_hat);
    dataRow(ws, r++, "44. Độ thụ phấn của bông", f3.tt_do_thu_phan_bong);
    dataRow(ws, r++, "45. Trọng lượng 1000 hạt", f3.tt_trong_luong_1000_hat);
    dataRow(ws, r++, "46. Chiều dài hạt (mm)", f3.tt_chieu_dai_hat);
    dataRow(ws, r++, "47. Chiều rộng hạt (mm)", f3.tt_chieu_rong_hat);
    dataRow(ws, r++, "48. Màu vỏ gạo", f3.tt_mau_vo_gao);
  } else if (isLN && !isLNCayDacSan && !isLNTreNua) {
    dataRow(ws, r++, "10. Dạng cây (gỗ lớn/gỗ nhỏ/cây bụi/...)", f3.ln_dang_cay);
    dataRow(ws, r++, "11. Chiều cao cây — Chiều cao (Hvn) (m)", f3.ln_chieu_cao_hvn);
    dataRow(ws, r++, "11. Chiều cao cây — Chiều cao dưới cành (Hdc) (m)", f3.ln_chieu_cao_hdc);
    dataRow(ws, r++, "12. Đường kính ngang ngực D1.3 (cm)", f3.ln_duong_kinh_d13);
    dataRow(ws, r++, "13. Đặc điểm gốc cây (có đế/có bạnh vè/có rễ khí sinh/có gai/...)", f3.ln_dac_diem_goc);
    dataRow(ws, r++, "14. Sắc tố cành non (xanh vàng/xanh lục/gi sắt/tím/...)", f3.ln_sac_to_canh_non);
    dataRow(ws, r++, "15. Lông ở cành non (có/không)", f3.ln_long_canh_non);
    dataRow(ws, r++, "16. Góc phân cành (<45°/45°–90°/>90°)", f3.ln_goc_phan_canh);
    dataRow(ws, r++, "17. Hình thái tán cây (tròn/trứng/trứng ngược/thuần/quạt/...)", f3.ln_hinh_thai_tan);
    dataRow(ws, r++, "18. Đường kính tán: (Dt) (m)", f3.ln_duong_kinh_tan);
    dataRow(ws, r++, "19. Hình dạng lá (hình trứng/trứng ngược/xẻ thùy lông chim/xẻ thùy chân vịt/hình tim/hình kiếm/...)", f3.ln_hinh_dang_la);
    dataRow(ws, r++, "20. Kiểu lá (đơn/kép lông chim 1-2 lần chẵn/lẻ/kép chân vịt/...)", f3.ln_kieu_la);
    dataRow(ws, r++, "21. Cuống lá (có/không)", f3.ln_cuong_la);
    dataRow(ws, r++, "22. Kích thước lá — Dài (cm)", f3.ln_kich_thuoc_la);
    dataRow(ws, r++, "22. Kích thước lá — Rộng (cm)", f3.ln_kich_thuoc_la_rong);
    dataRow(ws, r++, "23. Gân lá (song song/hình lông chim/hình chân vịt/...)", f3.ln_gan_la);
    dataRow(ws, r++, "24. Màu lá (xanh thẫm/xanh nhạt/xanh tím/vàng nhạt/...)", f3.ln_mau_la);
    dataRow(ws, r++, "25. Màu lá non (xanh thẫm/xanh nhạt/xanh tím/vàng nhạt/...)", f3.ln_mau_la_non);
    dataRow(ws, r++, "26. Mép lá (liền/lượn sóng/răng cưa/xẻ thùy/...)", f3.ln_mep_la);
    dataRow(ws, r++, "27. Đầu lá (nhọn/nhọn gấp/tù/tròn/...)", f3.ln_dau_la);
    dataRow(ws, r++, "28. Đuôi lá (hình nêm/tròn/tù/hình khiên/...)", f3.ln_duoi_la);
    dataRow(ws, r++, "29. Sắp xếp lá (mọc cách/mọc đối/mọc vòng/...)", f3.ln_sap_xep_la);
    dataRow(ws, r++, "30. Kiểu hoa (đơn/phức/tự đơn trục/tự hợp trục/tự hỗn hợp/...)", f3.ln_kieu_hoa);
    dataRow(ws, r++, "31. Kiểu đính hoa (nách lá/ngọn cành/đối lá/...)", f3.ln_kieu_dinh_hoa);
    dataRow(ws, r++, "32. Kích thước đường kính hoa (mm)", f3.ln_kich_thuoc_hoa);
    dataRow(ws, r++, "33. Hình dạng hoa (hình chuông/hình phễu/hình ống/hình đĩa/...)", f3.ln_hinh_dang_hoa);
    dataRow(ws, r++, "34. Đế hoa (phẳng/lồi/lõm/...)", f3.ln_de_hoa);
    dataRow(ws, r++, "35. Đài hoa (hình ống/hình chuông/hình bẹ/xẻ thùy/...)", f3.ln_dai_hoa);
    dataRow(ws, r++, "36. Tràng hoa (xếp vòng/xếp thìa/xếp vặn/...)", f3.ln_trang_hoa);
    dataRow(ws, r++, "37. Màu sắc tràng hoa (trắng/vàng/đỏ/hồng/tím/...)", f3.ln_mau_sac_trang_hoa);
    dataRow(ws, r++, "38. Nhị hoa (rời/hợp)", f3.ln_nhi_hoa);
    dataRow(ws, r++, "39. Bao phấn (hình mũi tên/ống nhị/cột nhị/...)", f3.ln_bao_phan);
    dataRow(ws, r++, "40. Nhụy hoa (1 lá noãn/2 lá noãn/nhiều lá noãn/...)", f3.ln_nhuy_hoa);
    dataRow(ws, r++, "41. Mùi hoa (không mùi/nhẹ/trung bình/nặng/...)", f3.ln_mui_hoa);
    dataRow(ws, r++, "42. Hướng mọc của hoa (đứng/ngang/rủ xuống/...)", f3.ln_huong_moc_hoa);
    dataRow(ws, r++, "43. Kiểu quả (đơn/kép/...)", f3.ln_kieu_qua);
    dataRow(ws, r++, "44. Loại quả (hạch/nang/đậu/cánh/mọng/...)", f3.ln_loai_qua);
    dataRow(ws, r++, "45. Hình dạng quả (tròn/bầu dục/hình trụ/...)", f3.ln_hinh_dang_qua);
    dataRow(ws, r++, "46. Kích thước quả — Dài (cm)", f3.ln_kich_thuoc_qua);
    dataRow(ws, r++, "46. Kích thước quả — Rộng/đường kính (cm)", f3.ln_kich_thuoc_qua_rong);
    dataRow(ws, r++, "47. Màu sắc vỏ quả khi chín", f3.ln_mau_vo_qua);
    dataRow(ws, r++, "48. Số hạt trên quả (TB)", f3.ln_so_hat_qua);
    dataRow(ws, r++, "49. Dạng hạt (hình tròn/hình cầu/hình trứng/...)", f3.ln_dang_hat);
    dataRow(ws, r++, "50. Bề mặt hạt (trơn/sần sùi/có lông/...)", f3.ln_be_mat_hat);
    dataRow(ws, r++, "51. Màu hạt", f3.ln_mau_hat);
    dataRow(ws, r++, "52. Kích thước hạt — Dài (mm)", f3.ln_kich_thuoc_hat);
    dataRow(ws, r++, "52. Kích thước hạt — Rộng (mm)", f3.ln_kich_thuoc_hat_rong);
    dataRow(ws, r++, "53. Trọng lượng 1000 hạt (Kg)", f3.ln_trong_luong_1000_hat);
    dataRow(ws, r++, "54. Cấu tạo cây mầm", f3.ln_cau_tao_cay_mam);
  } else if (isLNTreNua) {
    dataRow(ws, r++, "10. Thân ngầm (mọc cum/mọc phân tán/mọc tản/...)", f3.tn_than_ngam);
    dataRow(ws, r++, "11. Thân khí sinh — Chiều cao (TB)", f3.tn_chieu_cao_than);
    dataRow(ws, r++, "11. Thân khí sinh — Đường kính (TB)", f3.tn_duong_kinh_than);
    dataRow(ws, r++, "12. Chiều dài lóng (TB) (cm)", f3.tn_chieu_dai_long);
    dataRow(ws, r++, "13. Chiều dài lá (TB) (cm)", f3.tn_chieu_dai_la);
    dataRow(ws, r++, "14. Chiều rộng lá (TB) (cm)", f3.tn_chieu_rong_la);
    dataRow(ws, r++, "15. Độ phủ lông của lá (trơn/trung bình/phủ lông/...)", f3.tn_do_phu_long_la);
    dataRow(ws, r++, "16. Màu phiến lá (xanh/xanh nhạt/xanh đậm/...)", f3.tn_mau_phien_la);
    dataRow(ws, r++, "17. Màu góc bẹ lá (xanh/có sọc tím/tím nhạt/tím/...)", f3.tn_mau_goc_be_la);
    dataRow(ws, r++, "18. Góc lá (đứng/ngang/rũ xuống/...)", f3.tn_goc_la);
    dataRow(ws, r++, "19. Màu cổ lá (xanh/xanh nhạt/tím/...)", f3.tn_mau_co_la);
    dataRow(ws, r++, "20. Màu tai lá (xanh nhạt/tím/...)", f3.tn_mau_tai_la);
    dataRow(ws, r++, "21. Hình dạng mo thân (hình tam giác/hình thang rộng/hình thang hẹp/...)", f3.tn_hinh_dang_mo_than);
    dataRow(ws, r++, "22. Màu sắc mo thân (xanh nhạt/xanh lục/vàng rơm/nâu nhạt/...)", f3.tn_mau_sac_mo_than);
    dataRow(ws, r++, "23. Màu lông mo (xám/nâu/nâu vàng/tím đen/...)", f3.tn_mau_long_mo);
    dataRow(ws, r++, "24. Tai mo (có/không)", f3.tn_tai_mo);
    dataRow(ws, r++, "25. Lá mo (hình tam giác/hình trứng/hình thuôn hẹp/...)", f3.tn_la_mo);
    dataRow(ws, r++, "26. Dạng bông/khuy (chụm/trung gian/mở/...)", f3.tn_dang_bong);
    dataRow(ws, r++, "27. Phân nhánh thứ cấp trên bông (không/nhẹ/nặng/dề cụm/...)", f3.tn_phan_nhanh);
    dataRow(ws, r++, "28. Màu hạt (trắng/đỉnh đỏ/nâu/đỉnh tím/...)", f3.tn_mau_hat);
    dataRow(ws, r++, "29. Trọng lượng 1000 hạt (kg)", f3.ln_trong_luong_1000_hat);
    dataRow(ws, r++, "30. Chiều dài hạt (mm)", f3.ln_kich_thuoc_hat);
    dataRow(ws, r++, "31. Chiều rộng hạt (mm)", f3.ln_kich_thuoc_hat_rong);
  } else if (isDL) {
    dataRow(ws, r++, "10. Dạng cây", f3.dang_cay);
    dataRow(ws, r++, "11. Đường kính thân", f3.duong_kinh_than);
    dataRow(ws, r++, "12. Chiều cao cây (cm; n=5)", f3.chieu_cao_cay);
    dataRow(ws, r++, "13. Màu sắc thân", f3.mau_sac_than);
    dataRow(ws, r++, "14. Đường kính tán (cm; n=5)", f3.duong_kinh_tan);
    dataRow(ws, r++, "15. Kiểu gân lá", f3.kieu_gan_la);
    dataRow(ws, r++, "16. Hình dạng lá", f3.hinh_dang_la);
    dataRow(ws, r++, "17. Màu lá", f3.mau_la);
    dataRow(ws, r++, "18. Kiểu lá", f3.kieu_la);
    dataRow(ws, r++, "19. Kiểu hoa", f3.kieu_hoa);
    dataRow(ws, r++, "20. Màu sắc cánh hoa", f3.mau_sac_canh_hoa);
    dataRow(ws, r++, "21. Hình dạng hoa", f3.hinh_dang_hoa);
    dataRow(ws, r++, "22. Bầu (thượng/trung/hạ)", f3.bau);
    dataRow(ws, r++, "23. Mùi hoa", f3.mui_hoa);
    dataRow(ws, r++, "24. Hình dạng quả", f3.hinh_dang_qua);
    dataRow(ws, r++, "25. Loại quả", f3.loai_qua);
    dataRow(ws, r++, "26. Số hạt trên quả (n=5)", f3.so_hat_tren_qua);
    dataRow(ws, r++, "27. Dạng hạt", f3.dang_hat);
    dataRow(ws, r++, "28. Bề mặt hạt", f3.be_mat_hat);
  } else if (isCNGiaCam || isCNThuyCam) {
    dataRow(ws, r++, "10. Hình thái lông (Bình thường/Quăn/Mượt/Dạng khác)", f3.cn_hinh_thai_long);
    dataRow(ws, r++, "11. Phân bố lông", f3.cn_phan_bo_long);
    dataRow(ws, r++, "12. Kiểu bộ lông", f3.cn_kieu_bo_long);
    dataRow(ws, r++, "13. Màu bộ lông (Trắng/đen/xanh/đỏ/vàng rơm/khác)", f3.cn_mau_bo_long);
    dataRow(ws, r++, "14. Màu da (Trắng/vàng/đen/khác)", f3.cn_mau_da);
    dataRow(ws, r++, "15. Màu dái tai (Trắng/đỏ/khác)", f3.cn_mau_dai_tai);
    dataRow(ws, r++, "16. Kiểu mào", f3.cn_kieu_mao);
    dataRow(ws, r++, "17. Độ lớn của mào", f3.cn_do_lon_mao);
    dataRow(ws, r++, "18. Màu mắt", f3.cn_mau_mat);
    dataRow(ws, r++, "19. Các dạng bộ xương", f3.cn_cac_dang_bo_xuong);
    dataRow(ws, r++, "20. Các chiều đo (8 Chiều đo)", f3.cn_cac_chieu_do);
  } else if (isCNGSGam) {
    dataRow(ws, r++, "10. Hình thái lông (Bình thường/Quăn/Mượt/...)", f3.cn_hinh_thai_long);
    dataRow(ws, r++, "11. Phân bố lông", f3.cn_phan_bo_long);
    dataRow(ws, r++, "12. Mào", f3.cn_mao);
    dataRow(ws, r++, "13. Kiểu bộ lông", f3.cn_kieu_bo_long);
    dataRow(ws, r++, "14. Màu bộ lông (Trắng/đen/xanh/đỏ/vàng rơm/khác)", f3.cn_mau_bo_long);
    dataRow(ws, r++, "15. Màu da (Trắng/vàng/đen/khác)", f3.cn_mau_da);
    dataRow(ws, r++, "16. Màu dái tai (Trắng/đỏ/khác)", f3.cn_mau_dai_tai);
    dataRow(ws, r++, "17. Kiểu mào", f3.cn_kieu_mao);
    dataRow(ws, r++, "18. Độ lớn của mào", f3.cn_do_lon_mao);
    dataRow(ws, r++, "19. Màu mắt", f3.cn_mau_mat);
    dataRow(ws, r++, "20. Các dạng bộ xương", f3.cn_cac_dang_bo_xuong);
    dataRow(ws, r++, "21. Các chiều đo (8 Chiều đo)", f3.cn_cac_chieu_do);
    dataRow(ws, r++, "22. Các đặc điểm khác", f3.cn_dac_diem_khac);
  } else if (isCNTieuGiaSuc) {
    dataRow(ws, r++, "10. Lông (Quăn/Thẳng/Ngắn – Dài/Rậm/Thưa)", f3.tgs_long);
    dataRow(ws, r++, "11. Mõm (Dài và mỏng – Ngắn và tròn – Kiểu khác)", f3.tgs_mom);
    dataRow(ws, r++, "12. Răng nanh (Có/Không)", f3.tgs_rang_nanh);
    dataRow(ws, r++, "13. Bộ lông (Một kiểu/chập và – Không khuôn mẫu)", f3.cn_kieu_bo_long);
    dataRow(ws, r++, "14. Màu lông (Trắng, đen/đỏ thẫm/đỏ sáng/nâu vàng/màu khác)", f3.cn_mau_bo_long);
    dataRow(ws, r++, "15. Đầu (Lõm/Thẳng/Gồ)", f3.tgs_dau);
    dataRow(ws, r++, "16. Kiểu tai (Cụp/rủ/thông/dựng lên)", f3.tgs_kieu_tai);
    dataRow(ws, r++, "17. Hướng tai (Hướng trước/ngang/sau)", f3.tgs_huong_tai);
    dataRow(ws, r++, "18. Da (Trơn/nhăn)", f3.tgs_da);
    dataRow(ws, r++, "19. Đuôi (Thẳng cong)", f3.tgs_duoi);
    dataRow(ws, r++, "20. Lưng (Thẳng/võng/kiểu khác)", f3.tgs_lung);
    dataRow(ws, r++, "21. Chân (Ngắn, dài, TB so với cơ thể)", f3.tgs_chan);
    dataRow(ws, r++, "22. Các chiều đo", f3.cn_cac_chieu_do);
    dataRow(ws, r++, "23. KLCT", f3.tgs_klct);
    dataRow(ws, r++, "24. Dài thân", f3.cn_chieu_dai_than);
    dataRow(ws, r++, "25. Dài đầu", f3.tgs_dai_dau);
    dataRow(ws, r++, "26. Dài tai", f3.tgs_dai_tai);
    dataRow(ws, r++, "27. Dài đuôi", f3.tgs_dai_duoi);
    dataRow(ws, r++, "28. Vòng ngực", f3.cn_vong_nguc);
    dataRow(ws, r++, "29. Cao vai", f3.cn_chieu_cao_vai);
    dataRow(ws, r++, "30. Số vú", f3.tgs_so_vu);
    dataRow(ws, r++, "31. Trọng lượng trưởng thành (kg)", f3.cn_trong_luong_truong_thanh);
    dataRow(ws, r++, "32. Đặc điểm khác", f3.cn_dac_diem_khac);
  } else if (isCN) {
    dataRow(ws, r++, "10. Hình thái lông", f3.cn_hinh_thai_long);
    dataRow(ws, r++, "11. Phân bố lông", f3.cn_phan_bo_long);
    dataRow(ws, r++, "12. Mào", f3.cn_mao);
    dataRow(ws, r++, "13. Kiểu bộ lông", f3.cn_kieu_bo_long);
    dataRow(ws, r++, "14. Màu bộ lông", f3.cn_mau_bo_long);
    dataRow(ws, r++, "15. Màu da", f3.cn_mau_da);
    dataRow(ws, r++, "16. Màu dái tai", f3.cn_mau_dai_tai);
    dataRow(ws, r++, "17. Kiểu mào", f3.cn_kieu_mao);
    dataRow(ws, r++, "18. Độ lớn của mào", f3.cn_do_lon_mao);
    dataRow(ws, r++, "19. Màu mắt", f3.cn_mau_mat);
    dataRow(ws, r++, "20. Các dạng bộ xương", f3.cn_cac_dang_bo_xuong);
    dataRow(ws, r++, "21. Các chiều đo (8 chiều đo)", f3.cn_cac_chieu_do);
    dataRow(ws, r++, "22. Các đặc điểm khác", f3.cn_dac_diem_khac);
  } else if (isTS) {
    dataRow(ws, r++, "10a. Chiều dài toàn thân (cm)", f3.ts_chieu_dai_toan_than);
    dataRow(ws, r++, "10b. Chiều cao đầu (cm)", f3.ts_chieu_cao_dau);
    dataRow(ws, r++, "11a. Chiều dài kinh tế (cm)", f3.ts_chieu_dai_kinh_te);
    dataRow(ws, r++, "11b. Chiều rộng đầu (cm)", f3.ts_chieu_rong_dau);
    dataRow(ws, r++, "12a. Dài trước vây lưng (cm)", f3.ts_dai_truoc_vay_lung);
    dataRow(ws, r++, "12b. Chiều cao thân (cm)", f3.ts_chieu_cao_than);
    dataRow(ws, r++, "13a. Dài trước vây ngực (cm)", f3.ts_dai_truoc_vay_nguc);
    dataRow(ws, r++, "13b. Chiều dày thân (cm)", f3.ts_chieu_day_than);
    dataRow(ws, r++, "14a. Dài trước vây bụng (cm)", f3.ts_dai_truoc_vay_bung);
    dataRow(ws, r++, "14b. Số tia vây lưng", f3.ts_so_tia_vay_lung);
    dataRow(ws, r++, "15a. Dài trước vây hậu môn (cm)", f3.ts_dai_truoc_vay_hau_mon);
    dataRow(ws, r++, "15b. Số tia vây ngực", f3.ts_so_tia_vay_nguc);
    dataRow(ws, r++, "16a. Chiều dài đầu (cm)", f3.ts_chieu_dai_dau);
    dataRow(ws, r++, "16b. Số tia vây bụng", f3.ts_so_tia_vay_bung);
    dataRow(ws, r++, "17a. Chiều dài mõm (cm)", f3.ts_chieu_dai_mom);
    dataRow(ws, r++, "17b. Số tia vây hậu môn", f3.ts_so_tia_vay_hau_mon);
    dataRow(ws, r++, "18a. Đường kính mắt (cm)", f3.ts_duong_kinh_mat);
    dataRow(ws, r++, "18b. Số tia vây đuôi", f3.ts_so_tia_vay_duoi);
    dataRow(ws, r++, "19a. Khoảng cách hai mắt (cm)", f3.ts_khoang_cach_hai_mat);
    dataRow(ws, r++, "19b. Số vảy đường bên", f3.ts_so_vay_duong_ben);
    dataRow(ws, r++, "20. Trọng lượng (g; n=10)", f3.ts_trong_luong_truong_thanh);
    dataRow(ws, r++, "21. Cơ quan sinh sản", f3.ts_co_quan_sinh_san);
  } else if (isVS) {
    dataRow(ws, r++, "10. Kích thước thân (cm)", f3.vs_kich_thuoc_than);
    dataRow(ws, r++, "10. Kích thước rễ (cm)", f3.vs_kich_thuoc_re);
    dataRow(ws, r++, "10. Kích thước mũ/đảm (cm)", f3.vs_kich_thuoc_mu_dam);
    dataRow(ws, r++, "11. Màu sắc (rễ/thân/mũ đảm/tán nấm)", f3.vs_mau_sac);
    dataRow(ws, r++, "12. Sợi nấm — Hình dạng", f3.vs_soi_nam_hinh_dang);
    dataRow(ws, r++, "12. Sợi nấm — Kích thước (µm)", f3.vs_soi_nam_kich_thuoc);
    dataRow(ws, r++, "12. Sợi nấm — Đa bào/Đơn bào", f3.vs_soi_nam_co_vach);
    dataRow(ws, r++, "13. Bào tử vô tính (hình dạng/kích thước/màu sắc/đa-đơn bào)", f3.vs_bao_tu_vo_tinh);
    dataRow(ws, r++, "13. Bào tử hữu tính (hình dạng/kích thước/màu sắc/đa-đơn bào)", f3.vs_bao_tu_huu_tinh);
    dataRow(ws, r++, "13. Đặc điểm khác", f3.vs_dac_diem_khac);
  }

  sectionStyle(ws, r++, "II.B DỮ LIỆU MÔ TẢ ĐẶC ĐIỂM SINH HỌC, SINH THÁI");
  if (isTT) {
    dataRow(ws, r++, "49. Ánh sáng", f3.anh_sang);
    dataRow(ws, r++, "50. Đất, thổ nhưỡng", f3.dat_tho_nhuong);
    dataRow(ws, r++, "51. Nhiệt độ", f3.nhiet_do);
    dataRow(ws, r++, "52. Độ ẩm", f3.do_am);
  } else if (isLN && !isLNCayDacSan && !isLNTreNua) {
    dataRow(ws, r++, "55. Ánh sáng", f3.anh_sang);
    dataRow(ws, r++, "56. Đất, thổ nhưỡng", f3.dat_tho_nhuong);
    dataRow(ws, r++, "57. Nhiệt độ", f3.nhiet_do);
    dataRow(ws, r++, "58. Độ ẩm", f3.do_am);
  } else if (isLNCayDacSan) {
    dataRow(ws, r++, "", f3.nhiet_do);
  } else if (isLNTreNua) {
    dataRow(ws, r++, "32. Ánh sáng", f3.anh_sang);
    dataRow(ws, r++, "33. Đất, thổ nhưỡng", f3.dat_tho_nhuong);
    dataRow(ws, r++, "34. Nhiệt độ", f3.nhiet_do);
    dataRow(ws, r++, "35. Độ ẩm", f3.do_am);
  } else if (isDL) {
    dataRow(ws, r++, "29. Ánh sáng", f3.anh_sang);
    dataRow(ws, r++, "30. Đất, thổ nhưỡng", f3.dat_tho_nhuong);
    dataRow(ws, r++, "31. Nhiệt độ", f3.nhiet_do);
    dataRow(ws, r++, "32. Độ ẩm", f3.do_am);
  } else if (isCNGiaCam) {
    dataRow(ws, r++, "21.", f3.nhiet_do);
    dataRow(ws, r++, "22.", f3.do_am);
    dataRow(ws, r++, "23.", f3.anh_sang);
    dataRow(ws, r++, "24.", f3.dat_tho_nhuong);
    dataRow(ws, r++, "25.", f3.cn_dac_diem_khac);
  } else if (isCNGSGam) {
    dataRow(ws, r++, "23.", f3.nhiet_do);
    dataRow(ws, r++, "24.", f3.do_am);
    dataRow(ws, r++, "25.", f3.anh_sang);
    dataRow(ws, r++, "26.", f3.dat_tho_nhuong);
  } else if (isCNThuyCam) {
    dataRow(ws, r++, "21.", f3.nhiet_do);
    dataRow(ws, r++, "22.", f3.do_am);
    dataRow(ws, r++, "23.", f3.anh_sang);
    dataRow(ws, r++, "24.", f3.dat_tho_nhuong);
    dataRow(ws, r++, "25.", f3.cn_dac_diem_khac);
  } else if (isCNTieuGiaSuc) {
    dataRow(ws, r++, "33.", f3.nhiet_do);
    dataRow(ws, r++, "34.", f3.do_am);
    dataRow(ws, r++, "35.", f3.anh_sang);
    dataRow(ws, r++, "36.", f3.dat_tho_nhuong);
  } else if (isCN) {
    dataRow(ws, r++, "23. Nhiệt độ thích hợp (°C)", f3.nhiet_do);
    dataRow(ws, r++, "24. Độ ẩm chuồng trại (%)", f3.do_am);
    dataRow(ws, r++, "25. Điều kiện ánh sáng/chuồng trại", f3.anh_sang);
    dataRow(ws, r++, "26. Yêu cầu đất/nền chuồng và chế độ dinh dưỡng", f3.dat_tho_nhuong);
  } else if (isTS) {
    dataRow(ws, r++, "22. Môi trường sống", f3.ts_moi_truong_song);
    dataRow(ws, r++, "23. Đặc điểm về dinh dưỡng", f3.ts_dac_diem_dinh_duong);
    dataRow(ws, r++, "24. Đặc điểm về sinh sản", f3.ts_dac_diem_sinh_san);
  } else if (isVS) {
    dataRow(ws, r++, "15. Địa hình", f3.dat_tho_nhuong);
    dataRow(ws, r++, "16. Thổ nhưỡng/giá thể sinh dưỡng", f3.vs_tho_nhuong);
    dataRow(ws, r++, "17. Nhiệt độ (°C)", f3.nhiet_do);
    dataRow(ws, r++, "18. Ẩm độ (%)", f3.do_am);
    dataRow(ws, r++, "19. Ánh sáng", f3.anh_sang);
    dataRow(ws, r++, "20. Dinh dưỡng", f3.vs_dinh_duong);
    dataRow(ws, r++, "21. Biện pháp canh tác/nhân nuôi", f3.vs_bien_phap_canh_tac);
  }

  sectionStyle(ws, r++, "II.C DỮ LIỆU MÔ TẢ ĐẶC ĐIỂM SINH TRƯỞNG, PHÁT TRIỂN");
  if (isTT) {
    dataRow(ws, r++, "54. Hình thức sinh trưởng", f3.hinh_thuc_sinh_truong);
    dataRow(ws, r++, "55. Tỷ lệ nảy mầm", f3.ti_le_nay_mam);
    dataRow(ws, r++, "56. Điều kiện nảy mầm", f3.dieu_kien_nay_mam);
    dataRow(ws, r++, "57. Thời vụ gieo trồng", f3.thoi_vu_gieo_trong);
    dataRow(ws, r++, "58. Thời gian từ khi gieo đến khi mọc", f3.thoi_gian_khi_gieo_moc);
    dataRow(ws, r++, "59. Thời gian từ trồng đến trổ bông", f3.tt_thoi_gian_tro_bong);
    dataRow(ws, r++, "60. Thời gian từ trồng đến chín (thu hoạch)", f3.tt_thoi_gian_sinh_truong_ngay);
  } else if (isLN && !isLNCayDacSan && !isLNTreNua) {
    dataRow(ws, r++, "59. Hình thức sinh trưởng (liên tục/nhịp điệu/...)", f3.hinh_thuc_sinh_truong);
    dataRow(ws, r++, "60. Tỷ lệ nảy mầm (<50%/50–80%/>80%)", f3.ti_le_nay_mam);
    dataRow(ws, r++, "61. Điều kiện nảy mầm (gieo trực tiếp/ủ/...)", f3.dieu_kien_nay_mam);
    dataRow(ws, r++, "62. Thời vụ gieo trồng (xuân/thu/xuân hè/thu đông/quanh năm/...)", f3.thoi_vu_gieo_trong);
    dataRow(ws, r++, "63. Thời gian từ khi gieo đến khi mọc (ngày)", f3.thoi_gian_khi_gieo_moc);
    dataRow(ws, r++, "64. Thời gian từ trồng đến ra hoa, kết quả (năm)", f3.ln_thoi_gian_ra_hoa);
    dataRow(ws, r++, "65. Thời gian từ trồng đến thu hoạch (năm)", f3.ln_thoi_gian_thu_hoach);
  } else if (isLNCayDacSan) {
    dataRow(ws, r++, "", f3.hinh_thuc_sinh_truong);
  } else if (isLNTreNua) {
    dataRow(ws, r++, "36. Tỷ lệ nảy mầm (<50%/50–80%/>80%)", f3.ti_le_nay_mam);
    dataRow(ws, r++, "37. Điều kiện nảy mầm (gieo trực tiếp/xử lý/ủ ấm/...)", f3.dieu_kien_nay_mam);
    dataRow(ws, r++, "38. Thời vụ gieo trồng (xuân/thu/...)", f3.thoi_vu_gieo_trong);
    dataRow(ws, r++, "39. Thời gian từ khi gieo đến khi mọc (ngày)", f3.thoi_gian_khi_gieo_moc);
    dataRow(ws, r++, "40. Thời gian từ trồng đến ra hoa, kết quả (năm)", f3.ln_thoi_gian_ra_hoa);
    dataRow(ws, r++, "41. Thời gian từ trồng đến thu hoạch (năm)", f3.ln_thoi_gian_thu_hoach);
  } else if (isDL) {
    dataRow(ws, r++, "33. Hình thức sinh trưởng", f3.hinh_thuc_sinh_truong);
    dataRow(ws, r++, "34. Tỷ lệ nảy mầm", f3.ti_le_nay_mam);
    dataRow(ws, r++, "35. Điều kiện nảy mầm", f3.dieu_kien_nay_mam);
    dataRow(ws, r++, "36. Thời vụ gieo trồng", f3.thoi_vu_gieo_trong);
    dataRow(ws, r++, "37. Thời gian từ khi gieo đến khi mọc (ngày)", f3.thoi_gian_khi_gieo_moc);
    dataRow(ws, r++, "38. Thời gian từ trồng đến ra hoa, kết quả (năm)", f3.thoi_gian_gieo_hoa);
    dataRow(ws, r++, "39. Thời gian từ trồng đến thu hoạch (năm)", f3.thoi_gian_gieo_qua);
  } else if (isCNGiaCam) {
    dataRow(ws, r++, "26.", f3.hinh_thuc_sinh_truong);
    dataRow(ws, r++, "27.", f3.cn_tuoi_thanh_thuc);
    dataRow(ws, r++, "28.", f3.cn_thoi_gian_mang_thai);
    dataRow(ws, r++, "29.", f3.cn_so_lua_nam);
    dataRow(ws, r++, "30.", f3.cn_san_xuat_trung);
  } else if (isCNGSGam) {
    dataRow(ws, r++, "27.", f3.hinh_thuc_sinh_truong);
    dataRow(ws, r++, "28.", f3.cn_tuoi_thanh_thuc);
    dataRow(ws, r++, "29.", f3.cn_thoi_gian_mang_thai);
    dataRow(ws, r++, "30.", f3.cn_so_lua_nam);
    dataRow(ws, r++, "31.", f3.cn_so_con_lua);
    dataRow(ws, r++, "32.", f3.cn_san_xuat_trung);
  } else if (isCNThuyCam) {
    dataRow(ws, r++, "26.", f3.hinh_thuc_sinh_truong);
    dataRow(ws, r++, "27.", f3.cn_tuoi_thanh_thuc);
    dataRow(ws, r++, "28.", f3.cn_thoi_gian_mang_thai);
    dataRow(ws, r++, "29.", f3.cn_so_lua_nam);
    dataRow(ws, r++, "30.", f3.cn_so_con_lua);
  } else if (isCNTieuGiaSuc) {
    dataRow(ws, r++, "37.", f3.hinh_thuc_sinh_truong);
    dataRow(ws, r++, "38.", f3.cn_tuoi_thanh_thuc);
    dataRow(ws, r++, "39.", f3.cn_thoi_gian_mang_thai);
    dataRow(ws, r++, "40.", f3.cn_so_lua_nam);
    dataRow(ws, r++, "41.", f3.cn_so_con_lua);
    dataRow(ws, r++, "42.", f3.cn_san_xuat_trung);
  } else if (isCN) {
    dataRow(ws, r++, "27. Hình thức sinh trưởng (liên tục/theo mùa/...)", f3.hinh_thuc_sinh_truong);
    dataRow(ws, r++, "28. Tuổi thành thục sinh dục (tháng)", f3.cn_tuoi_thanh_thuc);
    dataRow(ws, r++, "29. Thời gian mang thai/ấp trứng (ngày)", f3.cn_thoi_gian_mang_thai);
    dataRow(ws, r++, "30. Số lứa/năm", f3.cn_so_lua_nam);
    dataRow(ws, r++, "31. Số con/lứa (trung bình)", f3.cn_so_con_lua);
    dataRow(ws, r++, "32. Sản lượng trứng/sữa (quả hoặc L/chu kỳ)", f3.cn_san_xuat_trung);
  } else if (isTS) {
    dataRow(ws, r++, "26. Thời gian sinh trưởng", f3.ts_thoi_gian_sinh_truong_ts);
    dataRow(ws, r++, "27. Các giai đoạn sinh trưởng", f3.ts_cac_giai_doan_sinh_truong);
    dataRow(ws, r++, "28. Thời gian thành thục sinh dục", f3.ts_thoi_gian_thanh_thuc_sinh_duc);
  } else if (isVS) {
    dataRow(ws, r++, "22. Thời gian sinh trưởng (từ lúc nuôi/trồng đến thu hoạch)", f3.vs_thoi_gian_khuan_lac);
    dataRow(ws, r++, "23. Sinh trưởng — giai đoạn phát triển sợi nấm", f3.vs_toc_do_sinh_truong);
    dataRow(ws, r++, "24. Phát triển — giai đoạn hình thành bào tử", f3.hinh_thuc_sinh_truong);
  }

  sectionStyle(ws, r++, "III. GHI CHÚ");
  dataRow(ws, r++, "Ghi chú (kháng sâu/bệnh, chịu sinh thái bất thuận)", f3.ghi_chu);

  sectionStyle(ws, r++, "IV. TÀI LIỆU THAM KHẢO");
  dataRow(ws, r++, "Danh mục tài liệu tham khảo", f3.tai_lieu_tham_khao);
}

function buildForm4Sheet(ws: WS, item: NguonGen, ext: ExtendedFormData) {
  setupColumns(ws);
  const f4 = { ...defaultForm4(), ...ext.form4 };

  titleRow(ws, 1, "PHIẾU MÔ TẢ, ĐÁNH GIÁ CHI TIẾT NGUỒN GEN", "PHIẾU SỐ 03/ĐTCT");

  headerStyle(ws, 3, 1, "Chỉ tiêu");
  headerStyle(ws, 3, 2, "Giá trị");
  ws.mergeCells(3, 2, 3, 3);
  ws.getRow(3).height = 22;

  let r = 4;
  sectionStyle(ws, r++, "I. THÔNG TIN CHUNG");
  dataRow(ws, r++, "1. Mã số của hệ thống", f4.ma_so_he_thong);
  dataRow(ws, r++, "2. Mã số nhiệm vụ", f4.ma_so_nhiem_vu);
  dataRow(ws, r++, "3. Mã nguồn gen", item.ma);
  dataRow(ws, r++, "4. Tên giống", f4.ten_giong);
  dataRow(ws, r++, "5. Nguồn giống (nguồn giống đem nhân)", f4.nguon_giong);
  dataRow(ws, r++, "6. Nơi nhân giống, nuôi/trồng, cấp giống", f4.noi_nhan_giong);
  dataRow(ws, r++, "7. Người mô tả, đánh giá", f4.nguoi_mo_ta);
  dataRow(ws, r++, "8. Cơ quan mô tả, đánh giá", f4.co_quan_mo_ta);

  sectionStyle(ws, r++, "II.A THÔNG TIN DNA");
  dataRow(ws, r++, "9. Trình tự DNA nguồn gen", f4.trinh_tu_dna);
  dataRow(ws, r++, "10. Chiều dài DNA", f4.chieu_dai_dna);
  dataRow(ws, r++, "11. Tỷ lệ A, T, G, C", f4.ti_le_atgc);
  dataRow(ws, r++, "12. Chuỗi acid amin do DNA mã hóa", f4.chuoi_acid_amin);

  sectionStyle(ws, r++, "II.B ĐẶC ĐIỂM NÔNG SINH HỌC");
  dataRow(ws, r++, "14. Thông tin về năng suất", f4.thong_tin_nang_suat);
  dataRow(ws, r++, "15. Thông tin về chất lượng", f4.thong_tin_chat_luong);
  dataRow(ws, r++, "16. Đặc tính kháng sâu/bệnh", f4.khang_sau_benh);
  dataRow(ws, r++, "17. Đặc tính chịu sinh thái bất thuận", f4.chiu_sinh_thai_bat_thuon);
  dataRow(ws, r++, "18. Các đặc tính kinh tế nổi bật", f4.dac_tinh_kinh_te_noi_bat);
  dataRow(ws, r++, "19. Tập quán xã hội liên quan", f4.tap_quan_xa_hoi);

  sectionStyle(ws, r++, "II.C ĐÁNH GIÁ GIÁ TRỊ NGUỒN GEN");
  dataRow(ws, r++, "20. Giá trị kinh tế", f4.gia_tri_kinh_te);
  dataRow(ws, r++, "21. Giá trị bảo tồn", f4.gia_tri_bao_ton);
  dataRow(ws, r++, "22. Giá trị đặc hữu", f4.gia_tri_dac_huu);
  dataRow(ws, r++, "23. Giá trị về môi trường", f4.gia_tri_moi_truong);
  dataRow(ws, r++, "24. Giá trị dinh dưỡng, y, dược", f4.gia_tri_dinh_duong);
  dataRow(ws, r++, "25. Tiềm năng phát triển của nguồn gen", f4.tiem_nang_phat_trien);
  dataRow(ws, r++, "26. Các thông tin khác", f4.cac_thong_tin_khac);

  sectionStyle(ws, r++, "III. GHI CHÚ");
  dataRow(ws, r++, "Ghi chú", f4.ghi_chu);

  sectionStyle(ws, r++, "IV. TÀI LIỆU THAM KHẢO");
  dataRow(ws, r++, "Danh mục tài liệu tham khảo", f4.tai_lieu_tham_khao);
}

export async function exportDanhSachExcel(items: NguonGen[], categoryLabel: string, fileName: string) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "HeThongCoSoDuLieuGen";
  const ws = wb.addWorksheet("Danh sách");

  ws.columns = [
    { width: 8 },
    { width: 36 },
    { width: 36 },
    { width: 26 },
  ];

  const COLS = 4;
  const greenMedium = { style: "medium" as const, color: { argb: "FF2E7D32" } };
  const thinGray = { style: "thin" as const, color: { argb: "FFCCCCCC" } };

  // Row 1: main title
  ws.mergeCells(1, 1, 1, COLS);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = "DANH SÁCH NGUỒN GEN";
  titleCell.font = { bold: true, size: 13 };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 28;

  // Row 2: category sub-title (if filtered)
  let headerRow = 2;
  if (categoryLabel && categoryLabel !== "Tất cả nguồn gen") {
    ws.mergeCells(2, 1, 2, COLS);
    const sub = ws.getCell(2, 1);
    sub.value = categoryLabel;
    sub.font = { bold: true, size: 11, color: { argb: "FF1B5E20" } };
    sub.alignment = { horizontal: "center", vertical: "middle" };
    ws.getRow(2).height = 20;
    headerRow = 3;
  }

  // Header row
  const HEADERS = ["STT", "Tên nguồn", "Đơn vị sản xuất cung cấp", "Nhóm nguồn gen"];
  const hRow = ws.getRow(headerRow);
  hRow.height = 22;
  HEADERS.forEach((h, i) => {
    const cell = hRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, size: 10 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB0B0B0" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = { top: thinGray, left: thinGray, bottom: thinGray, right: thinGray };
  });

  // Data rows
  items.forEach((item, idx) => {
    const rIdx = headerRow + 1 + idx;
    const row = ws.getRow(rIdx);
    row.height = 18;
    const isEven = idx % 2 === 1;
    const bg = isEven ? "FFF5F5F5" : "FFFFFFFF";
    [idx + 1, item.ten, item.don_vi || "", item.phan_nhom || ""].forEach((v, i) => {
      const cell = row.getCell(i + 1);
      cell.value = v;
      cell.font = { size: 10 };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      cell.alignment = { vertical: "middle", horizontal: i === 0 ? "center" : "left", wrapText: i === 1 };
      cell.border = { top: thinGray, left: thinGray, bottom: thinGray, right: thinGray };
    });
  });

  // Green medium outer border around entire table
  const lastDataRow = headerRow + items.length;
  for (let r = 1; r <= lastDataRow; r++) {
    const L = ws.getRow(r).getCell(1);
    const R = ws.getRow(r).getCell(COLS);
    L.border = { ...L.border, left: greenMedium };
    R.border = { ...R.border, right: greenMedium };
  }
  for (let c = 1; c <= COLS; c++) {
    const T = ws.getRow(1).getCell(c);
    const B = ws.getRow(lastDataRow).getCell(c);
    T.border = { ...T.border, top: greenMedium };
    B.border = { ...B.border, bottom: greenMedium };
  }

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportThongKeExcel(rows: { ten: string; dia_chi: string; count: number }[]) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "HeThongCoSoDuLieuGen";
  const ws = wb.addWorksheet("Thống kê");

  const COLS = 4;
  const greenMedium = { style: "medium" as const, color: { argb: "FF2E7D32" } };
  const thinGray = { style: "thin" as const, color: { argb: "FFCCCCCC" } };

  ws.columns = [{ width: 8 }, { width: 40 }, { width: 30 }, { width: 22 }];

  ws.mergeCells(1, 1, 1, COLS);
  const t = ws.getCell(1, 1);
  t.value = "THỐNG KÊ NGUỒN GEN THEO ĐƠN VỊ QUẢN LÝ";
  t.font = { bold: true, size: 13 };
  t.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 28;

  const HEADERS = ["STT", "Tên đơn vị cung cấp", "Địa chỉ đơn vị cung cấp", "Số lượng nguồn gen"];
  const hRow = ws.getRow(2);
  hRow.height = 22;
  HEADERS.forEach((h, i) => {
    const cell = hRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, size: 10 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB0B0B0" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = { top: thinGray, left: thinGray, bottom: thinGray, right: thinGray };
  });

  rows.forEach((row, idx) => {
    const rIdx = 3 + idx;
    const r = ws.getRow(rIdx);
    r.height = 18;
    const bg = idx % 2 === 1 ? "FFF5F5F5" : "FFFFFFFF";
    [idx + 1, row.ten || "Chưa có thông tin", row.dia_chi, row.count].forEach((v, i) => {
      const cell = r.getCell(i + 1);
      cell.value = v;
      cell.font = { size: 10 };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
      cell.alignment = { vertical: "middle", horizontal: i === 0 || i === 3 ? "center" : "left" };
      cell.border = { top: thinGray, left: thinGray, bottom: thinGray, right: thinGray };
    });
  });

  const lastRow = 2 + rows.length;
  for (let r = 1; r <= lastRow; r++) {
    const L = ws.getRow(r).getCell(1);
    const R = ws.getRow(r).getCell(COLS);
    L.border = { ...L.border, left: greenMedium };
    R.border = { ...R.border, right: greenMedium };
  }
  for (let c = 1; c <= COLS; c++) {
    ws.getRow(1).getCell(c).border = { ...ws.getRow(1).getCell(c).border, top: greenMedium };
    ws.getRow(lastRow).getCell(c).border = { ...ws.getRow(lastRow).getCell(c).border, bottom: greenMedium };
  }

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ThongKe_DonViQuanLy.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportThongKeNhomExcel(
  rows: { nhomLabel: string; nhomIcon: string; count: number; phanNhoms: { label: string; count: number }[] }[]
) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "HeThongCoSoDuLieuGen";
  const ws = wb.addWorksheet("Thống kê");

  const COLS = 3;
  const greenMedium = { style: "medium" as const, color: { argb: "FF2E7D32" } };
  const thinGray = { style: "thin" as const, color: { argb: "FFCCCCCC" } };

  ws.columns = [{ width: 8 }, { width: 48 }, { width: 22 }];

  ws.mergeCells(1, 1, 1, COLS);
  const t = ws.getCell(1, 1);
  t.value = "THỐNG KÊ NGUỒN GEN THEO NHÓM NGUỒN GEN";
  t.font = { bold: true, size: 13 };
  t.alignment = { horizontal: "center", vertical: "middle" };
  ws.getRow(1).height = 28;

  const HEADERS = ["STT", "Tên nhóm nguồn gen", "Số lượng nguồn gen"];
  const hRow = ws.getRow(2);
  hRow.height = 22;
  HEADERS.forEach((h, i) => {
    const cell = hRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, size: 10 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB0B0B0" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = { top: thinGray, left: thinGray, bottom: thinGray, right: thinGray };
  });

  let rIdx = 3;
  let nhomIdx = 0;
  for (const nhomRow of rows) {
    nhomIdx++;
    const r = ws.getRow(rIdx++);
    r.height = 20;
    const parentBg = "FFE3EFF7";
    [nhomIdx, nhomRow.nhomLabel, nhomRow.count].forEach((v, i) => {
      const cell = r.getCell(i + 1);
      cell.value = v;
      cell.font = { bold: true, size: 10 };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: parentBg } };
      cell.alignment = { vertical: "middle", horizontal: i === 0 || i === 2 ? "center" : "left" };
      cell.border = { top: thinGray, left: thinGray, bottom: thinGray, right: thinGray };
    });

    nhomRow.phanNhoms.forEach((pn, pnIdx) => {
      const pr = ws.getRow(rIdx++);
      pr.height = 18;
      const bg = pnIdx % 2 === 0 ? "FFFFFFFF" : "FFF5F5F5";
      [pnIdx + 1, `    ${pn.label}`, pn.count].forEach((v, i) => {
        const cell = pr.getCell(i + 1);
        cell.value = v;
        cell.font = { size: 10 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
        cell.alignment = { vertical: "middle", horizontal: i === 0 || i === 2 ? "center" : "left" };
        cell.border = { top: thinGray, left: thinGray, bottom: thinGray, right: thinGray };
      });
    });
  }

  const lastRow = rIdx - 1;
  for (let r = 1; r <= lastRow; r++) {
    ws.getRow(r).getCell(1).border = { ...ws.getRow(r).getCell(1).border, left: greenMedium };
    ws.getRow(r).getCell(COLS).border = { ...ws.getRow(r).getCell(COLS).border, right: greenMedium };
  }
  for (let c = 1; c <= COLS; c++) {
    ws.getRow(1).getCell(c).border = { ...ws.getRow(1).getCell(c).border, top: greenMedium };
    ws.getRow(lastRow).getCell(c).border = { ...ws.getRow(lastRow).getCell(c).border, bottom: greenMedium };
  }

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ThongKe_NhomNguonGen.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportNguonGenExcel(item: NguonGen, ext: ExtendedFormData) {
  const wb: WB = new ExcelJS.Workbook();
  wb.creator = "HeThongCoSoDuLieuGen";
  wb.created = new Date();

  buildForm2Sheet(wb.addWorksheet("01.ĐTNG"), item, ext);
  buildForm3Sheet(wb.addWorksheet("02.ĐGBĐ"), item, ext);
  buildForm4Sheet(wb.addWorksheet("03.ĐTCT"), item, ext);

  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `NguonGen_${item.ma}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

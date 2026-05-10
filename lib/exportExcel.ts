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

  titleRow(ws, 1, "PHIẾU ĐIỀU TRA THU THẬP NGUỒN GEN", "PHIẾU SỐ 01/ĐTNG");

  // Column headers
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
  dataRow(ws, r++, "5. Tên/địa chỉ nguồn gốc", f2.ten_nguon_goc);
  dataRow(ws, r++, "6. Tên người thu thập", f2.ten_nguoi_thu_thap);
  dataRow(ws, r++, "7. Cơ quan điều tra", f2.co_quan_dieu_tra);

  sectionStyle(ws, r++, "II. THÔNG TIN MẪU THU THẬP");
  dataRow(ws, r++, "Nguồn gốc mẫu", f2.nguon_goc_mau);
  dataRow(ws, r++, "Dạng mẫu", f2.dang_mau);
  dataRow(ws, r++, "Dạng mẫu khác", f2.dang_mau_khac);
  dataRow(ws, r++, "Bản chất truyền", f2.ban_chat_truyen);
  dataRow(ws, r++, "Mức độ thuần", f2.muc_do_thuan);
  dataRow(ws, r++, "Thời gian tồn tại", f2.thoi_gian_ton_tai);
  dataRow(ws, r++, "Mức độ phổ biến", f2.muc_do_pho_bien);
  dataRow(ws, r++, "Xu hướng phát triển", f2.xu_huong_phat_trien);

  sectionStyle(ws, r++, "III. ĐIỀU KIỆN SINH TRƯỞNG");
  dataRow(ws, r++, "Địa hình", f2.dia_hinh);
  dataRow(ws, r++, "Loại đất", f2.loai_dat);
  dataRow(ws, r++, "Loại đất khác", f2.loai_dat_khac);
  dataRow(ws, r++, "Màu đất", f2.mau_dat);
  dataRow(ws, r++, "Độ chua", f2.do_chua);
  dataRow(ws, r++, "Vật liệu nhân giống", f2.vat_lieu_nhan_giong);
  dataRow(ws, r++, "Vật liệu nhân giống khác", f2.vat_lieu_nhan_giong_khac);
  dataRow(ws, r++, "Nguồn giống ruộng", f2.nguon_giong_ruong);
  dataRow(ws, r++, "Phương thức canh tác", f2.phuong_thuc_canh_tac);
  dataRow(ws, r++, "Phương pháp gieo trồng", f2.phuong_phap_gieo_trong);
  dataRow(ws, r++, "Thời vụ trồng", f2.thoi_vu_trong);
  dataRow(ws, r++, "Thời gian sinh trưởng", f2.thoi_gian_sinh_truong);
  dataRow(ws, r++, "Phân bón", f2.phan_bon);
  dataRow(ws, r++, "Phòng trừ sâu bệnh", f2.phong_tru_sau_benh);

  sectionStyle(ws, r++, "IV. SỬ DỤNG, BẢO QUẢN, CHẾ BIẾN");
  dataRow(ws, r++, "Phần cây sử dụng", f2.phan_cay_su_dung);
  dataRow(ws, r++, "Mục đích sử dụng", f2.muc_dich_su_dung);
  dataRow(ws, r++, "Thu hoạch", f2.thu_hoach);
  dataRow(ws, r++, "Phương pháp bảo quản sản phẩm", f2.phuong_phap_bao_quan_sp);
  dataRow(ws, r++, "Cách chế biến", f2.cach_che_bien);
  dataRow(ws, r++, "Phương pháp để giống", f2.phuong_phap_de_giong);
  dataRow(ws, r++, "Kinh nghiệm chọn giống", f2.kinh_nghiem_chon_giong);

  sectionStyle(ws, r++, "V. ĐẶC TÍNH NỔI BẬT");
  dataRow(ws, r++, "Đặc tính nổi bật", f2.dac_tinh_noi_bat);
}

function buildForm3Sheet(ws: WS, item: NguonGen, ext: ExtendedFormData) {
  setupColumns(ws);
  const f3 = { ...defaultForm3(), ...ext.form3 };

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
  dataRow(ws, r++, "5. Nguồn giống", f3.nguon_giong);
  dataRow(ws, r++, "6. Nơi nhân giống/nuôi/trồng/cấp giống", f3.noi_nhan_giong);
  dataRow(ws, r++, "7. Người mô tả, đánh giá", f3.nguoi_mo_ta);
  dataRow(ws, r++, "8. Cơ quan mô tả, đánh giá", f3.co_quan_mo_ta);

  sectionStyle(ws, r++, "II.A ĐẶC ĐIỂM HÌNH THÁI");
  dataRow(ws, r++, "9. Đặc điểm chung", f3.dac_diem_chung);
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
  dataRow(ws, r++, "26. Số hạt trên quả", f3.so_hat_tren_qua);
  dataRow(ws, r++, "27. Dạng hạt", f3.dang_hat);
  dataRow(ws, r++, "28. Bề mặt hạt", f3.be_mat_hat);

  sectionStyle(ws, r++, "II.B ĐẶC ĐIỂM SINH HỌC, SINH THÁI");
  dataRow(ws, r++, "29. Ánh sáng", f3.anh_sang);
  dataRow(ws, r++, "30. Đất, thổ nhưỡng", f3.dat_tho_nhuong);
  dataRow(ws, r++, "31. Nhiệt độ", f3.nhiet_do);
  dataRow(ws, r++, "32. Độ ẩm", f3.do_am);

  sectionStyle(ws, r++, "II.C SINH TRƯỞNG, PHÁT TRIỂN");
  dataRow(ws, r++, "33. Hình thức sinh trưởng", f3.hinh_thuc_sinh_truong);
  dataRow(ws, r++, "34. Tỷ lệ nảy mầm", f3.ti_le_nay_mam);
  dataRow(ws, r++, "35. Điều kiện nảy mầm", f3.dieu_kien_nay_mam);
  dataRow(ws, r++, "36. Thời vụ gieo trồng", f3.thoi_vu_gieo_trong);
  dataRow(ws, r++, "37. Thời gian từ khi gieo đến khi mọc (ngày)", f3.thoi_gian_khi_gieo_moc);
  dataRow(ws, r++, "38. Thời gian từ trồng đến ra hoa (năm)", f3.thoi_gian_gieo_hoa);
  dataRow(ws, r++, "39. Thời gian từ trồng đến thu hoạch (năm)", f3.thoi_gian_gieo_qua);

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

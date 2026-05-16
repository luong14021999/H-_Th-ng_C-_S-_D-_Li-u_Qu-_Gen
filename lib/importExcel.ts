import ExcelJS from "exceljs";
import { NguonGen } from "@/data/nguonGen";
import { Form1Data, Form2Data, Form3Data, Form4Data } from "@/data/extendedTypes";

export interface ImportResult {
  basic: Partial<NguonGen>;
  form1: Partial<Form1Data>;
  form2: Partial<Form2Data>;
  form3: Partial<Form3Data>;
  form4: Partial<Form4Data>;
}

function cellStr(ws: ExcelJS.Worksheet, row: number, col: number): string {
  const v = ws.getCell(row, col).value;
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    if ("richText" in v) return (v as ExcelJS.CellRichTextValue).richText.map((r) => r.text).join("").trim();
    if ("text" in v) return String((v as ExcelJS.CellHyperlinkValue).text).trim();
    if ("result" in v) return String((v as ExcelJS.CellFormulaValue).result ?? "").trim();
  }
  return String(v).trim();
}

// Build label→value map from a worksheet.
// Skips rows where col A equals col B (merged section headers),
// and skips values that are slash-only artifacts from old combined-cell exports.
function buildMap(ws: ExcelJS.Worksheet): Map<string, string> {
  const map = new Map<string, string>();
  const maxRow = ws.rowCount || 200;
  for (let r = 1; r <= maxRow; r++) {
    const label = cellStr(ws, r, 1);
    const value = cellStr(ws, r, 2);
    if (label && value && label !== value && !map.has(label) && !/^[/\s]*$/.test(value)) {
      map.set(label, value);
    }
  }
  return map;
}

function g(m: Map<string, string>, ...labels: string[]): string {
  for (const label of labels) {
    const v = m.get(label);
    if (v) return v;
  }
  return "";
}


// ─── Form 1 (sheet 0: "00.TTCB") ─────────────────────────────
function parseForm1(ws: ExcelJS.Worksheet): { basic: Partial<NguonGen>; form1: Partial<Form1Data> } {
  const m = buildMap(ws);
  return {
    basic: {
      ma:        g(m, "Mã nguồn gen"),
      ten:       g(m, "Tên Việt Nam"),
      khoa_hoc:  g(m, "Tên khoa học"),
      nhom:      g(m, "Nhóm nguồn gen"),
      phan_nhom: g(m, "Phân nhóm"),
      don_vi:    g(m, "Đơn vị sản xuất/cung cấp"),
    },
    form1: {
      ten_khac:          g(m, "Tên khác"),
      ten_ho:            g(m, "Tên họ"),
      ten_bo:            g(m, "Tên bộ"),
      nguon_giao:        g(m, "Người/cơ quan giao, trồng/cấp giống"),
      noi_thu_thap_tinh: g(m, "Tỉnh/TP"),
      noi_thu_thap_huyen:g(m, "Huyện"),
      noi_thu_thap_xa:   g(m, "Xã"),
      dia_chi_chi_tiet:  g(m, "Địa chỉ chi tiết"),
      mo_ta_thu_thap:    g(m, "Mô tả nơi thu thập"),
      noi_phan_bo:       g(m, "Nơi phân bố/nuôi/trồng"),
    },
  };
}

// ─── Form 2 (sheet 1: "01.ĐTNG") ─────────────────────────────
function parseForm2(ws: ExcelJS.Worksheet, nhom: string, phan_nhom: string): Partial<Form2Data> {
  const m = buildMap(ws);

  const isDLUseTTLN = nhom === "DL" && ["Thân bụi", "Thân gỗ", "Thân leo", "Thân thảo"].includes(phan_nhom);

  // When nhom is unknown (no Form1 sheet exported), detect from unique Section III labels.
  // CN and TS share identical labels, so we dual-write both when ambiguous.
  let detectedNhom = nhom;
  let cntsAmbiguous = false;
  if (!nhom) {
    if (m.has("16. Địa hình")) {
      detectedNhom = "TT";
    } else if (m.has("12. Nguồn gốc giống/chủng VSV")) {
      detectedNhom = "VS";
    } else if (m.has("18. Kỹ thuật nuôi trồng")) {
      detectedNhom = "DL";
    } else if (m.has("17. Loại hình nuôi/trồng")) {
      detectedNhom = "CN";
      cntsAmbiguous = true; // also write TS fields
    } else {
      detectedNhom = "TT";
    }
  }

  const isTTLN = ["TT", "LN"].includes(detectedNhom) || isDLUseTTLN;
  const isDL   = detectedNhom === "DL" && !isDLUseTTLN;
  const isCN   = detectedNhom === "CN" || cntsAmbiguous;
  const isTS   = detectedNhom === "TS" || cntsAmbiguous;
  const isVS   = detectedNhom === "VS";

  // Section I — fixed for all nhom
  const result: Partial<Form2Data> = {
    ma_thu_thap:   g(m, "1. Mã thu thập"),
    ten_viet_bo:   g(m, "2. Tên nguồn gen — Tên Việt Nam — Tên bộ"),
    ten_viet_ho:   g(m, "Tên Việt Nam — Tên họ"),
    ten_viet_chi:  g(m, "Tên Việt Nam — Tên chi"),
    ten_viet_loai: g(m, "Tên Việt Nam — Tên loài"),
    ten_khoa_bo:   g(m, "Tên khoa học — Tên bộ"),
    ten_khoa_ho:   g(m, "Tên khoa học — Tên họ"),
    ten_khoa_chi:  g(m, "Tên khoa học — Tên chi"),
    ten_khoa_loai: g(m, "Tên khoa học — Tên loài"),
    ten_khac_2:    g(m, "Tên khác"),
    ngay_thu_thap: g(m, "3. Ngày thu thập"),
    thon_ban:      g(m, "4. Nơi thu thập — Thôn Bản"),
    xa_phuong:     g(m, "Nơi thu thập — Xã Phường"),
    huyen_thi_tp:  g(m, "Nơi thu thập — Huyện Thị TP"),
    tinh:          g(m, "Nơi thu thập — Tỉnh"),
    toa_do_x:      g(m, "Tọa độ X"),
    toa_do_y:      g(m, "Tọa độ Y"),
    do_cao:        g(m, "Độ cao (m)"),
    ten_nguon_goc:      g(m, "5. Tên người/cơ quan gieo, trồng/cấp giống"),
    ten_nguoi_thu_thap: g(m, "6. Tên người thu thập"),
    co_quan_dieu_tra:   g(m, "7. Cơ quan điều tra, thu thập"),
    // Section II — fixed
    nguon_goc_mau:    g(m, "8. Nguồn gốc mẫu thu thập"),
    ban_chat_truyen:  g(m, "10. Bản chất di truyền của mẫu"),
    muc_do_thuan:     g(m, "11. Mức độ thuần của mẫu"),
    thoi_gian_ton_tai:g(m, "12. Thời gian tồn tại của giống/loài"),
    muc_do_pho_bien:  g(m, "13. Mức độ phổ biến"),
    xu_huong_phat_trien: g(m, "14. Xu hướng phát triển"),
    // Section V
    dac_tinh_noi_bat: g(m, "Đặc tính nổi bật"),
  };

  // Dạng mẫu (field 9) — combined "val — khac"
  const dangMau = g(m, "9. Dạng mẫu được thu thập");
  if (dangMau.includes(" — ")) {
    const [dm, dmk] = dangMau.split(" — ");
    result.dang_mau = dm.trim(); result.dang_mau_khac = dmk.trim();
  } else { result.dang_mau = dangMau; }

  const splitCombo = (raw: string): [string, string] => {
    if (raw.includes(" — ")) { const [a, b] = raw.split(" — "); return [a.trim(), b.trim()]; }
    return [raw, ""];
  };

  // Section III — nhom-specific
  if (isTTLN) {
    result.dia_hinh = g(m, "16. Địa hình");
    const [ld, ldk] = splitCombo(g(m, "17. Loại đất"));
    result.loai_dat = ld; result.loai_dat_khac = ldk;
    result.mau_dat  = g(m, "18. Màu đất");
    result.do_chua  = g(m, "19. Độ chua của đất");
    const [vl, vlk] = splitCombo(g(m, "20. Vật liệu nhân giống"));
    result.vat_lieu_nhan_giong = vl; result.vat_lieu_nhan_giong_khac = vlk;
    result.nguon_giong_ruong    = g(m, "21. Nguồn gốc giống");
    result.phuong_thuc_canh_tac = g(m, "22. Phương thức canh tác");
    result.phuong_phap_gieo_trong = g(m, "23. Phương pháp gieo trồng");
    result.thoi_vu_trong          = g(m, "24. Thời vụ trồng");
    result.thoi_gian_sinh_truong  = g(m, "25. Thời gian sinh trưởng hoặc thành thục");
    result.phan_bon               = g(m, "26. Phân bón");
    result.phong_tru_sau_benh     = g(m, "27. Biện pháp phòng trừ sâu bệnh");
    // Section IV TT/LN
    result.phan_cay_su_dung       = g(m, "28. Bộ phận của cây được thu hoạch, sử dụng chính");
    result.muc_dich_su_dung       = g(m, "29. Mục đích sử dụng chính");
    result.thu_hoach               = g(m, "30. Phương pháp thu hoạch sản phẩm");
    result.phuong_phap_bao_quan_sp = g(m, "31. Phương pháp bảo quản sản phẩm");
    result.cach_che_bien           = g(m, "32. Cách chế biến");
    result.phuong_phap_de_giong    = g(m, "33. Phương pháp để giống");
    result.kinh_nghiem_chon_giong  = g(m, "34. Kinh nghiệm, tiêu chí chọn giống");
  } else if (isDL) {
    result.nguon_giong_ruong      = g(m, "16. Nguồn gốc giống");
    result.dl_loai_hinh_nuoi_trong = g(m, "17. Loại hình nuôi trồng");
    result.dl_ky_thuat_nuoi_trong  = g(m, "18. Kỹ thuật nuôi trồng");
    result.thoi_vu_trong           = g(m, "19. Thời vụ trồng");
    result.dl_thoi_vu_thu_hoach    = g(m, "20. Thời vụ thu hoạch");
    const [vl, vlk] = splitCombo(g(m, "21. Vật liệu nhân giống"));
    result.vat_lieu_nhan_giong = vl; result.vat_lieu_nhan_giong_khac = vlk;
    result.thoi_gian_sinh_truong   = g(m, "22. Thời gian sinh trưởng (từ trồng đến thu hoạch)");
    result.phan_bon                = g(m, "23. Phân bón/dinh dưỡng bổ sung");
    result.phong_tru_sau_benh      = g(m, "24. Biện pháp phòng trừ sâu bệnh");
    // Section IV DL
    result.muc_dich_su_dung        = g(m, "25. Mục đích sử dụng chính");
    result.phan_cay_su_dung        = g(m, "26. Bộ phận thu hoạch, sử dụng chính");
    result.thu_hoach               = g(m, "27. Phương pháp thu hoạch sản phẩm");
    result.phuong_phap_bao_quan_sp = g(m, "28. Phương pháp bảo quản sản phẩm");
    result.cach_che_bien           = g(m, "29. Cách chế biến");
    result.phuong_phap_de_giong    = g(m, "30. Phương pháp để giống");
    result.kinh_nghiem_chon_giong  = g(m, "31. Kinh nghiệm, tiêu chí chọn giống");
  }

  // CN and TS blocks are independent (not else-if) so both run when cntsAmbiguous is true,
  // letting the correct nhom's fields be populated regardless of which the record actually is.
  if (isCN) {
    result.cn_nguon_goc_giong      = g(m, "16. Nguồn gốc giống");
    result.cn_hinh_thuc_chan_nuoi  = g(m, "17. Loại hình nuôi/trồng");
    result.cn_thuc_an              = g(m, "18. Thức ăn");
    result.nguon_giong_ruong       = g(m, "19. Nguồn gốc giống (tự để giống/mua từ CSSX/...)");
    result.cn_phuong_thuc_nuoi     = g(m, "20. Phương thức nuôi");
    result.thoi_gian_sinh_truong   = g(m, "21. Thời gian sinh trưởng hoặc tuổi thành thục");
    result.cn_phong_dich           = g(m, "22. Biện pháp phòng trừ sâu bệnh");
    // Section IV CN
    result.phan_cay_su_dung        = g(m, "23. Bộ phận được thu hoạch, sử dụng chính");
    result.muc_dich_su_dung        = g(m, "24. Mục đích sử dụng chính");
    result.thu_hoach               = g(m, "25. Phương pháp thu hoạch sản phẩm");
    result.phuong_phap_bao_quan_sp = g(m, "26. Phương pháp bảo quản sản phẩm");
    result.cach_che_bien           = g(m, "27. Cách chế biến");
    result.phuong_phap_de_giong    = g(m, "28. Phương pháp để giống");
    result.kinh_nghiem_chon_giong  = g(m, "29. Kinh nghiệm, tiêu chí chọn giống");
  }

  if (isTS) {
    result.ts_nguon_goc_giong  = g(m, "16. Nguồn gốc giống");
    const lh = g(m, "17. Loại hình nuôi/trồng");
    if (lh.startsWith("Khác — ")) { result.ts_loai_hinh_nuoi = "Khác"; result.ts_loai_hinh_nuoi_khac = lh.slice(7); }
    else result.ts_loai_hinh_nuoi = lh;
    result.ts_thuc_an = g(m, "18. Thức ăn");
    const ng = g(m, "19. Nguồn gốc giống (tự để giống/mua từ CSSX/...)");
    if (ng.startsWith("Khác — ")) { result.nguon_giong_ruong = "Khác"; result.ts_nguon_giong_khac = ng.slice(7); }
    else result.nguon_giong_ruong = ng;
    const pt = g(m, "20. Phương thức nuôi");
    if (pt.startsWith("Khác — ")) { result.ts_phuong_thuc_nuoi = "Khác"; result.ts_phuong_thuc_nuoi_khac = pt.slice(7); }
    else result.ts_phuong_thuc_nuoi = pt;
    result.thoi_gian_sinh_truong   = g(m, "21. Thời gian sinh trưởng hoặc tuổi thành thục");
    result.phong_tru_sau_benh      = g(m, "22. Biện pháp phòng trừ sâu bệnh");
    // Section IV TS
    result.phan_cay_su_dung        = g(m, "23. Bộ phận được thu hoạch, sử dụng chính");
    result.muc_dich_su_dung        = g(m, "24. Mục đích sử dụng chính");
    result.thu_hoach               = g(m, "25. Phương pháp thu hoạch sản phẩm");
    result.phuong_phap_bao_quan_sp = g(m, "26. Phương pháp bảo quản sản phẩm");
    result.cach_che_bien           = g(m, "27. Cách chế biến");
    result.phuong_phap_de_giong    = g(m, "28. Phương pháp để giống");
    result.kinh_nghiem_chon_giong  = g(m, "29. Kinh nghiệm, tiêu chí chọn giống");
  }

  if (isVS) {
    result.nguon_giong_ruong       = g(m, "12. Nguồn gốc giống/chủng VSV");
    result.dl_loai_hinh_nuoi_trong = g(m, "13. Loại hình sản xuất");
    result.dl_ky_thuat_nuoi_trong  = g(m, "14. Kỹ thuật nuôi trồng");
    result.thoi_vu_trong           = g(m, "15. Thời vụ trồng");
    result.dl_thoi_vu_thu_hoach    = g(m, "16. Thời vụ thu hoạch");
    const [vl, vlk] = splitCombo(g(m, "17. Vật liệu nhân giống"));
    result.vat_lieu_nhan_giong = vl; result.vat_lieu_nhan_giong_khac = vlk;
    result.vs_moi_truong_nuoi_cay  = g(m, "18. Môi trường giá thể dinh dưỡng");
    // Section IV VS
    result.muc_dich_su_dung        = g(m, "19. Mục đích sử dụng chính");
    result.phan_cay_su_dung        = g(m, "20. Bộ phận được thu hoạch, sử dụng chính");
    result.thu_hoach               = g(m, "21. Khai thác sản phẩm");
    result.phuong_phap_bao_quan_sp = g(m, "22. Phương pháp bảo quản sản phẩm");
    result.cach_che_bien           = g(m, "23. Phương pháp sản xuất, chế biến");
    result.phuong_phap_de_giong    = g(m, "24. Phương pháp duy trì, bảo quản");
    result.kinh_nghiem_chon_giong  = g(m, "25. Kinh nghiệm, tiêu chí chọn chủng/giống");
  }

  return result;
}

// ─── Form 3 label → field map ─────────────────────────────────
// Using array of tuples to allow multiple entries for the same field (different nhom variants)
const F3: [string, keyof Form3Data][] = [
  // Section I
  ["1. Mã số hệ thống", "ma_so_he_thong"],
  ["2. Mã số nhiệm vụ", "ma_so_nhiem_vu"],
  ["4. Tên giống", "ten_giong"],
  ["5. Nguồn giống (nguồn giống đem nhân)", "nguon_giong"],
  ["6. Nơi nhân giống/nuôi/trồng/cấp giống", "noi_nhan_giong"],
  ["7. Người mô tả, đánh giá", "nguoi_mo_ta"],
  ["8. Cơ quan mô tả, đánh giá", "co_quan_mo_ta"],
  ["9. Đặc điểm chung", "dac_diem_chung"],
  // DL morphology
  ["10. Dạng cây", "dang_cay"],
  ["11. Đường kính thân", "duong_kinh_than"],
  ["12. Chiều cao cây (cm; n=5)", "chieu_cao_cay"],
  ["13. Màu sắc thân", "mau_sac_than"],
  ["14. Đường kính tán (cm; n=5)", "duong_kinh_tan"],
  ["15. Kiểu gân lá", "kieu_gan_la"],
  ["16. Hình dạng lá", "hinh_dang_la"],
  ["17. Màu lá", "mau_la"],
  ["18. Kiểu lá", "kieu_la"],
  ["19. Kiểu hoa", "kieu_hoa"],
  ["20. Màu sắc cánh hoa", "mau_sac_canh_hoa"],
  ["21. Hình dạng hoa", "hinh_dang_hoa"],
  ["22. Bầu (thượng/trung/hạ)", "bau"],
  ["23. Mùi hoa", "mui_hoa"],
  ["24. Hình dạng quả", "hinh_dang_qua"],
  ["25. Loại quả", "loai_qua"],
  ["26. Số hạt trên quả (n=5)", "so_hat_tren_qua"],
  ["27. Dạng hạt", "dang_hat"],
  ["28. Bề mặt hạt", "be_mat_hat"],
  ["29. Ánh sáng", "anh_sang"],
  ["30. Đất, thổ nhưỡng", "dat_tho_nhuong"],
  ["31. Nhiệt độ", "nhiet_do"],
  ["32. Độ ẩm", "do_am"],
  ["33. Hình thức sinh trưởng", "hinh_thuc_sinh_truong"],
  ["34. Tỷ lệ nảy mầm", "ti_le_nay_mam"],
  ["35. Điều kiện nảy mầm", "dieu_kien_nay_mam"],
  ["36. Thời vụ gieo trồng", "thoi_vu_gieo_trong"],
  ["37. Thời gian từ khi gieo đến khi mọc (ngày)", "thoi_gian_khi_gieo_moc"],
  ["38. Thời gian từ trồng đến ra hoa, kết quả (năm)", "thoi_gian_gieo_hoa"],
  ["39. Thời gian từ trồng đến thu hoạch (năm)", "thoi_gian_gieo_qua"],
  // TT morphology
  ["10. Chiều cao mạ", "tt_chieu_cao_ma"],
  ["11. Chiều dài lá", "tt_chieu_dai_la"],
  ["12. Chiều rộng lá", "tt_chieu_rong_la"],
  ["13. Độ phủ lông của lá", "tt_do_phu_long_la"],
  ["14. Màu phiến lá", "tt_mau_phien_la"],
  ["15. Màu bẹ lá", "tt_mau_be_la"],
  ["16. Góc lá", "tt_goc_la"],
  ["17. Góc lá đòng", "tt_goc_la_dong"],
  ["18. Dài thìa lìa", "tt_dai_thia_lia"],
  ["19. Màu thìa lìa", "tt_mau_thia_lia"],
  ["20. Dạng thìa lìa", "tt_dang_thia_lia"],
  ["21. Màu cổ lá", "tt_mau_co_la"],
  ["22. Màu tai lá", "tt_mau_tai_la"],
  ["23. Chiều dài thân", "tt_chieu_dai_than"],
  ["24. Số rãnh", "tt_so_ranh"],
  ["25. Góc thân", "tt_goc_than"],
  ["26. Đường kính ống dạ", "tt_duong_kinh_ong_da"],
  ["27. Màu sắc ống dạ", "tt_mau_sac_ong_da"],
  ["28. Độ cứng cây", "tt_do_cung_cay"],
  ["29. Dài bông", "tt_dai_bong"],
  ["30. Dạng bông", "tt_dang_bong"],
  ["31. Phân nhánh thứ cấp trên bông", "tt_phan_nhanh_thu_cap"],
  ["32. Độ thoát cổ bông", "tt_do_thoat_co_bong"],
  ["33. Trục bông", "tt_truc_bong"],
  ["34. Độ tàn lá", "tt_do_tan_la"],
  ["35. Độ rụng hạt", "tt_do_rung_hat"],
  ["36. Độ dai của hạt khi tút", "tt_do_dai_hat_tut"],
  ["37. Râu", "tt_rau"],
  ["38. Màu râu", "tt_mau_rau"],
  ["39. Màu mỏ hạt", "tt_mau_mo_hat"],
  ["40. Màu vỏ trấu", "tt_mau_vo_trau"],
  ["41. Độ phủ lông vỏ trấu", "tt_do_phu_long_vo_trau"],
  ["42. Màu mày hạt", "tt_mau_may_hat"],
  ["43. Chiều dài mày hạt", "tt_chieu_dai_may_hat"],
  ["44. Độ thụ phấn của bông", "tt_do_thu_phan_bong"],
  ["45. Trọng lượng 1000 hạt", "tt_trong_luong_1000_hat"],
  ["46. Chiều dài hạt (mm)", "tt_chieu_dai_hat"],
  ["47. Chiều rộng hạt (mm)", "tt_chieu_rong_hat"],
  ["48. Màu vỏ gạo", "tt_mau_vo_gao"],
  ["49. Ánh sáng", "anh_sang"],
  ["50. Đất, thổ nhưỡng", "dat_tho_nhuong"],
  ["51. Nhiệt độ", "nhiet_do"],
  ["52. Độ ẩm", "do_am"],
  ["54. Hình thức sinh trưởng", "hinh_thuc_sinh_truong"],
  ["55. Tỷ lệ nảy mầm", "ti_le_nay_mam"],
  ["56. Điều kiện nảy mầm", "dieu_kien_nay_mam"],
  ["57. Thời vụ gieo trồng", "thoi_vu_gieo_trong"],
  ["58. Thời gian từ khi gieo đến khi mọc", "thoi_gian_khi_gieo_moc"],
  ["59. Thời gian từ trồng đến trổ bông", "tt_thoi_gian_tro_bong"],
  ["60. Thời gian từ trồng đến chín (thu hoạch)", "tt_thoi_gian_sinh_truong_ngay"],
  // LN morphology
  ["10. Dạng cây (gỗ lớn/gỗ nhỏ/cây bụi/...)", "ln_dang_cay"],
  ["11. Chiều cao cây — Chiều cao (Hvn) (m)", "ln_chieu_cao_hvn"],
  ["11. Chiều cao cây — Chiều cao dưới cành (Hdc) (m)", "ln_chieu_cao_hdc"],
  ["12. Đường kính ngang ngực D1.3 (cm)", "ln_duong_kinh_d13"],
  ["13. Đặc điểm gốc cây (có đế/có bạnh vè/có rễ khí sinh/có gai/...)", "ln_dac_diem_goc"],
  ["14. Sắc tố cành non (xanh vàng/xanh lục/gi sắt/tím/...)", "ln_sac_to_canh_non"],
  ["15. Lông ở cành non (có/không)", "ln_long_canh_non"],
  ["16. Góc phân cành (<45°/45°–90°/>90°)", "ln_goc_phan_canh"],
  ["17. Hình thái tán cây (tròn/trứng/trứng ngược/thuần/quạt/...)", "ln_hinh_thai_tan"],
  ["18. Đường kính tán: (Dt) (m)", "ln_duong_kinh_tan"],
  ["19. Hình dạng lá (hình trứng/trứng ngược/xẻ thùy lông chim/xẻ thùy chân vịt/hình tim/hình kiếm/...)", "ln_hinh_dang_la"],
  ["20. Kiểu lá (đơn/kép lông chim 1-2 lần chẵn/lẻ/kép chân vịt/...)", "ln_kieu_la"],
  ["21. Cuống lá (có/không)", "ln_cuong_la"],
  ["22. Kích thước lá — Dài (cm)", "ln_kich_thuoc_la"],
  ["22. Kích thước lá — Rộng (cm)", "ln_kich_thuoc_la_rong"],
  ["23. Gân lá (song song/hình lông chim/hình chân vịt/...)", "ln_gan_la"],
  ["24. Màu lá (xanh thẫm/xanh nhạt/xanh tím/vàng nhạt/...)", "ln_mau_la"],
  ["25. Màu lá non (xanh thẫm/xanh nhạt/xanh tím/vàng nhạt/...)", "ln_mau_la_non"],
  ["26. Mép lá (liền/lượn sóng/răng cưa/xẻ thùy/...)", "ln_mep_la"],
  ["27. Đầu lá (nhọn/nhọn gấp/tù/tròn/...)", "ln_dau_la"],
  ["28. Đuôi lá (hình nêm/tròn/tù/hình khiên/...)", "ln_duoi_la"],
  ["29. Sắp xếp lá (mọc cách/mọc đối/mọc vòng/...)", "ln_sap_xep_la"],
  ["30. Kiểu hoa (đơn/phức/tự đơn trục/tự hợp trục/tự hỗn hợp/...)", "ln_kieu_hoa"],
  ["31. Kiểu đính hoa (nách lá/ngọn cành/đối lá/...)", "ln_kieu_dinh_hoa"],
  ["32. Kích thước đường kính hoa (mm)", "ln_kich_thuoc_hoa"],
  ["33. Hình dạng hoa (hình chuông/hình phễu/hình ống/hình đĩa/...)", "ln_hinh_dang_hoa"],
  ["34. Đế hoa (phẳng/lồi/lõm/...)", "ln_de_hoa"],
  ["35. Đài hoa (hình ống/hình chuông/hình bẹ/xẻ thùy/...)", "ln_dai_hoa"],
  ["36. Tràng hoa (xếp vòng/xếp thìa/xếp vặn/...)", "ln_trang_hoa"],
  ["37. Màu sắc tràng hoa (trắng/vàng/đỏ/hồng/tím/...)", "ln_mau_sac_trang_hoa"],
  ["38. Nhị hoa (rời/hợp)", "ln_nhi_hoa"],
  ["39. Bao phấn (hình mũi tên/ống nhị/cột nhị/...)", "ln_bao_phan"],
  ["40. Nhụy hoa (1 lá noãn/2 lá noãn/nhiều lá noãn/...)", "ln_nhuy_hoa"],
  ["41. Mùi hoa (không mùi/nhẹ/trung bình/nặng/...)", "ln_mui_hoa"],
  ["42. Hướng mọc của hoa (đứng/ngang/rủ xuống/...)", "ln_huong_moc_hoa"],
  ["43. Kiểu quả (đơn/kép/...)", "ln_kieu_qua"],
  ["44. Loại quả (hạch/nang/đậu/cánh/mọng/...)", "ln_loai_qua"],
  ["45. Hình dạng quả (tròn/bầu dục/hình trụ/...)", "ln_hinh_dang_qua"],
  ["46. Kích thước quả — Dài (cm)", "ln_kich_thuoc_qua"],
  ["46. Kích thước quả — Rộng/đường kính (cm)", "ln_kich_thuoc_qua_rong"],
  ["47. Màu sắc vỏ quả khi chín", "ln_mau_vo_qua"],
  ["48. Số hạt trên quả (TB)", "ln_so_hat_qua"],
  ["49. Dạng hạt (hình tròn/hình cầu/hình trứng/...)", "ln_dang_hat"],
  ["50. Bề mặt hạt (trơn/sần sùi/có lông/...)", "ln_be_mat_hat"],
  ["51. Màu hạt", "ln_mau_hat"],
  ["52. Kích thước hạt — Dài (mm)", "ln_kich_thuoc_hat"],
  ["52. Kích thước hạt — Rộng (mm)", "ln_kich_thuoc_hat_rong"],
  ["53. Trọng lượng 1000 hạt (Kg)", "ln_trong_luong_1000_hat"],
  ["54. Cấu tạo cây mầm", "ln_cau_tao_cay_mam"],
  ["55. Ánh sáng", "anh_sang"],
  ["56. Đất, thổ nhưỡng", "dat_tho_nhuong"],
  ["57. Nhiệt độ", "nhiet_do"],
  ["58. Độ ẩm", "do_am"],
  ["59. Hình thức sinh trưởng (liên tục/nhịp điệu/...)", "hinh_thuc_sinh_truong"],
  ["60. Tỷ lệ nảy mầm (<50%/50–80%/>80%)", "ti_le_nay_mam"],
  ["61. Điều kiện nảy mầm (gieo trực tiếp/ủ/...)", "dieu_kien_nay_mam"],
  ["62. Thời vụ gieo trồng (xuân/thu/xuân hè/thu đông/quanh năm/...)", "thoi_vu_gieo_trong"],
  ["63. Thời gian từ khi gieo đến khi mọc (ngày)", "thoi_gian_khi_gieo_moc"],
  ["64. Thời gian từ trồng đến ra hoa, kết quả (năm)", "ln_thoi_gian_ra_hoa"],
  ["65. Thời gian từ trồng đến thu hoạch (năm)", "ln_thoi_gian_thu_hoach"],
  // TN (Tre nứa) morphology
  ["10. Thân ngầm (mọc cum/mọc phân tán/mọc tản/...)", "tn_than_ngam"],
  ["11. Thân khí sinh — Chiều cao (TB)", "tn_chieu_cao_than"],
  ["11. Thân khí sinh — Đường kính (TB)", "tn_duong_kinh_than"],
  ["12. Chiều dài lóng (TB) (cm)", "tn_chieu_dai_long"],
  ["13. Chiều dài lá (TB) (cm)", "tn_chieu_dai_la"],
  ["14. Chiều rộng lá (TB) (cm)", "tn_chieu_rong_la"],
  ["15. Độ phủ lông của lá (trơn/trung bình/phủ lông/...)", "tn_do_phu_long_la"],
  ["16. Màu phiến lá (xanh/xanh nhạt/xanh đậm/...)", "tn_mau_phien_la"],
  ["17. Màu góc bẹ lá (xanh/có sọc tím/tím nhạt/tím/...)", "tn_mau_goc_be_la"],
  ["18. Góc lá (đứng/ngang/rũ xuống/...)", "tn_goc_la"],
  ["19. Màu cổ lá (xanh/xanh nhạt/tím/...)", "tn_mau_co_la"],
  ["20. Màu tai lá (xanh nhạt/tím/...)", "tn_mau_tai_la"],
  ["21. Hình dạng mo thân (hình tam giác/hình thang rộng/hình thang hẹp/...)", "tn_hinh_dang_mo_than"],
  ["22. Màu sắc mo thân (xanh nhạt/xanh lục/vàng rơm/nâu nhạt/...)", "tn_mau_sac_mo_than"],
  ["23. Màu lông mo (xám/nâu/nâu vàng/tím đen/...)", "tn_mau_long_mo"],
  ["24. Tai mo (có/không)", "tn_tai_mo"],
  ["25. Lá mo (hình tam giác/hình trứng/hình thuôn hẹp/...)", "tn_la_mo"],
  ["26. Dạng bông/khuy (chụm/trung gian/mở/...)", "tn_dang_bong"],
  ["27. Phân nhánh thứ cấp trên bông (không/nhẹ/nặng/dề cụm/...)", "tn_phan_nhanh"],
  ["28. Màu hạt (trắng/đỉnh đỏ/nâu/đỉnh tím/...)", "tn_mau_hat"],
  ["29. Trọng lượng 1000 hạt (kg)", "ln_trong_luong_1000_hat"],
  ["30. Chiều dài hạt (mm)", "ln_kich_thuoc_hat"],
  ["31. Chiều rộng hạt (mm)", "ln_kich_thuoc_hat_rong"],
  ["32. Ánh sáng", "anh_sang"],
  ["33. Đất, thổ nhưỡng", "dat_tho_nhuong"],
  ["34. Nhiệt độ", "nhiet_do"],
  ["35. Độ ẩm", "do_am"],
  ["36. Tỷ lệ nảy mầm (<50%/50–80%/>80%)", "ti_le_nay_mam"],
  ["37. Điều kiện nảy mầm (gieo trực tiếp/xử lý/ủ ấm/...)", "dieu_kien_nay_mam"],
  ["38. Thời vụ gieo trồng (xuân/thu/...)", "thoi_vu_gieo_trong"],
  ["39. Thời gian từ khi gieo đến khi mọc (ngày)", "thoi_gian_khi_gieo_moc"],
  ["40. Thời gian từ trồng đến ra hoa, kết quả (năm)", "ln_thoi_gian_ra_hoa"],
  ["41. Thời gian từ trồng đến thu hoạch (năm)", "ln_thoi_gian_thu_hoach"],
  // CN morphology (various phan_nhom)
  ["10. Hình thái lông (Bình thường/Quăn/Mượt/Dạng khác)", "cn_hinh_thai_long"],
  ["10. Hình thái lông (Bình thường/Quăn/Mượt/...)", "cn_hinh_thai_long"],
  ["10. Hình thái lông", "cn_hinh_thai_long"],
  ["11. Phân bố lông", "cn_phan_bo_long"],
  ["12. Kiểu bộ lông", "cn_kieu_bo_long"],
  ["12. Mào", "cn_mao"],
  ["13. Kiểu bộ lông", "cn_kieu_bo_long"],
  ["13. Bộ lông (Một kiểu/chập và – Không khuôn mẫu)", "cn_kieu_bo_long"],
  ["13. Màu bộ lông (Trắng/đen/xanh/đỏ/vàng rơm/khác)", "cn_mau_bo_long"],
  ["14. Màu bộ lông (Trắng/đen/xanh/đỏ/vàng rơm/khác)", "cn_mau_bo_long"],
  ["14. Màu bộ lông", "cn_mau_bo_long"],
  ["14. Màu lông (Trắng, đen/đỏ thẫm/đỏ sáng/nâu vàng/màu khác)", "cn_mau_bo_long"],
  ["15. Màu da (Trắng/vàng/đen/khác)", "cn_mau_da"],
  ["15. Màu da", "cn_mau_da"],
  ["15. Đầu (Lõm/Thẳng/Gồ)", "tgs_dau"],
  ["16. Màu dái tai (Trắng/đỏ/khác)", "cn_mau_dai_tai"],
  ["16. Màu dái tai", "cn_mau_dai_tai"],
  ["16. Kiểu mào", "cn_kieu_mao"],
  ["16. Kiểu tai (Cụp/rủ/thông/dựng lên)", "tgs_kieu_tai"],
  ["17. Kiểu mào", "cn_kieu_mao"],
  ["17. Độ lớn của mào", "cn_do_lon_mao"],
  ["17. Hướng tai (Hướng trước/ngang/sau)", "tgs_huong_tai"],
  ["18. Độ lớn của mào", "cn_do_lon_mao"],
  ["18. Màu mắt", "cn_mau_mat"],
  ["18. Da (Trơn/nhăn)", "tgs_da"],
  ["19. Màu mắt", "cn_mau_mat"],
  ["19. Các dạng bộ xương", "cn_cac_dang_bo_xuong"],
  ["19. Đuôi (Thẳng cong)", "tgs_duoi"],
  ["20. Các dạng bộ xương", "cn_cac_dang_bo_xuong"],
  ["20. Các chiều đo (8 Chiều đo)", "cn_cac_chieu_do"],
  ["20. Lưng (Thẳng/võng/kiểu khác)", "tgs_lung"],
  ["21. Các chiều đo (8 Chiều đo)", "cn_cac_chieu_do"],
  ["21. Các chiều đo (8 chiều đo)", "cn_cac_chieu_do"],
  ["21. Chân (Ngắn, dài, TB so với cơ thể)", "tgs_chan"],
  ["22. Các đặc điểm khác", "cn_dac_diem_khac"],
  ["22. Các chiều đo", "cn_cac_chieu_do"],
  ["23. KLCT", "tgs_klct"],
  ["23. Nhiệt độ thích hợp (°C)", "nhiet_do"],
  ["24. Độ ẩm chuồng trại (%)", "do_am"],
  ["24. Dài thân", "cn_chieu_dai_than"],
  ["25. Điều kiện ánh sáng/chuồng trại", "anh_sang"],
  ["25. Dài đầu", "tgs_dai_dau"],
  ["26. Yêu cầu đất/nền chuồng và chế độ dinh dưỡng", "dat_tho_nhuong"],
  ["26. Dài tai", "tgs_dai_tai"],
  ["27. Hình thức sinh trưởng (liên tục/theo mùa/...)", "hinh_thuc_sinh_truong"],
  ["27. Dài đuôi", "tgs_dai_duoi"],
  ["28. Tuổi thành thục sinh dục (tháng)", "cn_tuoi_thanh_thuc"],
  ["28. Vòng ngực", "cn_vong_nguc"],
  ["29. Thời gian mang thai/ấp trứng (ngày)", "cn_thoi_gian_mang_thai"],
  ["29. Cao vai", "cn_chieu_cao_vai"],
  ["30. Số lứa/năm", "cn_so_lua_nam"],
  ["30. Số vú", "tgs_so_vu"],
  ["31. Số con/lứa (trung bình)", "cn_so_con_lua"],
  ["31. Trọng lượng trưởng thành (kg)", "cn_trong_luong_truong_thanh"],
  ["32. Sản lượng trứng/sữa (quả hoặc L/chu kỳ)", "cn_san_xuat_trung"],
  ["32. Đặc điểm khác", "cn_dac_diem_khac"],
  // TGS (Tiểu gia súc) — extra labels
  ["10. Lông (Quăn/Thẳng/Ngắn – Dài/Rậm/Thưa)", "tgs_long"],
  ["11. Mõm (Dài và mỏng – Ngắn và tròn – Kiểu khác)", "tgs_mom"],
  ["12. Răng nanh (Có/Không)", "tgs_rang_nanh"],
  // TS Cá
  ["10. Chiều dài toàn thân (cm)", "ts_chieu_dai_toan_than"],
  ["Chiều cao đầu (cm)", "ts_chieu_cao_dau"],
  ["11. Chiều dài kinh tế (cm)", "ts_chieu_dai_kinh_te"],
  ["Chiều rộng đầu (cm)", "ts_chieu_rong_dau"],
  ["12. Dài trước vây lưng (cm)", "ts_dai_truoc_vay_lung"],
  ["Chiều cao thân (cm)", "ts_chieu_cao_than"],
  ["13. Dài trước vây ngực (cm)", "ts_dai_truoc_vay_nguc"],
  ["Chiều dày thân (cm)", "ts_chieu_day_than"],
  ["14. Dài trước vây bụng (cm)", "ts_dai_truoc_vay_bung"],
  ["Số tia vây lưng", "ts_so_tia_vay_lung"],
  ["15. Dài trước vây hậu môn (cm)", "ts_dai_truoc_vay_hau_mon"],
  ["Số tia vây ngực", "ts_so_tia_vay_nguc"],
  ["16. Chiều dài đầu (cm)", "ts_chieu_dai_dau"],
  ["Số tia vây bụng", "ts_so_tia_vay_bung"],
  ["17. Chiều dài mõm (cm)", "ts_chieu_dai_mom"],
  ["Số tia vây hậu môn", "ts_so_tia_vay_hau_mon"],
  ["18. Đường kính mắt (cm)", "ts_duong_kinh_mat"],
  ["Số tia vây đuôi", "ts_so_tia_vay_duoi"],
  ["19. Khoảng cách hai mắt (cm)", "ts_khoang_cach_hai_mat"],
  ["Số vảy đường bên", "ts_so_vay_duong_ben"],
  ["20. Trọng lượng (g; n=10)", "ts_trong_luong_truong_thanh"],
  ["21. Cơ quan sinh sản", "ts_co_quan_sinh_san"],
  ["22. Môi trường sống (nước mặn, nước lợ, nước ngọt)", "ts_moi_truong_song"],
  ["23. Đặc điểm về dinh dưỡng", "ts_dac_diem_dinh_duong"],
  ["24. Đặc điểm về sinh sản", "ts_dac_diem_sinh_san"],
  ["26. Thời gian sinh trưởng", "ts_thoi_gian_sinh_truong_ts"],
  ["27. Các giai đoạn sinh trưởng (ấu trùng, con non, trưởng thành)", "ts_cac_giai_doan_sinh_truong"],
  ["28. Thời gian thành thục sinh dục", "ts_thoi_gian_thanh_thuc_sinh_duc"],
  // TS Ốc/Thân mềm
  ["10. Chiều dài vỏ", "oc_chieu_dai_vo"],
  ["11. Chiều rộng vỏ", "oc_chieu_rong_vo"],
  ["12. Chiều dày vỏ", "oc_chieu_day_vo"],
  ["13. Cơ quan sinh dục", "oc_co_quan_sinh_duc"],
  ["14. Màu sắc", "oc_mau_sac"],
  ["16. Môi trường sống (nước mặn, nước lợ, nước ngọt)", "ts_moi_truong_song"],
  ["17. Đặc điểm về dinh dưỡng", "ts_dac_diem_dinh_duong"],
  ["18. Đặc điểm về sinh sản", "ts_dac_diem_sinh_san"],
  ["19. Thời gian sinh trưởng", "ts_thoi_gian_sinh_truong_ts"],
  ["20. Các giai đoạn sinh trưởng (ấu trùng, con non, trưởng thành)", "ts_cac_giai_doan_sinh_truong"],
  ["21. Thời gian thành thục sinh dục", "ts_thoi_gian_thanh_thuc_sinh_duc"],
  // TS Giáp xác
  ["10. Hình dạng chùy", "gx_hinh_dang_chuy"],
  ["11. Số gai chùy", "gx_so_gai_chuy"],
  ["12. Các loại gai", "gx_cac_loai_gai"],
  ["13. Các loại gờ", "gx_cac_loai_go"],
  ["14. Các loại rãnh", "gx_cac_loai_ranh"],
  ["15. Phần bụng: Số đốt", "gx_so_dot_bung"],
  ["16. Phần phụ đầu — Râu I", "gx_rau_1"],
  ["Râu II", "gx_rau_2"],
  ["17. Hàm trên", "gx_ham_tren"],
  ["Hàm dưới I", "gx_ham_duoi_1"],
  ["Hàm dưới II", "gx_ham_duoi_2"],
  ["18. Chân hàm I", "gx_chan_ham_1"],
  ["Chân hàm II", "gx_chan_ham_2"],
  ["Chân hàm III", "gx_chan_ham_3"],
  ["19. Chân bơi I", "gx_chan_boi_1"],
  ["Chân bơi II", "gx_chan_boi_2"],
  ["20. Chân bơi III-V", "gx_chan_boi_3_5"],
  ["21. Chân đuôi", "gx_chan_duoi"],
  ["22. Mang bên", "gx_mang_ben"],
  ["Mang khớp", "gx_mang_khop"],
  ["23. Mang nhánh", "gx_mang_nhanh"],
  ["Mang chân", "gx_mang_chan"],
  ["24. Phần phụ sinh dục đực", "gx_phan_phu_sinh_duc_duc"],
  ["25. Phần phụ sinh dục cái", "gx_phan_phu_sinh_duc_cai"],
  ["26. Màu sắc", "gx_mau_sac"],
  ["28. Môi trường sống (nước mặn, nước lợ, nước ngọt)", "ts_moi_truong_song"],
  ["29. Đặc điểm về dinh dưỡng", "ts_dac_diem_dinh_duong"],
  ["30. Đặc điểm về sinh sản", "ts_dac_diem_sinh_san"],
  ["31. Thời gian sinh trưởng", "ts_thoi_gian_sinh_truong_ts"],
  ["32. Các giai đoạn sinh trưởng (ấu trùng, con non, trưởng thành)", "ts_cac_giai_doan_sinh_truong"],
  ["33. Thời gian thành thục sinh dục", "ts_thoi_gian_thanh_thuc_sinh_duc"],
  // VS morphology
  ["10. Kích thước thân (cm)", "vs_kich_thuoc_than"],
  ["10. Kích thước rễ (cm)", "vs_kich_thuoc_re"],
  ["10. Kích thước mũ/đảm (cm)", "vs_kich_thuoc_mu_dam"],
  ["11. Màu sắc (rễ/thân/mũ đảm/tán nấm)", "vs_mau_sac"],
  ["12. Sợi nấm — Hình dạng", "vs_soi_nam_hinh_dang"],
  ["12. Sợi nấm — Kích thước (µm)", "vs_soi_nam_kich_thuoc"],
  ["12. Sợi nấm — Đa bào/Đơn bào", "vs_soi_nam_co_vach"],
  ["13. Bào tử vô tính (hình dạng/kích thước/màu sắc/đa-đơn bào)", "vs_bao_tu_vo_tinh"],
  ["13. Bào tử hữu tính (hình dạng/kích thước/màu sắc/đa-đơn bào)", "vs_bao_tu_huu_tinh"],
  ["13. Đặc điểm khác", "vs_dac_diem_khac"],
  ["15. Địa hình", "dat_tho_nhuong"],
  ["16. Thổ nhưỡng/giá thể sinh dưỡng", "vs_tho_nhuong"],
  ["17. Nhiệt độ (°C)", "nhiet_do"],
  ["18. Ẩm độ (%)", "do_am"],
  ["19. Ánh sáng", "anh_sang"],
  ["20. Dinh dưỡng", "vs_dinh_duong"],
  ["21. Biện pháp canh tác/nhân nuôi", "vs_bien_phap_canh_tac"],
  ["22. Thời gian sinh trưởng (từ lúc nuôi/trồng đến thu hoạch)", "vs_thoi_gian_khuan_lac"],
  ["23. Sinh trưởng — giai đoạn phát triển sợi nấm", "vs_toc_do_sinh_truong"],
  ["24. Phát triển — giai đoạn hình thành bào tử", "hinh_thuc_sinh_truong"],
  // Notes (fixed)
  ["Ghi chú (kháng sâu/bệnh, chịu sinh thái bất thuận)", "ghi_chu"],
  ["Danh mục tài liệu tham khảo", "tai_lieu_tham_khao"],
];

const FORM3_MAP = new Map<string, keyof Form3Data>(F3);

function parseForm3(ws: ExcelJS.Worksheet): { ma: string; data: Partial<Form3Data> } {
  const m = buildMap(ws);
  const ma = g(m, "3. Mã nguồn gen");
  const data: Partial<Form3Data> = {};
  for (const [label, field] of FORM3_MAP) {
    const val = m.get(label);
    if (val) (data as Record<string, string>)[field] = val;
  }
  return { ma, data };
}

// ─── Form 4 (sheet 3: "03.ĐTCT") ─────────────────────────────
function parseForm4(ws: ExcelJS.Worksheet): { ma: string; data: Partial<Form4Data> } {
  const m = buildMap(ws);
  return {
    ma: g(m, "3. Mã nguồn gen"),
    data: {
      ma_so_he_thong:         g(m, "1. Mã số của hệ thống"),
      ma_so_nhiem_vu:         g(m, "2. Mã số nhiệm vụ"),
      ten_giong:              g(m, "4. Tên giống"),
      nguon_giong:            g(m, "5. Nguồn giống (nguồn giống đem nhân)"),
      noi_nhan_giong:         g(m, "6. Nơi nhân giống, nuôi/trồng, cấp giống"),
      nguoi_mo_ta:            g(m, "7. Người mô tả, đánh giá"),
      co_quan_mo_ta:          g(m, "8. Cơ quan mô tả, đánh giá"),
      trinh_tu_dna:           g(m, "9. Trình tự DNA nguồn gen"),
      chieu_dai_dna:          g(m, "10. Chiều dài DNA"),
      ti_le_atgc:             g(m, "11. Tỷ lệ A, T, G, C"),
      chuoi_acid_amin:        g(m, "12. Chuỗi acid amin do DNA mã hóa"),
      thong_tin_nang_suat:    g(m, "14. Thông tin về năng suất"),
      thong_tin_chat_luong:   g(m, "15. Thông tin về chất lượng"),
      khang_sau_benh:         g(m, "16. Đặc tính kháng sâu/bệnh"),
      chiu_sinh_thai_bat_thuon:g(m, "17. Đặc tính chịu sinh thái bất thuận"),
      dac_tinh_kinh_te_noi_bat:g(m, "18. Các đặc tính kinh tế nổi bật"),
      tap_quan_xa_hoi:        g(m, "19. Tập quán xã hội liên quan"),
      gia_tri_kinh_te:        g(m, "20. Giá trị kinh tế"),
      gia_tri_bao_ton:        g(m, "21. Giá trị bảo tồn"),
      gia_tri_dac_huu:        g(m, "22. Giá trị đặc hữu"),
      gia_tri_moi_truong:     g(m, "23. Giá trị về môi trường"),
      gia_tri_dinh_duong:     g(m, "24. Giá trị dinh dưỡng, y, dược"),
      tiem_nang_phat_trien:   g(m, "25. Tiềm năng phát triển của nguồn gen"),
      cac_thong_tin_khac:     g(m, "26. Các thông tin khác"),
      ghi_chu:                g(m, "Ghi chú"),
      tai_lieu_tham_khao:     g(m, "Danh mục tài liệu tham khảo"),
    },
  };
}

// ─── Main export ──────────────────────────────────────────────
export async function importNguonGenExcel(file: File): Promise<ImportResult> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());

  // Locate sheets by name; fall back to index for old 4-sheet files that still include TTCB
  const ws1 = wb.getWorksheet("00.TTCB") ?? null;
  const ws2 = wb.getWorksheet("01.ĐTNG") ?? (ws1 ? wb.worksheets[1] : wb.worksheets[0]);
  const ws3 = wb.getWorksheet("02.ĐGBĐ") ?? (ws1 ? wb.worksheets[2] : wb.worksheets[1]);
  const ws4 = wb.getWorksheet("03.ĐTCT") ?? (ws1 ? wb.worksheets[3] : wb.worksheets[2]);

  let basic: Partial<NguonGen> = {};
  let form1: Partial<Form1Data> = {};

  if (ws1) {
    const r = parseForm1(ws1);
    basic = r.basic;
    form1 = r.form1;
  }

  const nhom      = basic.nhom      ?? "";
  const phan_nhom = basic.phan_nhom ?? "";

  const form2 = ws2 ? parseForm2(ws2, nhom, phan_nhom) : {};

  let form3: Partial<Form3Data> = {};
  if (ws3) {
    const r = parseForm3(ws3);
    if (r.ma && !basic.ma) basic.ma = r.ma;
    form3 = r.data;
  }

  let form4: Partial<Form4Data> = {};
  if (ws4) {
    const r = parseForm4(ws4);
    if (r.ma && !basic.ma) basic.ma = r.ma;
    form4 = r.data;
  }

  return { basic, form1, form2, form3, form4 };
}

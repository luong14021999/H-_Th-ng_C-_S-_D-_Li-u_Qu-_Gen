import ExcelJS from "exceljs";
import { Form2Data, Form3Data, Form4Data } from "@/data/extendedTypes";

export interface ImportResult {
  ma?: string;
  form2?: Partial<Form2Data>;
  form3?: Partial<Form3Data>;
  form4?: Partial<Form4Data>;
}

function cellStr(ws: ExcelJS.Worksheet, row: number, col: number): string {
  const v = ws.getCell(row, col).value;
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    if ("richText" in v) return (v as ExcelJS.CellRichTextValue).richText.map((r) => r.text).join("");
    if ("text" in v) return String((v as ExcelJS.CellHyperlinkValue).text);
    if ("result" in v) return String((v as ExcelJS.CellFormulaValue).result ?? "");
  }
  return String(v);
}

function parts(val: string, n: number): string[] {
  const arr = val.split(" / ");
  while (arr.length < n) arr.push("");
  return arr;
}

function parseForm2(ws: ExcelJS.Worksheet): Partial<Form2Data> {
  const g = (r: number) => cellStr(ws, r, 2);
  const viet = parts(g(6), 4);
  const khoa = parts(g(7), 4);
  const noi  = parts(g(10), 4);
  const toa  = parts(g(11), 2);
  return {
    ma_thu_thap: g(5),
    ten_viet_bo: viet[0], ten_viet_ho: viet[1], ten_viet_chi: viet[2], ten_viet_loai: viet[3],
    ten_khoa_bo: khoa[0], ten_khoa_ho: khoa[1], ten_khoa_chi: khoa[2], ten_khoa_loai: khoa[3],
    ten_khac_2: g(8), ngay_thu_thap: g(9),
    thon_ban: noi[0], xa_phuong: noi[1], huyen_thi_tp: noi[2], tinh: noi[3],
    toa_do_x: toa[0], toa_do_y: toa[1], do_cao: g(12),
    ten_nguon_goc: g(13), ten_nguoi_thu_thap: g(14), co_quan_dieu_tra: g(15),
    nguon_goc_mau: g(17), dang_mau: g(18), dang_mau_khac: g(19),
    ban_chat_truyen: g(20), muc_do_thuan: g(21), thoi_gian_ton_tai: g(22),
    muc_do_pho_bien: g(23), xu_huong_phat_trien: g(24),
    dia_hinh: g(26), loai_dat: g(27), loai_dat_khac: g(28), mau_dat: g(29), do_chua: g(30),
    vat_lieu_nhan_giong: g(31), vat_lieu_nhan_giong_khac: g(32), nguon_giong_ruong: g(33),
    phuong_thuc_canh_tac: g(34), phuong_phap_gieo_trong: g(35), thoi_vu_trong: g(36),
    thoi_gian_sinh_truong: g(37), phan_bon: g(38), phong_tru_sau_benh: g(39),
    phan_cay_su_dung: g(41), muc_dich_su_dung: g(42), thu_hoach: g(43),
    phuong_phap_bao_quan_sp: g(44), cach_che_bien: g(45), phuong_phap_de_giong: g(46),
    kinh_nghiem_chon_giong: g(47), dac_tinh_noi_bat: g(49),
  };
}

function parseForm3(ws: ExcelJS.Worksheet): { ma: string; data: Partial<Form3Data> } {
  const g = (r: number) => cellStr(ws, r, 2);
  return {
    ma: g(7),
    data: {
      ma_so_he_thong: g(5), ma_so_nhiem_vu: g(6),
      ten_giong: g(8), nguon_giong: g(9), noi_nhan_giong: g(10),
      nguoi_mo_ta: g(11), co_quan_mo_ta: g(12),
      dac_diem_chung: g(14),
      dang_cay: g(15), duong_kinh_than: g(16), chieu_cao_cay: g(17), mau_sac_than: g(18),
      duong_kinh_tan: g(19), kieu_gan_la: g(20), hinh_dang_la: g(21), mau_la: g(22),
      kieu_la: g(23), kieu_hoa: g(24), mau_sac_canh_hoa: g(25), hinh_dang_hoa: g(26),
      bau: g(27), mui_hoa: g(28), hinh_dang_qua: g(29), loai_qua: g(30),
      so_hat_tren_qua: g(31), dang_hat: g(32), be_mat_hat: g(33),
      anh_sang: g(35), dat_tho_nhuong: g(36), nhiet_do: g(37), do_am: g(38),
      hinh_thuc_sinh_truong: g(40), ti_le_nay_mam: g(41), dieu_kien_nay_mam: g(42),
      thoi_vu_gieo_trong: g(43), thoi_gian_khi_gieo_moc: g(44),
      thoi_gian_gieo_hoa: g(45), thoi_gian_gieo_qua: g(46),
      ghi_chu: g(48), tai_lieu_tham_khao: g(50),
    },
  };
}

function parseForm4(ws: ExcelJS.Worksheet): { ma: string; data: Partial<Form4Data> } {
  const g = (r: number) => cellStr(ws, r, 2);
  return {
    ma: g(7),
    data: {
      ma_so_he_thong: g(5), ma_so_nhiem_vu: g(6),
      ten_giong: g(8), nguon_giong: g(9), noi_nhan_giong: g(10),
      nguoi_mo_ta: g(11), co_quan_mo_ta: g(12),
      trinh_tu_dna: g(14), chieu_dai_dna: g(15), ti_le_atgc: g(16), chuoi_acid_amin: g(17),
      thong_tin_nang_suat: g(19), thong_tin_chat_luong: g(20), khang_sau_benh: g(21),
      chiu_sinh_thai_bat_thuon: g(22), dac_tinh_kinh_te_noi_bat: g(23), tap_quan_xa_hoi: g(24),
      gia_tri_kinh_te: g(26), gia_tri_bao_ton: g(27), gia_tri_dac_huu: g(28),
      gia_tri_moi_truong: g(29), gia_tri_dinh_duong: g(30),
      tiem_nang_phat_trien: g(31), cac_thong_tin_khac: g(32),
      ghi_chu: g(34), tai_lieu_tham_khao: g(36),
    },
  };
}

export async function importNguonGenExcel(file: File): Promise<ImportResult> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(await file.arrayBuffer());

  const result: ImportResult = {};
  const [ws2, ws3, ws4] = wb.worksheets;

  if (ws2) result.form2 = parseForm2(ws2);
  if (ws3) { const r = parseForm3(ws3); result.form3 = r.data; if (r.ma) result.ma = r.ma; }
  if (ws4) { const r = parseForm4(ws4); result.form4 = r.data; if (r.ma && !result.ma) result.ma = r.ma; }

  return result;
}

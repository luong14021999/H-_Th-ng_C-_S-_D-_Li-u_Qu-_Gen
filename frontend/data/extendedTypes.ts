export interface BaoTonEntry {
  phuong_thuc: string;
  hinh_thuc: string;
  don_vi: string;
  noi: string;
}

// Form 1 — Thông tin cơ bản (extended)
export interface Form1Data {
  ten_khac: string;
  ten_ho: string;
  ten_bo: string;
  nguon_giao: string;
  noi_thu_thap_tinh: string;
  noi_thu_thap_huyen: string;
  noi_thu_thap_xa: string;
  dia_chi_chi_tiet: string;
  mo_ta_thu_thap: string;
  noi_phan_bo: string;
  dang_bao_ton: boolean;
  bao_ton_list: BaoTonEntry[];
  dang_khai_thac: boolean;
  hinh_thuc_khai_thac: string;
  noi_khai_thac: string;
  don_vi_khai_thac: string;
}

// Form 2 — Dữ liệu điều tra, thu thập
export interface Form2Data {
  // I. Thông tin chung
  ma_thu_thap: string;
  ngay_thu_thap: string;
  mua_thu_thap: string;
  toa_do_x: string;
  toa_do_y: string;
  do_cao: string;
  ten_nguon_goc: string;
  ten_nguoi_thu_thap: string;
  co_quan_dieu_tra: string;
  // II. Thông tin mẫu thu thập
  nguon_goc_mau: string;
  dang_mau: string;
  ban_chat_truyen: string;
  muc_do_thuan: string;
  thoi_gian_ton_tai: string;
  muc_do_pho_bien: string;
  xu_huong_phat_trien: string;
  // III. Điều kiện sinh trưởng
  dia_hinh: string;
  loai_dat: string;
  mau_dat: string;
  do_chua: string;
  mau_la_manh: string;
  phuong_thuc_canh_tac: string;
  thu_hoach: string;
  thoi_gian_sinh_truong: string;
  phan_bon: string;
  phong_tru_sau_benh: string;
  // IV. Sử dụng, bảo quản, chế biến
  phan_cay_su_dung: string;
  muc_dich_su_dung: string;
  phuong_phap_bao_quan: string;
  phuong_phap_bao_quan_sp: string;
  cach_che_bien: string;
  phuong_phap_de_giong: string;
  // V. Đặc tính nổi bật
  dac_tinh_noi_bat: string;
}

// Form 3 — Dữ liệu đánh giá ban đầu
export interface Form3Data {
  // I. Thông tin chung
  ma_so_nhiem_vu: string;
  // A. DNA
  trinh_tu_dna: string;
  chieu_dai_dna: string;
  ti_le_atgc: string;
  chuoi_acid_amin: string;
  // B. Đặc điểm nông sinh học
  thong_tin_nang_suat: string;
  thong_tin_chat_luong: string;
  khang_sau_benh: string;
  chiu_sinh_thai_bat_thuong: string;
  dac_tinh_kinh_te_noi_bat: string;
  tap_quan_xa_hoi: string;
  // C. Đánh giá giá trị
  gia_tri_kinh_te: string;
  gia_tri_bao_ton: string;
  gia_tri_dac_huu: string;
  gia_tri_moi_truong: string;
  gia_tri_dinh_duong: string;
  tiem_nang_phat_trien: string;
  cac_thong_tin_khac: string;
  // Chung
  ghi_chu: string;
  tai_lieu_tham_khao: string;
}

// Form 4 — Dữ liệu đánh giá chi tiết
export interface Form4Data {
  // I. Thông tin chung
  ma_so_nhiem_vu: string;
  nguon_giong: string;
  noi_nhan_giong: string;
  nguoi_mo_ta: string;
  co_quan_mo_ta: string;
  // A. DNA
  trinh_tu_dna: string;
  chieu_dai_dna: string;
  ti_le_atgc: string;
  chuoi_acid_amin: string;
  // B. Đặc điểm nông sinh học chi tiết
  dang_hinh_thai: string;
  dang_kinh_than: string;
  chieu_cao_cay: string;
  khoang_cach_cay: string;
  mau_sac_than: string;
  duong_kinh_tan: string;
  kieu_can_la: string;
  hinh_dang_la: string;
  mau_la: string;
  mau_sac_canh_hoa: string;
  hinh_dang_hoa: string;
  dau_thoi_gian: string;
  mu_mau: string;
  hinh_dang_qua: string;
  loai_qua: string;
  so_hat_tren_qua: string;
  dang_qua_vat_ly: string;
  so_mu_hat: string;
  // Sinh thái
  anh_sang: string;
  gio_doi_chuong: string;
  nhiet_do: string;
  do_am: string;
  // Sinh trưởng phát triển
  hinh_thuc_sinh_truong: string;
  ti_le_nay_mam: string;
  dieu_kien_nay_mam: string;
  thoi_vu_gieo_trong: string;
  thoi_gian_khi_gieo_moc: string;
  thoi_gian_gieo_hoa: string;
  thoi_gian_gieo_qua: string;
  // Chung
  ghi_chu: string;
  tai_lieu_tham_khao: string;
}

export interface ExtendedFormData {
  form1: Partial<Form1Data>;
  form2: Partial<Form2Data>;
  form3: Partial<Form3Data>;
  form4: Partial<Form4Data>;
}

export const defaultForm1 = (): Form1Data => ({
  ten_khac: '', ten_ho: '', ten_bo: '', nguon_giao: '',
  noi_thu_thap_tinh: '', noi_thu_thap_huyen: '', noi_thu_thap_xa: '',
  dia_chi_chi_tiet: '', mo_ta_thu_thap: '', noi_phan_bo: '',
  dang_bao_ton: false, bao_ton_list: [{ phuong_thuc: '', hinh_thuc: '', don_vi: '', noi: '' }],
  dang_khai_thac: false, hinh_thuc_khai_thac: '', noi_khai_thac: '', don_vi_khai_thac: '',
});

export const defaultForm2 = (): Form2Data => ({
  ma_thu_thap: '', ngay_thu_thap: '', mua_thu_thap: '', toa_do_x: '', toa_do_y: '',
  do_cao: '', ten_nguon_goc: '', ten_nguoi_thu_thap: '', co_quan_dieu_tra: '',
  nguon_goc_mau: '', dang_mau: '', ban_chat_truyen: '', muc_do_thuan: '',
  thoi_gian_ton_tai: '', muc_do_pho_bien: '', xu_huong_phat_trien: '',
  dia_hinh: '', loai_dat: '', mau_dat: '', do_chua: '', mau_la_manh: '',
  phuong_thuc_canh_tac: '', thu_hoach: '', thoi_gian_sinh_truong: '', phan_bon: '', phong_tru_sau_benh: '',
  phan_cay_su_dung: '', muc_dich_su_dung: '', phuong_phap_bao_quan: '',
  phuong_phap_bao_quan_sp: '', cach_che_bien: '', phuong_phap_de_giong: '',
  dac_tinh_noi_bat: '',
});

export const defaultForm3 = (): Form3Data => ({
  ma_so_nhiem_vu: '', trinh_tu_dna: '', chieu_dai_dna: '', ti_le_atgc: '', chuoi_acid_amin: '',
  thong_tin_nang_suat: '', thong_tin_chat_luong: '', khang_sau_benh: '',
  chiu_sinh_thai_bat_thuong: '', dac_tinh_kinh_te_noi_bat: '', tap_quan_xa_hoi: '',
  gia_tri_kinh_te: '', gia_tri_bao_ton: '', gia_tri_dac_huu: '', gia_tri_moi_truong: '',
  gia_tri_dinh_duong: '', tiem_nang_phat_trien: '', cac_thong_tin_khac: '',
  ghi_chu: '', tai_lieu_tham_khao: '',
});

export const defaultForm4 = (): Form4Data => ({
  ma_so_nhiem_vu: '', nguon_giong: '', noi_nhan_giong: '', nguoi_mo_ta: '', co_quan_mo_ta: '',
  trinh_tu_dna: '', chieu_dai_dna: '', ti_le_atgc: '', chuoi_acid_amin: '',
  dang_hinh_thai: '', dang_kinh_than: '', chieu_cao_cay: '', khoang_cach_cay: '',
  mau_sac_than: '', duong_kinh_tan: '', kieu_can_la: '', hinh_dang_la: '', mau_la: '',
  mau_sac_canh_hoa: '', hinh_dang_hoa: '', dau_thoi_gian: '', mu_mau: '',
  hinh_dang_qua: '', loai_qua: '', so_hat_tren_qua: '', dang_qua_vat_ly: '', so_mu_hat: '',
  anh_sang: '', gio_doi_chuong: '', nhiet_do: '', do_am: '',
  hinh_thuc_sinh_truong: '', ti_le_nay_mam: '', dieu_kien_nay_mam: '',
  thoi_vu_gieo_trong: '', thoi_gian_khi_gieo_moc: '', thoi_gian_gieo_hoa: '', thoi_gian_gieo_qua: '',
  ghi_chu: '', tai_lieu_tham_khao: '',
});

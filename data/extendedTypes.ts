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
  hinh_anh: string[];
}

// Form 2 — Dữ liệu điều tra, thu thập
export interface Form2Data {
  // I. Thông tin chung
  ma_thu_thap: string;
  // 2. Tên nguồn gen — Tên Việt Nam
  ten_viet_bo: string;
  ten_viet_ho: string;
  ten_viet_chi: string;
  ten_viet_loai: string;
  // 2. Tên nguồn gen — Tên khoa học
  ten_khoa_bo: string;
  ten_khoa_ho: string;
  ten_khoa_chi: string;
  ten_khoa_loai: string;
  // 2. Tên khác
  ten_khac_2: string;
  // 3–4
  ngay_thu_thap: string;
  thon_ban: string;
  xa_phuong: string;
  huyen_thi_tp: string;
  tinh: string;
  toa_do_x: string;
  toa_do_y: string;
  do_cao: string;
  // 5–7
  ten_nguon_goc: string;
  ten_nguoi_thu_thap: string;
  co_quan_dieu_tra: string;
  // II. Thông tin mẫu thu thập
  nguon_goc_mau: string;
  dang_mau: string;
  dang_mau_khac: string;
  ban_chat_truyen: string;
  muc_do_thuan: string;
  thoi_gian_ton_tai: string;
  muc_do_pho_bien: string;
  xu_huong_phat_trien: string;
  // III. Điều kiện sinh trưởng
  dia_hinh: string;
  loai_dat: string;
  loai_dat_khac: string;
  mau_dat: string;
  do_chua: string;
  vat_lieu_nhan_giong: string;
  vat_lieu_nhan_giong_khac: string;
  nguon_giong_ruong: string;
  phuong_thuc_canh_tac: string;
  phuong_phap_gieo_trong: string;
  thoi_vu_trong: string;
  thoi_gian_sinh_truong: string;
  phan_bon: string;
  phong_tru_sau_benh: string;
  // IV. Sử dụng, bảo quản, chế biến
  phan_cay_su_dung: string;
  muc_dich_su_dung: string;
  thu_hoach: string;
  phuong_phap_bao_quan_sp: string;
  cach_che_bien: string;
  phuong_phap_de_giong: string;
  kinh_nghiem_chon_giong: string;
  // V. Đặc tính nổi bật
  dac_tinh_noi_bat: string;
}

// Form 3 — Dữ liệu đánh giá ban đầu
export interface Form3Data {
  // I. Thông tin chung (fields 1–8)
  ma_so_he_thong: string;
  ma_so_nhiem_vu: string;
  // ma_nguon_gen comes from `ma` prop
  ten_giong: string;
  nguon_giong: string;
  noi_nhan_giong: string;
  nguoi_mo_ta: string;
  co_quan_mo_ta: string;
  // II.A Hình thái — Đặc điểm chung
  dac_diem_chung: string;           // field 9
  // II.A Hình thái — Dữ liệu hình thái
  dang_cay: string;                 // field 10
  duong_kinh_than: string;          // field 11
  chieu_cao_cay: string;            // field 12
  mau_sac_than: string;             // field 13
  duong_kinh_tan: string;           // field 14
  kieu_gan_la: string;              // field 15
  hinh_dang_la: string;             // field 16
  mau_la: string;                   // field 17
  kieu_la: string;                  // field 18
  kieu_hoa: string;                 // field 19
  mau_sac_canh_hoa: string;         // field 20
  hinh_dang_hoa: string;            // field 21
  bau: string;                      // field 22
  mui_hoa: string;                  // field 23
  hinh_dang_qua: string;            // field 24
  loai_qua: string;                 // field 25
  so_hat_tren_qua: string;          // field 26
  dang_hat: string;                 // field 27
  be_mat_hat: string;               // field 28
  // II.B Sinh học, sinh thái
  anh_sang: string;                 // field 29
  dat_tho_nhuong: string;           // field 30
  nhiet_do: string;                 // field 31
  do_am: string;                    // field 32
  // II.C Sinh trưởng, phát triển
  hinh_thuc_sinh_truong: string;    // field 33
  ti_le_nay_mam: string;            // field 34
  dieu_kien_nay_mam: string;        // field 35
  thoi_vu_gieo_trong: string;       // field 36
  thoi_gian_khi_gieo_moc: string;   // field 37
  thoi_gian_gieo_hoa: string;       // field 38
  thoi_gian_gieo_qua: string;       // field 39
  // III & IV
  ghi_chu: string;
  tai_lieu_tham_khao: string;
}

// Form 4 — Dữ liệu đánh giá chi tiết
export interface Form4Data {
  // I. Thông tin chung (fields 1–8)
  ma_so_he_thong: string;
  ma_so_nhiem_vu: string;
  // ma_nguon_gen from prop
  ten_giong: string;
  nguon_giong: string;
  noi_nhan_giong: string;
  nguoi_mo_ta: string;
  co_quan_mo_ta: string;
  // II.A Thông tin DNA (fields 9–12)
  trinh_tu_dna: string;
  chieu_dai_dna: string;
  ti_le_atgc: string;
  chuoi_acid_amin: string;
  // II.B Đặc điểm nông sinh học (fields 14–19)
  thong_tin_nang_suat: string;
  thong_tin_chat_luong: string;
  khang_sau_benh: string;
  chiu_sinh_thai_bat_thuon: string;
  dac_tinh_kinh_te_noi_bat: string;
  tap_quan_xa_hoi: string;
  // II.C Đánh giá giá trị (fields 20–26)
  gia_tri_kinh_te: string;
  gia_tri_bao_ton: string;
  gia_tri_dac_huu: string;
  gia_tri_moi_truong: string;
  gia_tri_dinh_duong: string;
  tiem_nang_phat_trien: string;
  cac_thong_tin_khac: string;
  // III & IV
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
  hinh_anh: [],
});

export const defaultForm2 = (): Form2Data => ({
  ma_thu_thap: '',
  ten_viet_bo: '', ten_viet_ho: '', ten_viet_chi: '', ten_viet_loai: '',
  ten_khoa_bo: '', ten_khoa_ho: '', ten_khoa_chi: '', ten_khoa_loai: '',
  ten_khac_2: '',
  ngay_thu_thap: '', thon_ban: '', xa_phuong: '', huyen_thi_tp: '', tinh: '',
  toa_do_x: '', toa_do_y: '', do_cao: '',
  ten_nguon_goc: '', ten_nguoi_thu_thap: '', co_quan_dieu_tra: '',
  nguon_goc_mau: '', dang_mau: '', dang_mau_khac: '', ban_chat_truyen: '', muc_do_thuan: '',
  thoi_gian_ton_tai: '', muc_do_pho_bien: '', xu_huong_phat_trien: '',
  dia_hinh: '', loai_dat: '', loai_dat_khac: '', mau_dat: '', do_chua: '',
  vat_lieu_nhan_giong: '', vat_lieu_nhan_giong_khac: '', nguon_giong_ruong: '',
  phuong_thuc_canh_tac: '', phuong_phap_gieo_trong: '', thoi_vu_trong: '',
  thoi_gian_sinh_truong: '', phan_bon: '', phong_tru_sau_benh: '',
  phan_cay_su_dung: '', muc_dich_su_dung: '', thu_hoach: '',
  phuong_phap_bao_quan_sp: '', cach_che_bien: '', phuong_phap_de_giong: '',
  kinh_nghiem_chon_giong: '', dac_tinh_noi_bat: '',
});

export const defaultForm3 = (): Form3Data => ({
  ma_so_he_thong: '', ma_so_nhiem_vu: '', ten_giong: '',
  nguon_giong: '', noi_nhan_giong: '', nguoi_mo_ta: '', co_quan_mo_ta: '',
  dac_diem_chung: '',
  dang_cay: '', duong_kinh_than: '', chieu_cao_cay: '', mau_sac_than: '', duong_kinh_tan: '',
  kieu_gan_la: '', hinh_dang_la: '', mau_la: '', kieu_la: '',
  kieu_hoa: '', mau_sac_canh_hoa: '', hinh_dang_hoa: '', bau: '', mui_hoa: '',
  hinh_dang_qua: '', loai_qua: '', so_hat_tren_qua: '', dang_hat: '', be_mat_hat: '',
  anh_sang: '', dat_tho_nhuong: '', nhiet_do: '', do_am: '',
  hinh_thuc_sinh_truong: '', ti_le_nay_mam: '', dieu_kien_nay_mam: '',
  thoi_vu_gieo_trong: '', thoi_gian_khi_gieo_moc: '', thoi_gian_gieo_hoa: '', thoi_gian_gieo_qua: '',
  ghi_chu: '', tai_lieu_tham_khao: '',
});

export const defaultForm4 = (): Form4Data => ({
  ma_so_he_thong: '', ma_so_nhiem_vu: '', ten_giong: '',
  nguon_giong: '', noi_nhan_giong: '', nguoi_mo_ta: '', co_quan_mo_ta: '',
  trinh_tu_dna: '', chieu_dai_dna: '', ti_le_atgc: '', chuoi_acid_amin: '',
  thong_tin_nang_suat: '', thong_tin_chat_luong: '', khang_sau_benh: '',
  chiu_sinh_thai_bat_thuon: '', dac_tinh_kinh_te_noi_bat: '', tap_quan_xa_hoi: '',
  gia_tri_kinh_te: '', gia_tri_bao_ton: '', gia_tri_dac_huu: '', gia_tri_moi_truong: '',
  gia_tri_dinh_duong: '', tiem_nang_phat_trien: '', cac_thong_tin_khac: '',
  ghi_chu: '', tai_lieu_tham_khao: '',
});

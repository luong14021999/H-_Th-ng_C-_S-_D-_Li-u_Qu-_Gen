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
  ten_viet_bo: string;
  ten_viet_ho: string;
  ten_viet_chi: string;
  ten_viet_loai: string;
  ten_khoa_bo: string;
  ten_khoa_ho: string;
  ten_khoa_chi: string;
  ten_khoa_loai: string;
  ten_khac_2: string;
  ngay_thu_thap: string;
  thon_ban: string;
  xa_phuong: string;
  huyen_thi_tp: string;
  tinh: string;
  toa_do_x: string;
  toa_do_y: string;
  do_cao: string;
  ten_nguon_goc: string;
  ten_nguoi_thu_thap: string;
  co_quan_dieu_tra: string;
  // II. Thông tin mẫu thu thập
  nguon_goc_mau: string;
  dang_mau: string;
  dang_mau_khac: string;
  ban_chat_truyen: string;
  ban_chat_truyen_khac: string;
  muc_do_thuan: string;
  thoi_gian_ton_tai: string;
  muc_do_pho_bien: string;
  xu_huong_phat_trien: string;
  // III. Điều kiện sinh trưởng — TT / LN / DL (thực vật)
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
  // III. DL (Dược liệu) specific
  dl_loai_hinh_nuoi_trong: string;
  dl_ky_thuat_nuoi_trong: string;
  dl_thoi_vu_thu_hoach: string;
  // III. CN (Vật nuôi) specific
  cn_nguon_goc_giong: string;
  cn_hinh_thuc_chan_nuoi: string;
  cn_thuc_an: string;
  cn_phuong_thuc_nuoi: string;
  cn_phong_dich: string;
  // III. TS (Thủy sản) specific
  ts_nguon_goc_giong: string;
  ts_loai_hinh_nuoi: string;
  ts_loai_hinh_nuoi_khac: string;
  ts_thuc_an: string;
  ts_phuong_thuc_nuoi: string;
  ts_phuong_thuc_nuoi_khac: string;
  ts_nguon_giong_khac: string;
  ts_nguon_nuoc: string;        // backward compat
  ts_mat_do_nuoi: string;       // backward compat
  // III. VS (Vi sinh vật/Nấm) specific
  vs_moi_truong_nuoi_cay: string;
  vs_nhiet_do_sinh_truong: string;
  vs_do_am_sinh_truong: string;
  vs_ph: string;
  vs_thoi_gian_sinh_truong: string;
  vs_muc_dich_khac: string;
  vs_bo_phan_khac: string;
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
  // VI. Tài liệu tham khảo (Cây ngô)
  tai_lieu_tham_khao: string;
}

// Form 3 — Dữ liệu đánh giá ban đầu
export interface Form3Data {
  // I. Thông tin chung
  ma_so_he_thong: string;
  ma_so_nhiem_vu: string;
  ten_giong: string;
  nguon_giong: string;
  noi_nhan_giong: string;
  nguoi_mo_ta: string;
  co_quan_mo_ta: string;
  // II.A — Đặc điểm chung (field 9, mọi loài)
  dac_diem_chung: string;

  // DL (Dược liệu) morphology — fields 10–28 (giữ tên gốc để tương thích dữ liệu cũ)
  dang_cay: string;
  duong_kinh_than: string;
  chieu_cao_cay: string;
  mau_sac_than: string;
  duong_kinh_tan: string;
  kieu_gan_la: string;
  hinh_dang_la: string;
  mau_la: string;
  kieu_la: string;
  kieu_hoa: string;
  mau_sac_canh_hoa: string;
  hinh_dang_hoa: string;
  bau: string;
  mui_hoa: string;
  hinh_dang_qua: string;
  loai_qua: string;
  so_hat_tren_qua: string;
  dang_hat: string;
  be_mat_hat: string;

  // TT (Nông nghiệp/Lúa) morphology — Bảng 02, fields 10–48
  tt_chieu_cao_ma: string;           // 10. Chiều cao mạ
  tt_chieu_dai_la: string;           // 11. Chiều dài lá
  tt_chieu_rong_la: string;          // 12. Chiều rộng lá
  tt_do_phu_long_la: string;         // 13. Độ phủ lông của lá
  tt_mau_phien_la: string;           // 14. Màu phiến lá
  tt_mau_be_la: string;              // 15. Màu bẹ lá
  tt_goc_la: string;                 // 16. Góc lá
  tt_goc_la_dong: string;            // 17. Góc lá đòng
  tt_dai_thia_lia: string;           // 18. Dài thìa lìa
  tt_mau_thia_lia: string;           // 19. Màu thìa lìa
  tt_dang_thia_lia: string;          // 20. Dạng thìa lìa
  tt_mau_co_la: string;              // 21. Màu cổ lá
  tt_mau_tai_la: string;             // 22. Màu tai lá
  tt_chieu_dai_than: string;         // 23. Chiều dài thân
  tt_so_ranh: string;                // 24. Số rãnh
  tt_goc_than: string;               // 25. Góc thân
  tt_duong_kinh_ong_da: string;      // 26. Đường kính ống dạ
  tt_mau_sac_ong_da: string;         // 27. Màu sắc ống dạ
  tt_do_cung_cay: string;            // 28. Độ cứng cây
  tt_dai_bong: string;               // 29. Dài bông
  tt_dang_bong: string;              // 30. Dạng bông
  tt_phan_nhanh_thu_cap: string;     // 31. Phân nhánh thứ cấp trên bông
  tt_do_thoat_co_bong: string;       // 32. Độ thoát cổ bông
  tt_truc_bong: string;              // 33. Trục bông
  tt_do_tan_la: string;              // 34. Độ tàn lá
  tt_do_rung_hat: string;            // 35. Độ rụng hạt
  tt_do_dai_hat_tut: string;         // 36. Độ dai của hạt khi tút
  tt_rau: string;                    // 37. Râu
  tt_mau_rau: string;                // 38. Màu râu
  tt_mau_mo_hat: string;             // 39. Màu mỏ hạt
  tt_mau_vo_trau: string;            // 40. Màu vỏ trấu
  tt_do_phu_long_vo_trau: string;    // 41. Độ phủ lông vỏ trấu
  tt_mau_may_hat: string;            // 42. Màu mày hạt
  tt_chieu_dai_may_hat: string;      // 43. Chiều dài mày hạt
  tt_do_thu_phan_bong: string;       // 44. Độ thụ phấn của bông
  tt_trong_luong_1000_hat: string;   // 45. Trọng lượng 1000 hạt
  tt_chieu_dai_hat: string;          // 46. Chiều dài hạt (mm)
  tt_chieu_rong_hat: string;         // 47. Chiều rộng hạt (mm)
  tt_mau_vo_gao: string;             // 48. Màu vỏ gạo
  // TT growth/development — fields 59–60
  tt_thoi_gian_tro_bong: string;     // 59. Thời gian từ trồng đến trổ bông
  tt_thoi_gian_sinh_truong_ngay: string; // 60. Thời gian từ trồng đến chín

  // LN (Lâm nghiệp) morphology — Bảng 05, fields 10–54
  ln_dang_cay: string;              // 10. Dạng cây
  ln_chieu_cao_hvn: string;         // 11. Chiều cao vút ngọn Hvn (m)
  ln_chieu_cao_hdc: string;         // 11. Chiều cao dưới cành Hdc (m)
  ln_duong_kinh_d13: string;        // 12. Đường kính ngang ngực D1.3 (cm)
  ln_dac_diem_goc: string;          // 13. Đặc điểm gốc cây
  ln_sac_to_canh_non: string;       // 14. Sắc tố cành non
  ln_long_canh_non: string;         // 15. Lông ở cành non
  ln_goc_phan_canh: string;         // 16. Góc phân cành
  ln_hinh_thai_tan: string;         // 17. Hình thái tán cây
  ln_duong_kinh_tan: string;        // 18. Đường kính tán Dt (m)
  ln_hinh_dang_la: string;          // 19. Hình dạng lá
  ln_kieu_la: string;               // 20. Kiểu lá
  ln_cuong_la: string;              // 21. Cuống lá
  ln_kich_thuoc_la: string;         // 22. Kích thước lá (Dài cm)
  ln_kich_thuoc_la_rong: string;    // 22. Kích thước lá (Rộng cm)
  ln_gan_la: string;                // 23. Gân lá
  ln_mau_la: string;                // 24. Màu lá
  ln_mau_la_non: string;            // 25. Màu lá non
  ln_mep_la: string;                // 26. Mép lá
  ln_dau_la: string;                // 27. Đầu lá
  ln_duoi_la: string;               // 28. Đuôi lá
  ln_sap_xep_la: string;            // 29. Sắp xếp lá
  ln_kieu_hoa: string;              // 30. Kiểu hoa
  ln_kieu_dinh_hoa: string;         // 31. Kiểu đính hoa
  ln_kich_thuoc_hoa: string;        // 32. Kích thước hoa (đường kính mm)
  ln_hinh_dang_hoa: string;         // 33. Hình dạng hoa
  ln_de_hoa: string;                // 34. Đế hoa
  ln_dai_hoa: string;               // 35. Đài hoa
  ln_trang_hoa: string;             // 36. Tràng hoa
  ln_mau_sac_trang_hoa: string;     // 37. Màu sắc tràng hoa
  ln_nhi_hoa: string;               // 38. Nhị hoa
  ln_bao_phan: string;              // 39. Bao phấn
  ln_nhuy_hoa: string;              // 40. Nhụy hoa
  ln_mui_hoa: string;               // 41. Mùi hoa
  ln_huong_moc_hoa: string;         // 42. Hướng mọc của hoa
  ln_kieu_qua: string;              // 43. Kiểu quả
  ln_loai_qua: string;              // 44. Loại quả
  ln_hinh_dang_qua: string;         // 45. Hình dạng quả
  ln_kich_thuoc_qua: string;        // 46. Kích thước quả (Dài cm)
  ln_kich_thuoc_qua_rong: string;   // 46. Kích thước quả (Rộng hoặc đường kính cm)
  ln_mau_vo_qua: string;            // 47. Màu sắc vỏ quả
  ln_so_hat_qua: string;            // 48. Số hạt trên quả (TB)
  ln_dang_hat: string;              // 49. Dạng hạt
  ln_be_mat_hat: string;            // 50. Bề mặt hạt
  ln_mau_hat: string;               // 51. Màu hạt
  ln_kich_thuoc_hat: string;        // 52. Kích thước hạt (Dài mm)
  ln_kich_thuoc_hat_rong: string;   // 52. Kích thước hạt (Rộng cm)
  ln_trong_luong_1000_hat: string;  // 53. Trọng lượng 1000 hạt (Kg)
  ln_cau_tao_cay_mam: string;       // 54. Cấu tạo cây mầm
  // LN growth/development
  ln_thoi_gian_ra_hoa: string;      // 63. Thời gian từ trồng đến ra hoa, kết quả (năm)
  ln_thoi_gian_thu_hoach: string;   // 64. Thời gian từ trồng đến thu hoạch (năm)

  // TT — Cây ăn quả (phan_nhom = 'Cây ăn quả') extra fields
  caq_chieu_cao_phan_canh: string;  // 15. Chiều cao phân cành
  caq_thoi_gian_ra_hoa: string;     // 59. Thời gian từ trồng đến ra hoa (ngày)
  caq_thoi_gian_dau_qua: string;    // 60. Thời gian từ trồng đến đậu quả (ngày)
  caq_thoi_gian_thu_hoach: string;  // 61/40. Thời gian từ ra hoa đến thu hoạch (ngày)

  // TT — Cây chè (phan_nhom = 'Cây chè') extra fields
  che_thoi_gian_ra_hoa: string;     // 38. Thời gian từ trồng để ra hoa (năm/tháng)
  che_thoi_gian_dau_qua: string;    // 39. Thời gian từ trồng đến đậu quả (năm/tháng)

  // TT — Cây cói (phan_nhom = 'Cây cói') extra fields
  coi_chieu_cao_dong_bap: string;   // 11. Chiều cao đóng bắp (cm, n=5)
  coi_so_la: string;                // 12. Số lá/cây (n=5)
  coi_mau_gan_la: string;           // 14. Màu gân lá
  coi_so_ngay_ra_hoa: string;       // 15. Số ngày từ mọc đến 50% cây ra hoa
  coi_phan_ung_anh_sang: string;    // 16. Phản ứng ánh sáng
  coi_so_hoa: string;               // 17. Số hoa trên thân chính cây
  coi_su_no_hoa: string;            // 18. Sự nở hoa đồng thời
  coi_do_tro_thoat: string;         // 19. Độ trỗ thoát
  coi_kha_nang_chong_do: string;    // 20. Khả năng chống đổ
  coi_do_tan_la_dai: string;        // 21. Độ tàn lá — Dài(cm)
  coi_do_tan_la_rong: string;       // 21. Độ tàn lá — Rộng
  coi_thoi_vu_thu_hoach: string;    // 40. Thời vụ thu hoạch

  // TT — Cây lấy củ (phan_nhom = 'Cây lấy củ') extra fields
  lcu_hinh_thanh_dai_bo: string;    // 10. Hình thành dài bò
  lcu_so_luong_dai_bo: string;      // 11. Số lượng dài bò
  lcu_hinh_thanh_cu_nhanh: string;  // 12. Hình thành củ nhánh
  lcu_so_luong_choi_ben: string;    // 13. Số lượng chồi bên
  lcu_dang_la: string;              // 15. Dạng lá phổ biến
  lcu_huong_phien_la: string;       // 16. Hướng phiến lá
  lcu_mep_la: string;               // 17. Mép lá
  lcu_dai_phien_la: string;         // 18. Dài phiến lá
  lcu_rong_phien_la: string;        // 19. Rộng phiến lá
  lcu_dai_cuong_la: string;         // 20. Dài cuống lá
  lcu_mau_vien_mep_la: string;      // 21. Màu đường viền mép lá
  lcu_mau_phien_la: string;         // 22. Màu phiến lá
  lcu_dom_la: string;               // 23. Đốm lá
  lcu_do_day_phien_la: string;      // 24. Độ dày phiến lá
  lcu_mau_ron_la: string;           // 25. Màu rốn lá
  lcu_so_gan_thu_cap: string;       // 26. Số gân thứ cấp nối với gân chính
  lcu_goc_chu_v: string;            // 27. Góc chữ V, đo 10cm từ gân chính
  lcu_vi_tri_vien_mep: string;      // 28. Vị trí đường viền mép lá
  lcu_mau_gan_mat_tren: string;     // 29. Màu sắc gân mặt trên
  lcu_mau_gan_mat_duoi: string;     // 30. Màu sắc gân mặt dưới
  lcu_gan_chinh_phu: string;        // 31. Gân chính và gân phụ
  lcu_do_sau_gian_thuy: string;     // 32. Độ sâu của gian thùy
  lcu_diem_noi_gan_day: string;     // 33. Điểm nối từ gân chính đến đáy thùy lá
  lcu_hinh_dang_goc_thuy: string;   // 34. Hình dạng gốc thùy
  lcu_mau_doc_la: string;           // 35. Màu dọc lá
  lcu_bien_doi_mau: string;         // 36. Sự biến đổi màu trên dọc lá
  lcu_phan_cuong_la: string;        // 37. Phấn trên cuống lá
  lcu_dai_be_cuong_la: string;      // 38. Dài bẹ cuống lá
  lcu_mau_mep_be_la: string;        // 39. Màu mép bẹ lá
  lcu_hinh_dang_be: string;         // 40. Hình dạng bẹ ở vị trí cắt ngang
  lcu_dang_cu_cai: string;          // 41. Dạng củ cái
  lcu_dai_cu_cai: string;           // 42. Dài củ cái
  lcu_rong_cu_cai: string;          // 43. Rộng củ cái
  lcu_khoi_luong_cu_cai: string;    // 44. Khối lượng củ cái
  lcu_mau_thit_cu_cai: string;      // 45. Màu thịt củ cái
  lcu_mau_xo_cu_cai: string;        // 46. Màu xơ củ cái
  lcu_so_cu_con: string;            // 47. Số củ con
  lcu_khoi_luong_cu_con: string;    // 48. Khối lượng củ con
  lcu_sap_xep_cu: string;           // 49. Sự sắp xếp củ
  lcu_hinh_dang_cu_con: string;     // 50. Hình dạng củ con
  lcu_dai_cu_con: string;           // 51. Dài củ con
  lcu_rong_cu_con: string;          // 52. Rộng củ con
  lcu_mau_thit_cu_con: string;      // 53. Màu thịt củ con
  lcu_mau_xo_cu_con: string;        // 54. Màu xơ củ con

  // TN (Tre nứa) morphology — Bảng 06, fields 10–31
  tn_than_ngam: string;          // 10. Thân ngầm
  tn_chieu_cao_than: string;     // 11. Chiều cao thân khí sinh (TB) (m)
  tn_duong_kinh_than: string;    // 11. Đường kính thân khí sinh (TB) (cm)
  tn_chieu_dai_long: string;     // 12. Chiều dài lóng (TB) (cm)
  tn_chieu_dai_la: string;       // 13. Chiều dài lá (TB) (cm)
  tn_chieu_rong_la: string;      // 14. Chiều rộng lá (TB) (cm)
  tn_do_phu_long_la: string;     // 15. Độ phủ lông của lá
  tn_mau_phien_la: string;       // 16. Màu phiến lá
  tn_mau_goc_be_la: string;      // 17. Màu góc bẹ lá
  tn_goc_la: string;             // 18. Góc lá
  tn_mau_co_la: string;          // 19. Màu cổ lá
  tn_mau_tai_la: string;         // 20. Màu tai lá
  tn_hinh_dang_mo_than: string;  // 21. Hình dạng mo thân
  tn_mau_sac_mo_than: string;    // 22. Màu sắc mo thân
  tn_mau_long_mo: string;        // 23. Màu lông mo
  tn_tai_mo: string;             // 24. Tai mo (có/không)
  tn_la_mo: string;              // 25. Lá mo
  tn_dang_bong: string;          // 26. Dạng bông/khuy
  tn_phan_nhanh: string;         // 27. Phân nhánh thứ cấp trên bông
  tn_mau_hat: string;            // 28. Màu hạt

  // CN (Vật nuôi) morphology — Bảng 11, fields 10–22
  cn_hinh_thai_long: string;       // 10. Hình thái lông
  cn_phan_bo_long: string;         // 11. Phân bố lông
  cn_mao: string;                  // 12. Mào
  cn_kieu_bo_long: string;         // 13. Kiểu bộ lông
  cn_mau_bo_long: string;          // 14. Màu bộ lông
  cn_mau_da: string;               // 15. Màu da
  cn_mau_dai_tai: string;          // 16. Màu dái tai
  cn_kieu_mao: string;             // 17. Kiểu mào
  cn_do_lon_mao: string;           // 18. Độ lớn của mào
  cn_mau_mat: string;              // 19. Màu mắt
  cn_cac_dang_bo_xuong: string;    // 20. Các dạng bộ xương
  cn_cac_chieu_do: string;         // 21. Các chiều đo (8 chiều đo)
  cn_dac_diem_khac: string;        // 22. Các đặc điểm khác
  // CN kept for backward compat
  cn_dac_diem_ngoai_hinh: string;
  cn_chieu_dai_than: string;
  cn_chieu_cao_vai: string;
  cn_vong_nguc: string;
  cn_trong_luong_truong_thanh: string;
  cn_san_xuat_trung: string;
  cn_san_xuat_sua: string;
  cn_kieu_sinh_san: string;
  cn_tuoi_thanh_thuc: string;
  cn_thoi_gian_mang_thai: string;
  cn_so_lua_nam: string;
  cn_so_con_lua: string;

  // TS (Thủy sản) morphology — Bảng 14, fields 10–21
  ts_chieu_dai_toan_than: string;   // 10 left
  ts_chieu_cao_dau: string;         // 10 right
  ts_chieu_dai_kinh_te: string;     // 11 left
  ts_chieu_rong_dau: string;        // 11 right
  ts_dai_truoc_vay_lung: string;    // 12 left
  ts_chieu_cao_than: string;        // 12 right
  ts_dai_truoc_vay_nguc: string;    // 13 left
  ts_chieu_day_than: string;        // 13 right
  ts_dai_truoc_vay_bung: string;    // 14 left
  ts_so_tia_vay_lung: string;       // 14 right
  ts_dai_truoc_vay_hau_mon: string; // 15 left
  ts_so_tia_vay_nguc: string;       // 15 right
  ts_chieu_dai_dau: string;         // 16 left
  ts_so_tia_vay_bung: string;       // 16 right
  ts_chieu_dai_mom: string;         // 17 left
  ts_so_tia_vay_hau_mon: string;    // 17 right
  ts_duong_kinh_mat: string;        // 18 left
  ts_so_tia_vay_duoi: string;       // 18 right
  ts_khoang_cach_hai_mat: string;   // 19 left
  ts_so_vay_duong_ben: string;      // 19 right
  ts_trong_luong_truong_thanh: string; // 20
  ts_co_quan_sinh_san: string;      // 21
  // TS biology — fields 22–24
  ts_moi_truong_song: string;
  ts_dac_diem_dinh_duong: string;
  ts_dac_diem_sinh_san: string;
  // TS growth — fields 26–28
  ts_thoi_gian_sinh_truong_ts: string;
  ts_cac_giai_doan_sinh_truong: string;
  ts_thoi_gian_thanh_thuc_sinh_duc: string;
  // backward compat
  ts_mau_sac_co_the: string;
  ts_mua_vu_sinh_san: string;
  ts_tuoi_thanh_thuc: string;
  ts_so_lan_sinh_san: string;

  // TS Ốc morphology — fields 10–14
  oc_chieu_dai_vo: string;
  oc_chieu_rong_vo: string;
  oc_chieu_day_vo: string;
  oc_co_quan_sinh_duc: string;
  oc_mau_sac: string;

  // TS Giáp xác morphology — fields 10–26
  gx_hinh_dang_chuy: string;
  gx_so_gai_chuy: string;
  gx_cac_loai_gai: string;
  gx_cac_loai_go: string;
  gx_cac_loai_ranh: string;
  gx_so_dot_bung: string;
  gx_rau_1: string;
  gx_rau_2: string;
  gx_ham_tren: string;
  gx_ham_duoi_1: string;
  gx_ham_duoi_2: string;
  gx_chan_ham_1: string;
  gx_chan_ham_2: string;
  gx_chan_ham_3: string;
  gx_chan_boi_1: string;
  gx_chan_boi_2: string;
  gx_chan_boi_3_5: string;
  gx_chan_duoi: string;
  gx_mang_ben: string;
  gx_mang_khop: string;
  gx_mang_nhanh: string;
  gx_mang_chan: string;
  gx_phan_phu_sinh_duc_duc: string;
  gx_phan_phu_sinh_duc_cai: string;
  gx_mau_sac: string;

  // VS (Vi sinh vật/Nấm) morphology — Bảng 17, fields 10–13
  vs_kich_thuoc_than: string;    // 10. Kích thước thân
  vs_kich_thuoc_re: string;      // 10. Kích thước rễ
  vs_kich_thuoc_mu_dam: string;  // 10. Kích thước mũ/đảm
  vs_mau_sac: string;            // 11. Màu sắc (tổng hợp)
  vs_soi_nam_hinh_dang: string;  // 12. Sợi nấm - hình dạng
  vs_soi_nam_kich_thuoc: string; // 12. Sợi nấm - kích thước
  vs_soi_nam_co_vach: string;    // 12. Sợi nấm - đa bào/đơn bào
  vs_bao_tu_vo_tinh: string;     // 13. Bào tử vô tính
  vs_bao_tu_huu_tinh: string;    // 13. Bào tử hữu tính
  vs_dac_diem_khac: string;      // 13. Đặc điểm khác
  // VS biology — fields 15–21
  vs_tho_nhuong: string;         // 16. Thổ nhưỡng/giá thể sinh dưỡng
  vs_dinh_duong: string;         // 20. Dinh dưỡng
  vs_bien_phap_canh_tac: string; // 21. Biện pháp canh tác/nhân nuôi
  // VS growth — fields 22–24
  vs_thoi_gian_khuan_lac: string;
  vs_toc_do_sinh_truong: string;

  // TGS (Tiểu gia súc) morphology — fields 10–32
  tgs_long: string;          // 10. Lông
  tgs_mom: string;           // 11. Mõm
  tgs_rang_nanh: string;     // 12. Răng nanh
  tgs_dau: string;           // 15. Đầu
  tgs_kieu_tai: string;      // 16. Kiểu tai
  tgs_huong_tai: string;     // 17. Hướng tai
  tgs_da: string;            // 18. Da
  tgs_duoi: string;          // 19. Đuôi
  tgs_lung: string;          // 20. Lưng
  tgs_chan: string;          // 21. Chân
  tgs_klct: string;          // 23. KLCT
  tgs_dai_dau: string;       // 25. Dài đầu
  tgs_dai_tai: string;       // 26. Dài tai
  tgs_dai_duoi: string;      // 27. Dài đuôi
  tgs_so_vu: string;         // 30. Số vú

  // II.B Sinh học, sinh thái (dùng chung)
  anh_sang: string;
  dat_tho_nhuong: string;
  nhiet_do: string;
  do_am: string;
  // II.C Sinh trưởng, phát triển (dùng chung / tái sử dụng)
  hinh_thuc_sinh_truong: string;
  ti_le_nay_mam: string;
  dieu_kien_nay_mam: string;
  thoi_vu_gieo_trong: string;
  thoi_gian_khi_gieo_moc: string;
  thoi_gian_gieo_hoa: string;
  thoi_gian_gieo_qua: string;
  // Cây ngô free-text sections (II.B, II.C)
  ngo_sinh_hoc_st: string;
  ngo_sinh_truong_pt: string;
  // TT — Cây rau (phan_nhom = 'Cây rau') morphology fields
  rau_dai_la_mam: string;         // 10. Dài lá mầm
  rau_mau_la_mam: string;         // 11. Màu lá mầm
  rau_dang_phien_la: string;      // 12. Dạng phiến lá
  rau_long_mat_duoi_la: string;   // 17. Lông mặt dưới lá
  rau_long_mat_tren_la: string;   // 18. Lông mặt trên lá
  rau_chieu_dai_dot: string;      // 19. Chiều dài đốt
  rau_dang_than: string;          // 20. Dạng thân
  rau_tua_cuon: string;           // 21. Tua cuốn
  rau_so_qua: string;             // 27. Số quả thu hoạch trên 1 cây
  rau_dai_qua_thuong_mai: string; // 28. Dài quả ở giai đoạn quả chín thương mại
  rau_duong_kinh_qua: string;     // 29. Đường kính quả
  rau_khoi_luong_qua: string;     // 30. Khối lượng quả
  rau_do_day_thit_qua: string;    // 31. Độ dày thịt quả
  rau_vi_thit_qua: string;        // 34. Vị của thịt quả
  rau_mau_qua_chin: string;       // 35. Màu quả ở giai đoạn chín
  rau_nang_suat_qua_tuoi: string; // 36. Năng suất quả tươi
  rau_khoi_luong_100_hat: string; // 41. Khối lượng 100 hạt
  // III & IV
  ghi_chu: string;
  tai_lieu_tham_khao: string;
}

// Form 4 — Dữ liệu đánh giá chi tiết
export interface Form4Data {
  // I. Thông tin chung (fields 1–8)
  ma_so_he_thong: string;
  ma_so_nhiem_vu: string;
  ten_giong: string;
  nguon_giong: string;
  noi_nhan_giong: string;
  noi_nhan_giong_nuoi: string;
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
  nguon_goc_mau: '', dang_mau: '', dang_mau_khac: '', ban_chat_truyen: '', ban_chat_truyen_khac: '', muc_do_thuan: '',
  thoi_gian_ton_tai: '', muc_do_pho_bien: '', xu_huong_phat_trien: '',
  dia_hinh: '', loai_dat: '', loai_dat_khac: '', mau_dat: '', do_chua: '',
  vat_lieu_nhan_giong: '', vat_lieu_nhan_giong_khac: '', nguon_giong_ruong: '',
  phuong_thuc_canh_tac: '', phuong_phap_gieo_trong: '', thoi_vu_trong: '',
  thoi_gian_sinh_truong: '', phan_bon: '', phong_tru_sau_benh: '',
  dl_loai_hinh_nuoi_trong: '', dl_ky_thuat_nuoi_trong: '', dl_thoi_vu_thu_hoach: '',
  cn_nguon_goc_giong: '', cn_hinh_thuc_chan_nuoi: '', cn_thuc_an: '', cn_phuong_thuc_nuoi: '', cn_phong_dich: '',
  ts_nguon_goc_giong: '', ts_loai_hinh_nuoi: '', ts_loai_hinh_nuoi_khac: '',
  ts_thuc_an: '', ts_phuong_thuc_nuoi: '', ts_phuong_thuc_nuoi_khac: '', ts_nguon_giong_khac: '',
  ts_nguon_nuoc: '', ts_mat_do_nuoi: '',
  vs_moi_truong_nuoi_cay: '', vs_nhiet_do_sinh_truong: '', vs_do_am_sinh_truong: '', vs_ph: '', vs_thoi_gian_sinh_truong: '',
  vs_muc_dich_khac: '', vs_bo_phan_khac: '',
  phan_cay_su_dung: '', muc_dich_su_dung: '', thu_hoach: '',
  phuong_phap_bao_quan_sp: '', cach_che_bien: '', phuong_phap_de_giong: '',
  kinh_nghiem_chon_giong: '', dac_tinh_noi_bat: '', tai_lieu_tham_khao: '',
});

export const defaultForm3 = (): Form3Data => ({
  ma_so_he_thong: '', ma_so_nhiem_vu: '', ten_giong: '',
  nguon_giong: '', noi_nhan_giong: '', nguoi_mo_ta: '', co_quan_mo_ta: '',
  dac_diem_chung: '',
  // DL fields
  dang_cay: '', duong_kinh_than: '', chieu_cao_cay: '', mau_sac_than: '', duong_kinh_tan: '',
  kieu_gan_la: '', hinh_dang_la: '', mau_la: '', kieu_la: '',
  kieu_hoa: '', mau_sac_canh_hoa: '', hinh_dang_hoa: '', bau: '', mui_hoa: '',
  hinh_dang_qua: '', loai_qua: '', so_hat_tren_qua: '', dang_hat: '', be_mat_hat: '',
  // TT fields
  tt_chieu_cao_ma: '', tt_chieu_dai_la: '', tt_chieu_rong_la: '', tt_do_phu_long_la: '',
  tt_mau_phien_la: '', tt_mau_be_la: '', tt_goc_la: '', tt_goc_la_dong: '',
  tt_dai_thia_lia: '', tt_mau_thia_lia: '', tt_dang_thia_lia: '',
  tt_mau_co_la: '', tt_mau_tai_la: '', tt_chieu_dai_than: '', tt_so_ranh: '',
  tt_goc_than: '', tt_duong_kinh_ong_da: '', tt_mau_sac_ong_da: '', tt_do_cung_cay: '',
  tt_dai_bong: '', tt_dang_bong: '', tt_phan_nhanh_thu_cap: '', tt_do_thoat_co_bong: '',
  tt_truc_bong: '', tt_do_tan_la: '', tt_do_rung_hat: '', tt_do_dai_hat_tut: '',
  tt_rau: '', tt_mau_rau: '', tt_mau_mo_hat: '', tt_mau_vo_trau: '',
  tt_do_phu_long_vo_trau: '', tt_mau_may_hat: '', tt_chieu_dai_may_hat: '', tt_do_thu_phan_bong: '',
  tt_trong_luong_1000_hat: '', tt_chieu_dai_hat: '', tt_chieu_rong_hat: '', tt_mau_vo_gao: '',
  tt_thoi_gian_tro_bong: '', tt_thoi_gian_sinh_truong_ngay: '',
  // LN fields
  ln_dang_cay: '', ln_chieu_cao_hvn: '', ln_chieu_cao_hdc: '', ln_duong_kinh_d13: '',
  ln_dac_diem_goc: '', ln_sac_to_canh_non: '', ln_long_canh_non: '', ln_goc_phan_canh: '',
  ln_hinh_thai_tan: '', ln_duong_kinh_tan: '', ln_hinh_dang_la: '', ln_kieu_la: '', ln_cuong_la: '',
  ln_kich_thuoc_la: '', ln_kich_thuoc_la_rong: '', ln_gan_la: '', ln_mau_la: '', ln_mau_la_non: '', ln_mep_la: '',
  ln_dau_la: '', ln_duoi_la: '', ln_sap_xep_la: '', ln_kieu_hoa: '', ln_kieu_dinh_hoa: '',
  ln_kich_thuoc_hoa: '', ln_hinh_dang_hoa: '', ln_de_hoa: '', ln_dai_hoa: '', ln_trang_hoa: '',
  ln_mau_sac_trang_hoa: '', ln_nhi_hoa: '', ln_bao_phan: '', ln_nhuy_hoa: '', ln_mui_hoa: '',
  ln_huong_moc_hoa: '', ln_kieu_qua: '', ln_loai_qua: '', ln_hinh_dang_qua: '', ln_kich_thuoc_qua: '', ln_kich_thuoc_qua_rong: '',
  ln_mau_vo_qua: '', ln_so_hat_qua: '', ln_dang_hat: '', ln_be_mat_hat: '', ln_mau_hat: '',
  ln_kich_thuoc_hat: '', ln_kich_thuoc_hat_rong: '', ln_trong_luong_1000_hat: '', ln_cau_tao_cay_mam: '',
  ln_thoi_gian_ra_hoa: '', ln_thoi_gian_thu_hoach: '',
  // CAQ fields
  caq_chieu_cao_phan_canh: '', caq_thoi_gian_ra_hoa: '', caq_thoi_gian_dau_qua: '', caq_thoi_gian_thu_hoach: '',
  che_thoi_gian_ra_hoa: '', che_thoi_gian_dau_qua: '',
  coi_chieu_cao_dong_bap: '', coi_so_la: '', coi_mau_gan_la: '', coi_so_ngay_ra_hoa: '',
  coi_phan_ung_anh_sang: '', coi_so_hoa: '', coi_su_no_hoa: '', coi_do_tro_thoat: '',
  coi_kha_nang_chong_do: '', coi_do_tan_la_dai: '', coi_do_tan_la_rong: '', coi_thoi_vu_thu_hoach: '',
  // LCU fields
  lcu_hinh_thanh_dai_bo: '', lcu_so_luong_dai_bo: '', lcu_hinh_thanh_cu_nhanh: '', lcu_so_luong_choi_ben: '',
  lcu_dang_la: '', lcu_huong_phien_la: '', lcu_mep_la: '', lcu_dai_phien_la: '', lcu_rong_phien_la: '',
  lcu_dai_cuong_la: '', lcu_mau_vien_mep_la: '', lcu_mau_phien_la: '', lcu_dom_la: '',
  lcu_do_day_phien_la: '', lcu_mau_ron_la: '', lcu_so_gan_thu_cap: '', lcu_goc_chu_v: '',
  lcu_vi_tri_vien_mep: '', lcu_mau_gan_mat_tren: '', lcu_mau_gan_mat_duoi: '', lcu_gan_chinh_phu: '',
  lcu_do_sau_gian_thuy: '', lcu_diem_noi_gan_day: '', lcu_hinh_dang_goc_thuy: '', lcu_mau_doc_la: '',
  lcu_bien_doi_mau: '', lcu_phan_cuong_la: '', lcu_dai_be_cuong_la: '', lcu_mau_mep_be_la: '',
  lcu_hinh_dang_be: '', lcu_dang_cu_cai: '', lcu_dai_cu_cai: '', lcu_rong_cu_cai: '',
  lcu_khoi_luong_cu_cai: '', lcu_mau_thit_cu_cai: '', lcu_mau_xo_cu_cai: '',
  lcu_so_cu_con: '', lcu_khoi_luong_cu_con: '', lcu_sap_xep_cu: '', lcu_hinh_dang_cu_con: '',
  lcu_dai_cu_con: '', lcu_rong_cu_con: '', lcu_mau_thit_cu_con: '', lcu_mau_xo_cu_con: '',
  // TN fields
  tn_than_ngam: '', tn_chieu_cao_than: '', tn_duong_kinh_than: '',
  tn_chieu_dai_long: '', tn_chieu_dai_la: '', tn_chieu_rong_la: '',
  tn_do_phu_long_la: '', tn_mau_phien_la: '', tn_mau_goc_be_la: '',
  tn_goc_la: '', tn_mau_co_la: '', tn_mau_tai_la: '',
  tn_hinh_dang_mo_than: '', tn_mau_sac_mo_than: '', tn_mau_long_mo: '',
  tn_tai_mo: '', tn_la_mo: '', tn_dang_bong: '', tn_phan_nhanh: '', tn_mau_hat: '',
  // CN fields
  cn_hinh_thai_long: '', cn_phan_bo_long: '', cn_mao: '', cn_kieu_bo_long: '',
  cn_mau_bo_long: '', cn_mau_da: '', cn_mau_dai_tai: '', cn_kieu_mao: '', cn_do_lon_mao: '',
  cn_mau_mat: '', cn_cac_dang_bo_xuong: '', cn_cac_chieu_do: '', cn_dac_diem_khac: '',
  cn_dac_diem_ngoai_hinh: '', cn_chieu_dai_than: '', cn_chieu_cao_vai: '', cn_vong_nguc: '',
  cn_trong_luong_truong_thanh: '', cn_san_xuat_trung: '', cn_san_xuat_sua: '', cn_kieu_sinh_san: '',
  cn_tuoi_thanh_thuc: '', cn_thoi_gian_mang_thai: '', cn_so_lua_nam: '', cn_so_con_lua: '',
  // TS fields
  ts_chieu_dai_toan_than: '', ts_chieu_cao_dau: '',
  ts_chieu_dai_kinh_te: '', ts_chieu_rong_dau: '',
  ts_dai_truoc_vay_lung: '', ts_chieu_cao_than: '',
  ts_dai_truoc_vay_nguc: '', ts_chieu_day_than: '',
  ts_dai_truoc_vay_bung: '', ts_so_tia_vay_lung: '',
  ts_dai_truoc_vay_hau_mon: '', ts_so_tia_vay_nguc: '',
  ts_chieu_dai_dau: '', ts_so_tia_vay_bung: '',
  ts_chieu_dai_mom: '', ts_so_tia_vay_hau_mon: '',
  ts_duong_kinh_mat: '', ts_so_tia_vay_duoi: '',
  ts_khoang_cach_hai_mat: '', ts_so_vay_duong_ben: '',
  ts_trong_luong_truong_thanh: '', ts_co_quan_sinh_san: '',
  ts_moi_truong_song: '', ts_dac_diem_dinh_duong: '', ts_dac_diem_sinh_san: '',
  ts_thoi_gian_sinh_truong_ts: '', ts_cac_giai_doan_sinh_truong: '', ts_thoi_gian_thanh_thuc_sinh_duc: '',
  ts_mau_sac_co_the: '', ts_mua_vu_sinh_san: '', ts_tuoi_thanh_thuc: '', ts_so_lan_sinh_san: '',
  // TS Ốc fields
  oc_chieu_dai_vo: '', oc_chieu_rong_vo: '', oc_chieu_day_vo: '', oc_co_quan_sinh_duc: '', oc_mau_sac: '',
  // TS Giáp xác fields
  gx_hinh_dang_chuy: '', gx_so_gai_chuy: '', gx_cac_loai_gai: '', gx_cac_loai_go: '', gx_cac_loai_ranh: '',
  gx_so_dot_bung: '', gx_rau_1: '', gx_rau_2: '',
  gx_ham_tren: '', gx_ham_duoi_1: '', gx_ham_duoi_2: '',
  gx_chan_ham_1: '', gx_chan_ham_2: '', gx_chan_ham_3: '',
  gx_chan_boi_1: '', gx_chan_boi_2: '', gx_chan_boi_3_5: '', gx_chan_duoi: '',
  gx_mang_ben: '', gx_mang_khop: '', gx_mang_nhanh: '', gx_mang_chan: '',
  gx_phan_phu_sinh_duc_duc: '', gx_phan_phu_sinh_duc_cai: '', gx_mau_sac: '',
  // TGS fields
  tgs_long: '', tgs_mom: '', tgs_rang_nanh: '', tgs_dau: '', tgs_kieu_tai: '',
  tgs_huong_tai: '', tgs_da: '', tgs_duoi: '', tgs_lung: '', tgs_chan: '',
  tgs_klct: '', tgs_dai_dau: '', tgs_dai_tai: '', tgs_dai_duoi: '', tgs_so_vu: '',
  // VS fields
  vs_kich_thuoc_than: '', vs_kich_thuoc_re: '', vs_kich_thuoc_mu_dam: '', vs_mau_sac: '',
  vs_soi_nam_hinh_dang: '', vs_soi_nam_kich_thuoc: '', vs_soi_nam_co_vach: '',
  vs_bao_tu_vo_tinh: '', vs_bao_tu_huu_tinh: '', vs_dac_diem_khac: '',
  vs_tho_nhuong: '', vs_dinh_duong: '', vs_bien_phap_canh_tac: '',
  vs_thoi_gian_khuan_lac: '', vs_toc_do_sinh_truong: '',
  // Shared biology/ecology
  anh_sang: '', dat_tho_nhuong: '', nhiet_do: '', do_am: '',
  hinh_thuc_sinh_truong: '', ti_le_nay_mam: '', dieu_kien_nay_mam: '',
  thoi_vu_gieo_trong: '', thoi_gian_khi_gieo_moc: '', thoi_gian_gieo_hoa: '', thoi_gian_gieo_qua: '',
  ngo_sinh_hoc_st: '', ngo_sinh_truong_pt: '',
  // Cây rau fields
  rau_dai_la_mam: '', rau_mau_la_mam: '', rau_dang_phien_la: '',
  rau_long_mat_duoi_la: '', rau_long_mat_tren_la: '', rau_chieu_dai_dot: '',
  rau_dang_than: '', rau_tua_cuon: '',
  rau_so_qua: '', rau_dai_qua_thuong_mai: '', rau_duong_kinh_qua: '',
  rau_khoi_luong_qua: '', rau_do_day_thit_qua: '', rau_vi_thit_qua: '',
  rau_mau_qua_chin: '', rau_nang_suat_qua_tuoi: '', rau_khoi_luong_100_hat: '',
  ghi_chu: '', tai_lieu_tham_khao: '',
});

export const defaultForm4 = (): Form4Data => ({
  ma_so_he_thong: '', ma_so_nhiem_vu: '', ten_giong: '',
  nguon_giong: '', noi_nhan_giong: '', noi_nhan_giong_nuoi: '', nguoi_mo_ta: '', co_quan_mo_ta: '',
  trinh_tu_dna: '', chieu_dai_dna: '', ti_le_atgc: '', chuoi_acid_amin: '',
  thong_tin_nang_suat: '', thong_tin_chat_luong: '', khang_sau_benh: '',
  chiu_sinh_thai_bat_thuon: '', dac_tinh_kinh_te_noi_bat: '', tap_quan_xa_hoi: '',
  gia_tri_kinh_te: '', gia_tri_bao_ton: '', gia_tri_dac_huu: '', gia_tri_moi_truong: '',
  gia_tri_dinh_duong: '', tiem_nang_phat_trien: '', cac_thong_tin_khac: '',
  ghi_chu: '', tai_lieu_tham_khao: '',
});

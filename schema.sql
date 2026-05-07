-- =============================================
-- CHẠY FILE NÀY TRONG SUPABASE SQL EDITOR
-- =============================================

-- 1. Bảng nguồn gen chính
CREATE TABLE IF NOT EXISTS nguon_gen (
  ma TEXT PRIMARY KEY,
  ten TEXT NOT NULL,
  khoa_hoc TEXT DEFAULT '',
  don_vi TEXT DEFAULT '',
  phan_nhom TEXT DEFAULT '',
  nhom TEXT DEFAULT '',
  lat DOUBLE PRECISION DEFAULT 0,
  lng DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Form 1 — Thông tin cơ bản mở rộng
CREATE TABLE IF NOT EXISTS form1_data (
  ma_nguon_gen TEXT PRIMARY KEY REFERENCES nguon_gen(ma) ON DELETE CASCADE,
  ten_khac TEXT DEFAULT '',
  ten_ho TEXT DEFAULT '',
  ten_bo TEXT DEFAULT '',
  nguon_giao TEXT DEFAULT '',
  noi_thu_thap_tinh TEXT DEFAULT '',
  noi_thu_thap_huyen TEXT DEFAULT '',
  noi_thu_thap_xa TEXT DEFAULT '',
  dia_chi_chi_tiet TEXT DEFAULT '',
  mo_ta_thu_thap TEXT DEFAULT '',
  noi_phan_bo TEXT DEFAULT '',
  dang_bao_ton BOOLEAN DEFAULT FALSE,
  bao_ton_list JSONB DEFAULT '[]',
  dang_khai_thac BOOLEAN DEFAULT FALSE,
  hinh_thuc_khai_thac TEXT DEFAULT '',
  noi_khai_thac TEXT DEFAULT '',
  don_vi_khai_thac TEXT DEFAULT '',
  hinh_anh TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Form 2 — Điều tra thu thập
CREATE TABLE IF NOT EXISTS form2_data (
  ma_nguon_gen TEXT PRIMARY KEY REFERENCES nguon_gen(ma) ON DELETE CASCADE,
  ma_thu_thap TEXT DEFAULT '',
  ten_viet_bo TEXT DEFAULT '',
  ten_viet_ho TEXT DEFAULT '',
  ten_viet_chi TEXT DEFAULT '',
  ten_viet_loai TEXT DEFAULT '',
  ten_khoa_bo TEXT DEFAULT '',
  ten_khoa_ho TEXT DEFAULT '',
  ten_khoa_chi TEXT DEFAULT '',
  ten_khoa_loai TEXT DEFAULT '',
  ten_khac_2 TEXT DEFAULT '',
  ngay_thu_thap TEXT DEFAULT '',
  thon_ban TEXT DEFAULT '',
  xa_phuong TEXT DEFAULT '',
  huyen_thi_tp TEXT DEFAULT '',
  tinh TEXT DEFAULT '',
  toa_do_x TEXT DEFAULT '',
  toa_do_y TEXT DEFAULT '',
  do_cao TEXT DEFAULT '',
  ten_nguon_goc TEXT DEFAULT '',
  ten_nguoi_thu_thap TEXT DEFAULT '',
  co_quan_dieu_tra TEXT DEFAULT '',
  nguon_goc_mau TEXT DEFAULT '',
  dang_mau TEXT DEFAULT '',
  dang_mau_khac TEXT DEFAULT '',
  ban_chat_truyen TEXT DEFAULT '',
  muc_do_thuan TEXT DEFAULT '',
  thoi_gian_ton_tai TEXT DEFAULT '',
  muc_do_pho_bien TEXT DEFAULT '',
  xu_huong_phat_trien TEXT DEFAULT '',
  dia_hinh TEXT DEFAULT '',
  loai_dat TEXT DEFAULT '',
  loai_dat_khac TEXT DEFAULT '',
  mau_dat TEXT DEFAULT '',
  do_chua TEXT DEFAULT '',
  vat_lieu_nhan_giong TEXT DEFAULT '',
  vat_lieu_nhan_giong_khac TEXT DEFAULT '',
  nguon_giong_ruong TEXT DEFAULT '',
  phuong_thuc_canh_tac TEXT DEFAULT '',
  phuong_phap_gieo_trong TEXT DEFAULT '',
  thoi_vu_trong TEXT DEFAULT '',
  thoi_gian_sinh_truong TEXT DEFAULT '',
  phan_bon TEXT DEFAULT '',
  phong_tru_sau_benh TEXT DEFAULT '',
  phan_cay_su_dung TEXT DEFAULT '',
  muc_dich_su_dung TEXT DEFAULT '',
  thu_hoach TEXT DEFAULT '',
  phuong_phap_bao_quan_sp TEXT DEFAULT '',
  cach_che_bien TEXT DEFAULT '',
  phuong_phap_de_giong TEXT DEFAULT '',
  kinh_nghiem_chon_giong TEXT DEFAULT '',
  dac_tinh_noi_bat TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Form 3 — Đánh giá ban đầu
CREATE TABLE IF NOT EXISTS form3_data (
  ma_nguon_gen TEXT PRIMARY KEY REFERENCES nguon_gen(ma) ON DELETE CASCADE,
  ma_so_he_thong TEXT DEFAULT '',
  ma_so_nhiem_vu TEXT DEFAULT '',
  ten_giong TEXT DEFAULT '',
  nguon_giong TEXT DEFAULT '',
  noi_nhan_giong TEXT DEFAULT '',
  nguoi_mo_ta TEXT DEFAULT '',
  co_quan_mo_ta TEXT DEFAULT '',
  dac_diem_chung TEXT DEFAULT '',
  dang_cay TEXT DEFAULT '',
  duong_kinh_than TEXT DEFAULT '',
  chieu_cao_cay TEXT DEFAULT '',
  mau_sac_than TEXT DEFAULT '',
  duong_kinh_tan TEXT DEFAULT '',
  kieu_gan_la TEXT DEFAULT '',
  hinh_dang_la TEXT DEFAULT '',
  mau_la TEXT DEFAULT '',
  kieu_la TEXT DEFAULT '',
  kieu_hoa TEXT DEFAULT '',
  mau_sac_canh_hoa TEXT DEFAULT '',
  hinh_dang_hoa TEXT DEFAULT '',
  bau TEXT DEFAULT '',
  mui_hoa TEXT DEFAULT '',
  hinh_dang_qua TEXT DEFAULT '',
  loai_qua TEXT DEFAULT '',
  so_hat_tren_qua TEXT DEFAULT '',
  dang_hat TEXT DEFAULT '',
  be_mat_hat TEXT DEFAULT '',
  anh_sang TEXT DEFAULT '',
  dat_tho_nhuong TEXT DEFAULT '',
  nhiet_do TEXT DEFAULT '',
  do_am TEXT DEFAULT '',
  hinh_thuc_sinh_truong TEXT DEFAULT '',
  ti_le_nay_mam TEXT DEFAULT '',
  dieu_kien_nay_mam TEXT DEFAULT '',
  thoi_vu_gieo_trong TEXT DEFAULT '',
  thoi_gian_khi_gieo_moc TEXT DEFAULT '',
  thoi_gian_gieo_hoa TEXT DEFAULT '',
  thoi_gian_gieo_qua TEXT DEFAULT '',
  ghi_chu TEXT DEFAULT '',
  tai_lieu_tham_khao TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Form 4 — Đánh giá chi tiết
CREATE TABLE IF NOT EXISTS form4_data (
  ma_nguon_gen TEXT PRIMARY KEY REFERENCES nguon_gen(ma) ON DELETE CASCADE,
  ma_so_he_thong TEXT DEFAULT '',
  ma_so_nhiem_vu TEXT DEFAULT '',
  ten_giong TEXT DEFAULT '',
  nguon_giong TEXT DEFAULT '',
  noi_nhan_giong TEXT DEFAULT '',
  nguoi_mo_ta TEXT DEFAULT '',
  co_quan_mo_ta TEXT DEFAULT '',
  trinh_tu_dna TEXT DEFAULT '',
  chieu_dai_dna TEXT DEFAULT '',
  ti_le_atgc TEXT DEFAULT '',
  chuoi_acid_amin TEXT DEFAULT '',
  thong_tin_nang_suat TEXT DEFAULT '',
  thong_tin_chat_luong TEXT DEFAULT '',
  khang_sau_benh TEXT DEFAULT '',
  chiu_sinh_thai_bat_thuon TEXT DEFAULT '',
  dac_tinh_kinh_te_noi_bat TEXT DEFAULT '',
  tap_quan_xa_hoi TEXT DEFAULT '',
  gia_tri_kinh_te TEXT DEFAULT '',
  gia_tri_bao_ton TEXT DEFAULT '',
  gia_tri_dac_huu TEXT DEFAULT '',
  gia_tri_moi_truong TEXT DEFAULT '',
  gia_tri_dinh_duong TEXT DEFAULT '',
  tiem_nang_phat_trien TEXT DEFAULT '',
  cac_thong_tin_khac TEXT DEFAULT '',
  ghi_chu TEXT DEFAULT '',
  tai_lieu_tham_khao TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_nguon_gen_updated BEFORE UPDATE ON nguon_gen FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_form1_updated BEFORE UPDATE ON form1_data FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_form2_updated BEFORE UPDATE ON form2_data FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_form3_updated BEFORE UPDATE ON form3_data FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_form4_updated BEFORE UPDATE ON form4_data FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 7. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE nguon_gen;
ALTER PUBLICATION supabase_realtime ADD TABLE form1_data;
ALTER PUBLICATION supabase_realtime ADD TABLE form2_data;
ALTER PUBLICATION supabase_realtime ADD TABLE form3_data;
ALTER PUBLICATION supabase_realtime ADD TABLE form4_data;

-- 8. Supabase Storage bucket cho hình ảnh
INSERT INTO storage.buckets (id, name, public) VALUES ('nguon-gen-images', 'nguon-gen-images', true)
ON CONFLICT (id) DO NOTHING;

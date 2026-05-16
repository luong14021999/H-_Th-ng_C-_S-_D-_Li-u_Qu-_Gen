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

-- 3. Form 2 — Điều tra thu thập (JSONB — no column-not-found errors)
CREATE TABLE IF NOT EXISTS form2_data (
  ma_nguon_gen TEXT PRIMARY KEY REFERENCES nguon_gen(ma) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Form 3 — Đánh giá ban đầu (JSONB)
CREATE TABLE IF NOT EXISTS form3_data (
  ma_nguon_gen TEXT PRIMARY KEY REFERENCES nguon_gen(ma) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Form 4 — Đánh giá chi tiết (JSONB)
CREATE TABLE IF NOT EXISTS form4_data (
  ma_nguon_gen TEXT PRIMARY KEY REFERENCES nguon_gen(ma) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
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

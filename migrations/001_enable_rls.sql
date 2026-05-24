-- =============================================
-- Chạy 1 lần trong Supabase SQL Editor
-- Bật RLS + cấp policy "anon đọc, authenticated/service_role toàn quyền"
-- =============================================

-- 1. Bật RLS trên mọi bảng dữ liệu
ALTER TABLE nguon_gen   ENABLE ROW LEVEL SECURITY;
ALTER TABLE form1_data  ENABLE ROW LEVEL SECURITY;
ALTER TABLE form2_data  ENABLE ROW LEVEL SECURITY;
ALTER TABLE form3_data  ENABLE ROW LEVEL SECURITY;
ALTER TABLE form4_data  ENABLE ROW LEVEL SECURITY;

-- 2. Xoá các policy cũ (idempotent)
DROP POLICY IF EXISTS "public read"  ON nguon_gen;
DROP POLICY IF EXISTS "auth write"   ON nguon_gen;
DROP POLICY IF EXISTS "public read"  ON form1_data;
DROP POLICY IF EXISTS "auth write"   ON form1_data;
DROP POLICY IF EXISTS "public read"  ON form2_data;
DROP POLICY IF EXISTS "auth write"   ON form2_data;
DROP POLICY IF EXISTS "public read"  ON form3_data;
DROP POLICY IF EXISTS "auth write"   ON form3_data;
DROP POLICY IF EXISTS "public read"  ON form4_data;
DROP POLICY IF EXISTS "auth write"   ON form4_data;

-- 3. Anon (không đăng nhập) chỉ ĐƯỢC ĐỌC
CREATE POLICY "public read" ON nguon_gen  FOR SELECT USING (true);
CREATE POLICY "public read" ON form1_data FOR SELECT USING (true);
CREATE POLICY "public read" ON form2_data FOR SELECT USING (true);
CREATE POLICY "public read" ON form3_data FOR SELECT USING (true);
CREATE POLICY "public read" ON form4_data FOR SELECT USING (true);

-- 4. Người đã đăng nhập (Supabase Auth) có toàn quyền INSERT/UPDATE/DELETE
CREATE POLICY "auth write" ON nguon_gen
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
CREATE POLICY "auth write" ON form1_data
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
CREATE POLICY "auth write" ON form2_data
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
CREATE POLICY "auth write" ON form3_data
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
CREATE POLICY "auth write" ON form4_data
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- 5. Lưu ý:
--   - service_role (dùng trong API route qua supabaseAdmin) tự động BYPASS RLS,
--     nên các API route vẫn ghi/xoá được như cũ. Bảo vệ thực sự đến từ
--     requireAuth() trong code TypeScript.
--   - anon key trong bundle JS giờ CHỈ đọc được. Không thể INSERT/UPDATE/DELETE
--     dù có gọi trực tiếp Supabase REST.
--
-- 6. (Tuỳ chọn) bai_viet — nếu đã tạo bảng này, chạy thêm:
--   ALTER TABLE bai_viet_rows ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE bai_viet_meta ENABLE ROW LEVEL SECURITY;
--   CREATE POLICY "public read" ON bai_viet_rows FOR SELECT USING (true);
--   CREATE POLICY "public read" ON bai_viet_meta FOR SELECT USING (true);
--   CREATE POLICY "auth write"  ON bai_viet_rows FOR ALL TO authenticated USING (true) WITH CHECK (true);
--   CREATE POLICY "auth write"  ON bai_viet_meta FOR ALL TO authenticated USING (true) WITH CHECK (true);

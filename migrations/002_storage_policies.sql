-- =============================================
-- Chạy 1 lần trong Supabase SQL Editor
-- Cho phép browser upload thẳng lên bucket nguon-gen-images
-- (bypass Vercel 4.5MB body limit), kiểm soát qua RLS.
-- =============================================

-- Xoá policy cũ nếu có (idempotent)
DROP POLICY IF EXISTS "public read nguon-gen images"   ON storage.objects;
DROP POLICY IF EXISTS "auth upload nguon-gen images"   ON storage.objects;
DROP POLICY IF EXISTS "auth update nguon-gen images"   ON storage.objects;
DROP POLICY IF EXISTS "auth delete nguon-gen images"   ON storage.objects;

-- 1. Ai cũng đọc được (bucket vốn đã public)
CREATE POLICY "public read nguon-gen images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'nguon-gen-images');

-- 2. Người đã đăng nhập mới upload được
CREATE POLICY "auth upload nguon-gen images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'nguon-gen-images');

-- 3. Người đã đăng nhập mới ghi đè / xoá được
CREATE POLICY "auth update nguon-gen images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'nguon-gen-images')
  WITH CHECK (bucket_id = 'nguon-gen-images');

CREATE POLICY "auth delete nguon-gen images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'nguon-gen-images');

-- Verify:
--   SELECT policyname, cmd, roles FROM pg_policies
--   WHERE schemaname = 'storage' AND tablename = 'objects'
--     AND policyname LIKE '%nguon-gen images';

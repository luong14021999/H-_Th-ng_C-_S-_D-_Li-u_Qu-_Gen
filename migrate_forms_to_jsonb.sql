-- ============================================================
-- CHẠY FILE NÀY TRONG SUPABASE SQL EDITOR (1 LẦN DUY NHẤT)
-- Chuyển form2_data, form3_data, form4_data sang lưu JSONB
-- để tránh lỗi "column not found" khi thêm trường mới.
-- ============================================================

-- ── Form 2 ────────────────────────────────────────────────
-- Migrate existing rows → JSONB, then swap table
CREATE TABLE form2_data_new (
  ma_nguon_gen TEXT PRIMARY KEY REFERENCES nguon_gen(ma) ON DELETE CASCADE,
  data         JSONB NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO form2_data_new (ma_nguon_gen, data, updated_at)
SELECT
  ma_nguon_gen,
  (to_jsonb(f) - 'ma_nguon_gen' - 'updated_at'),
  updated_at
FROM form2_data f;

DROP TABLE form2_data CASCADE;
ALTER TABLE form2_data_new RENAME TO form2_data;

-- ── Form 3 ────────────────────────────────────────────────
DROP TABLE IF EXISTS form3_data CASCADE;
CREATE TABLE form3_data (
  ma_nguon_gen TEXT PRIMARY KEY REFERENCES nguon_gen(ma) ON DELETE CASCADE,
  data         JSONB NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Form 4 ────────────────────────────────────────────────
DROP TABLE IF EXISTS form4_data CASCADE;
CREATE TABLE form4_data (
  ma_nguon_gen TEXT PRIMARY KEY REFERENCES nguon_gen(ma) ON DELETE CASCADE,
  data         JSONB NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Restore triggers ──────────────────────────────────────
CREATE TRIGGER trg_form2_updated BEFORE UPDATE ON form2_data FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_form3_updated BEFORE UPDATE ON form3_data FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_form4_updated BEFORE UPDATE ON form4_data FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Restore Realtime ──────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE form2_data;
ALTER PUBLICATION supabase_realtime ADD TABLE form3_data;
ALTER PUBLICATION supabase_realtime ADD TABLE form4_data;

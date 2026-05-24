import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/requireAuth";

/*
  Supabase SQL — chạy 1 lần trong SQL Editor:

  CREATE TABLE IF NOT EXISTS bai_viet_rows (
    id        TEXT PRIMARY KEY,
    nhom      TEXT NOT NULL DEFAULT '',
    ten       TEXT NOT NULL DEFAULT '',
    khoa_hoc  TEXT NOT NULL DEFAULT '',
    dang_mau  TEXT NOT NULL DEFAULT '',
    tu_lieu   TEXT NOT NULL DEFAULT '',
    dg_ban_dau  TEXT NOT NULL DEFAULT '',
    dg_chi_tiet TEXT NOT NULL DEFAULT '',
    chua_bt   TEXT NOT NULL DEFAULT '',
    pt_bt     TEXT NOT NULL DEFAULT '',
    ht_bt     TEXT NOT NULL DEFAULT '',
    noi_bt    TEXT NOT NULL DEFAULT '',
    dv_bt     TEXT NOT NULL DEFAULT '',
    chua_kt   TEXT NOT NULL DEFAULT '',
    ht_kt     TEXT NOT NULL DEFAULT '',
    dia_diem  TEXT NOT NULL DEFAULT '',
    dv_kt     TEXT NOT NULL DEFAULT '',
    ghi_chu   TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS bai_viet_meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  );
*/

export async function GET() {
  const [rowsRes, metaRes] = await Promise.all([
    supabaseAdmin.from("bai_viet_rows").select("*").order("ten"),
    supabaseAdmin.from("bai_viet_meta").select("*"),
  ]);

  if (rowsRes.error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  if (metaRes.error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });

  const meta: Record<string, string> = {};
  for (const r of metaRes.data ?? []) meta[r.key as string] = r.value as string;

  return NextResponse.json({ rows: rowsRes.data ?? [], meta });
}

const ROW_COLS = new Set([
  "id","nhom","ten","khoa_hoc","dang_mau","tu_lieu","dg_ban_dau","dg_chi_tiet",
  "chua_bt","pt_bt","ht_bt","noi_bt","dv_bt","chua_kt","ht_kt","dia_diem","dv_kt","ghi_chu",
]);

export async function POST(req: NextRequest) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const { rows, meta } = (await req.json()) as {
    rows: Record<string, string>[];
    meta: Record<string, string>;
  };

  // Strip any extra fields (e.g. `tt` from static seed data) so Supabase doesn't reject unknown columns
  const cleanRows = rows.map((r) =>
    Object.fromEntries(Object.entries(r).filter(([k]) => ROW_COLS.has(k)))
  );

  // Full replace: delete all existing rows then insert current set
  const { error: delErr } = await supabaseAdmin
    .from("bai_viet_rows")
    .delete()
    .gte("id", ""); // matches all rows (id >= '' is always true for text)

  if (delErr) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });

  if (cleanRows.length > 0) {
    // Insert in chunks of 200 to stay within Supabase limits
    for (let i = 0; i < cleanRows.length; i += 200) {
      const { error: insErr } = await supabaseAdmin
        .from("bai_viet_rows")
        .insert(cleanRows.slice(i, i + 200));
      if (insErr) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
    }
  }

  // Upsert metadata key-value pairs
  if (Object.keys(meta).length > 0) {
    const metaRows = Object.entries(meta).map(([key, value]) => ({ key, value }));
    const { error: metaErr } = await supabaseAdmin
      .from("bai_viet_meta")
      .upsert(metaRows, { onConflict: "key" });
    if (metaErr) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

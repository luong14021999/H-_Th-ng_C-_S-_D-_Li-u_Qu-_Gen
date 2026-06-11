import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/requireAuth";

type Ctx = { params: Promise<{ ma: string }> };

// Combined save: updates the main record + all four form tables behind a single
// auth check / rate-limit token. The browser used to fire 5 separate mutation
// requests per save (1 PATCH + 4 PUT via Promise.all); any one failing — a 429
// from the per-IP limiter, or a transient auth/network blip — sank the whole
// save. Collapsing to one request removes that amplified failure surface.
export async function PUT(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  const { ma } = await params;
  const body = await req.json();
  const { record, form1, form2, form3, form4 } = body ?? {};

  // Run every write in parallel server-side. Each entry is [label, query].
  const writes: [string, PromiseLike<{ error: unknown }>][] = [];

  if (record) {
    writes.push([
      "record",
      supabaseAdmin.from("nguon_gen").update(record).eq("ma", ma),
    ]);
  }
  if (form1) {
    writes.push([
      "form1",
      supabaseAdmin
        .from("form1_data")
        .upsert({ ...form1, ma_nguon_gen: ma }, { onConflict: "ma_nguon_gen" }),
    ]);
  }
  if (form2) {
    writes.push([
      "form2",
      supabaseAdmin
        .from("form2_data")
        .upsert({ ma_nguon_gen: ma, data: form2 }, { onConflict: "ma_nguon_gen" }),
    ]);
  }
  if (form3) {
    writes.push([
      "form3",
      supabaseAdmin
        .from("form3_data")
        .upsert({ ma_nguon_gen: ma, data: form3 }, { onConflict: "ma_nguon_gen" }),
    ]);
  }
  if (form4) {
    writes.push([
      "form4",
      supabaseAdmin
        .from("form4_data")
        .upsert({ ma_nguon_gen: ma, data: form4 }, { onConflict: "ma_nguon_gen" }),
    ]);
  }

  const results = await Promise.all(writes.map(([, q]) => q));
  const failed = writes
    .map(([label], i) => (results[i].error ? label : null))
    .filter(Boolean);

  if (failed.length) {
    console.error("save failed:", ma, failed, results.map((r) => r.error).filter(Boolean));
    return NextResponse.json(
      { error: `Lỗi máy chủ khi lưu: ${failed.join(", ")}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

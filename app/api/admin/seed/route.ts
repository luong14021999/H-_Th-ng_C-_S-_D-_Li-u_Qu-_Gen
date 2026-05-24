import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/requireAuth";

export async function POST(req: NextRequest) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const { records } = await req.json();
  if (!Array.isArray(records) || records.length === 0) {
    return NextResponse.json({ error: "No records" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("nguon_gen")
    .upsert(records, { onConflict: "ma" });

  if (error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  return NextResponse.json({ seeded: records.length });
}

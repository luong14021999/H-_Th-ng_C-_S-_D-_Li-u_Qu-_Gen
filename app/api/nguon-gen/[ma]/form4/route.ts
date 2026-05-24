import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/requireAuth";

type Ctx = { params: Promise<{ ma: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAuth();
  if (unauth) return unauth;
  const { ma } = await params;
  const body = await req.json();

  const { error } = await supabaseAdmin
    .from("form4_data")
    .upsert({ ma_nguon_gen: ma, data: body }, { onConflict: "ma_nguon_gen" });

  if (error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

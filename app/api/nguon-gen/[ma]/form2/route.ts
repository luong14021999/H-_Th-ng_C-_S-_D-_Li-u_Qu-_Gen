import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

type Ctx = { params: Promise<{ ma: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { ma } = await params;
  const body = await req.json();

  const { error } = await supabaseAdmin
    .from("form2_data")
    .upsert({ ma_nguon_gen: ma, data: body }, { onConflict: "ma_nguon_gen" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

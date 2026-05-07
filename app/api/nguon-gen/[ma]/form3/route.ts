import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

type Ctx = { params: Promise<{ ma: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { ma } = await params;
  const body = await req.json();
  const payload = { ...body, ma_nguon_gen: ma };

  const { data, error } = await supabaseAdmin
    .from("form3_data")
    .upsert(payload, { onConflict: "ma_nguon_gen" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

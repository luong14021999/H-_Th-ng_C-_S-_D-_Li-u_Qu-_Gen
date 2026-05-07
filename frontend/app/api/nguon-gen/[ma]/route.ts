import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

type Ctx = { params: Promise<{ ma: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { ma } = await params;
  const { data, error } = await supabaseAdmin
    .from("nguon_gen")
    .select("*")
    .eq("ma", ma)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { ma } = await params;
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("nguon_gen")
    .update(body)
    .eq("ma", ma)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { ma } = await params;
  const { error } = await supabaseAdmin.from("nguon_gen").delete().eq("ma", ma);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}

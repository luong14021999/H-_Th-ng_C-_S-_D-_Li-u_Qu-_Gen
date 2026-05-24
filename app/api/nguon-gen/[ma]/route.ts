import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/requireAuth";

type Ctx = { params: Promise<{ ma: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { ma } = await params;
  const { data, error } = await supabaseAdmin
    .from("nguon_gen")
    .select("*")
    .eq("ma", ma)
    .single();
  if (error) return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;
  const { ma } = await params;
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("nguon_gen")
    .update(body)
    .eq("ma", ma)
    .select()
    .single();
  if (error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;
  const { ma } = await params;
  const { error } = await supabaseAdmin.from("nguon_gen").delete().eq("ma", ma);
  if (error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}

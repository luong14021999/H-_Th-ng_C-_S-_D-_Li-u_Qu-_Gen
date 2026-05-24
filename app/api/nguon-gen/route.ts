import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("nguon_gen")
    .select("*")
    .order("ma");
  if (error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const unauth = await requireAuth(request);
  if (unauth) return unauth;
  const body = await request.json();
  const { data, error } = await supabaseAdmin
    .from("nguon_gen")
    .insert(body)
    .select()
    .single();
  if (error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// Used to delete records whose ma is an empty string (can't route via /[ma])
export async function DELETE(req: NextRequest) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;
  const ma = req.nextUrl.searchParams.get("ma") ?? "";
  const { error } = await supabaseAdmin.from("nguon_gen").delete().eq("ma", ma);
  if (error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}

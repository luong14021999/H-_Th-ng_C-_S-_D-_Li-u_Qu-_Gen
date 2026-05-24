import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/requireAuth";

type Ctx = { params: Promise<{ ma: string; filename: string }> };

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAuth(req);
  if (unauth) return unauth;

  const { ma, filename } = await params;
  if (!/^[A-Za-z0-9._-]+$/.test(ma) || !/^[A-Za-z0-9._-]+$/.test(filename)) {
    return NextResponse.json({ error: "Đường dẫn không hợp lệ" }, { status: 400 });
  }
  const path = `${ma}/${filename}`;

  const { error } = await supabaseAdmin.storage
    .from("nguon-gen-images")
    .remove([path]);

  if (error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}

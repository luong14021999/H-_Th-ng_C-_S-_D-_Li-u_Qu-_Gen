import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

type Ctx = { params: Promise<{ ma: string; filename: string }> };

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { ma, filename } = await params;
  const path = `${ma}/${filename}`;

  const { error } = await supabaseAdmin.storage
    .from("nguon-gen-images")
    .remove([path]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}

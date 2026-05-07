import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

type Ctx = { params: Promise<{ ma: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const { ma } = await params;
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${ma}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("nguon-gen-images")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage
    .from("nguon-gen-images")
    .getPublicUrl(filename);

  return NextResponse.json({ url: data.publicUrl, filename });
}

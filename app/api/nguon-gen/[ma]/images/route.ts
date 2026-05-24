import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/requireAuth";

type Ctx = { params: Promise<{ ma: string }> };

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest, { params }: Ctx) {
  const unauth = await requireAuth();
  if (unauth) return unauth;

  const { ma } = await params;
  if (!/^[A-Za-z0-9._-]+$/.test(ma)) {
    return NextResponse.json({ error: "Mã không hợp lệ" }, { status: 400 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Thiếu tệp" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Tệp quá lớn" }, { status: 413 });
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Định dạng không hỗ trợ" }, { status: 415 });

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  if (!ALLOWED_EXTS.has(ext)) return NextResponse.json({ error: "Định dạng không hỗ trợ" }, { status: 415 });

  const filename = `${ma}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from("nguon-gen-images")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });

  const { data } = supabaseAdmin.storage
    .from("nguon-gen-images")
    .getPublicUrl(filename);

  return NextResponse.json({ url: data.publicUrl, filename });
}

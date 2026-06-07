import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export interface ImageRow {
  ma: string;
  anh: string; // first uploaded image URL for the record
}

// Returns the first image of each record from form1_data so the list/sidebar
// can show real thumbnails without loading the full extended forms per item.
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("form1_data")
    .select("ma_nguon_gen, hinh_anh");

  if (error) {
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }

  const rows: ImageRow[] = [];
  for (const r of data ?? []) {
    const list = r.hinh_anh as unknown;
    const first = Array.isArray(list) ? list.find((x) => typeof x === "string" && x.startsWith("http")) : undefined;
    if (first) rows.push({ ma: r.ma_nguon_gen as string, anh: first as string });
  }

  return NextResponse.json(rows);
}

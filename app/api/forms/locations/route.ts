import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export interface LocationRow {
  ma: string;
  huyen: string;
  xa: string;
  nguon_giao: string;
}

// Returns form1 fields used by the statistics / catalog pages: the collection
// district/ward (Nơi thu thập) and the supplying unit (Người/cơ quan giao,
// trồng/cấp giống).
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("form1_data")
    .select("ma_nguon_gen, noi_thu_thap_huyen, noi_thu_thap_xa, nguon_giao");

  if (error) {
    return NextResponse.json({ error: "Lỗi máy chủ" }, { status: 500 });
  }

  const rows: LocationRow[] = (data ?? []).map((r) => ({
    ma: r.ma_nguon_gen as string,
    huyen: (r.noi_thu_thap_huyen as string) ?? "",
    xa: (r.noi_thu_thap_xa as string) ?? "",
    nguon_giao: (r.nguon_giao as string) ?? "",
  }));

  return NextResponse.json(rows);
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export interface LocationRow {
  ma: string;
  huyen: string;
  xa: string;
}

// Returns district/ward from form1_data for all records — used by statistics filters
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("form1_data")
    .select("ma_nguon_gen, noi_thu_thap_huyen, noi_thu_thap_xa");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows: LocationRow[] = (data ?? []).map((r) => ({
    ma: r.ma_nguon_gen as string,
    huyen: (r.noi_thu_thap_huyen as string) ?? "",
    xa: (r.noi_thu_thap_xa as string) ?? "",
  }));

  return NextResponse.json(rows);
}

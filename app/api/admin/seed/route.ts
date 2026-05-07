import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const { records } = await req.json();
  if (!Array.isArray(records) || records.length === 0) {
    return NextResponse.json({ error: "No records" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("nguon_gen")
    .upsert(records, { onConflict: "ma" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ seeded: records.length });
}

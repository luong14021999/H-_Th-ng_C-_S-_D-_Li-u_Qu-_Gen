import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

type Ctx = { params: Promise<{ ma: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { ma } = await params;

  const [r1, r2, r3, r4] = await Promise.all([
    supabaseAdmin.from("form1_data").select("*").eq("ma_nguon_gen", ma).maybeSingle(),
    supabaseAdmin.from("form2_data").select("*").eq("ma_nguon_gen", ma).maybeSingle(),
    supabaseAdmin.from("form3_data").select("*").eq("ma_nguon_gen", ma).maybeSingle(),
    supabaseAdmin.from("form4_data").select("*").eq("ma_nguon_gen", ma).maybeSingle(),
  ]);

  return NextResponse.json({
    form1: r1.data ?? {},
    form2: r2.data ?? {},
    form3: r3.data ?? {},
    form4: r4.data ?? {},
  });
}

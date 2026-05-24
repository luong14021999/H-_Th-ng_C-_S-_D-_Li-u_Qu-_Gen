import { NextResponse } from "next/server";
import { createSupabaseServer } from "./supabase-server";

// Ensures the caller has a valid Supabase session. Returns NextResponse(401)
// when not authenticated; otherwise null. Use at the top of any mutation
// route handler.
export async function requireAuth(): Promise<NextResponse | null> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  return null;
}

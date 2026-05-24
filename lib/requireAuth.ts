import { NextResponse } from "next/server";
import { createSupabaseServer } from "./supabase-server";
import { rateLimit, clientIp } from "./rateLimit";

// Ensures the caller has a valid Supabase session AND is within the per-IP
// rate budget. Returns NextResponse(401|429) on failure; otherwise null.
// Use at the top of any mutation route handler.
export async function requireAuth(req?: Request): Promise<NextResponse | null> {
  if (req) {
    const ip = clientIp(req);
    const limit = rateLimit(`mut:${ip}`, { windowMs: 60_000, max: 60 });
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
      );
    }
  }

  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  return null;
}

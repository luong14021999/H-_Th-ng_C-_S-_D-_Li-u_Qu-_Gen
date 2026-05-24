import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Runs on every matched request. Forwards the response while letting the
// Supabase SSR client refresh expired access tokens via Set-Cookie.
export async function middleware(req: NextRequest) {
  // CSRF defense: any state-changing request must come from the same origin.
  // SameSite=lax already blocks most cross-site cookies, but this is a belt-
  // and-suspenders check that also stops sub-domain takeovers.
  if (req.nextUrl.pathname.startsWith("/api/") && MUTATING.has(req.method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin) {
      const expected = `${req.nextUrl.protocol}//${host}`;
      if (origin !== expected) {
        return NextResponse.json({ error: "Origin không hợp lệ" }, { status: 403 });
      }
    }
  }

  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(toSet) {
          toSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          toSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Touch the user — this triggers a refresh if the access token is stale.
  await supabase.auth.getUser();

  return res;
}

export const config = {
  // Skip Next.js internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};

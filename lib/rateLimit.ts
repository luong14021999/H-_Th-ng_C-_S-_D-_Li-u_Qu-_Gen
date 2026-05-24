// Tiny in-process rate limiter. Best-effort only — on serverless (Vercel) each
// instance has its own bucket. For a hardened deployment back this with
// Upstash Redis (@upstash/ratelimit). Until then this stops casual scripting.
const buckets = new Map<string, { count: number; resetAt: number }>();

interface Options {
  windowMs?: number;
  max?: number;
}

export function rateLimit(key: string, { windowMs = 60_000, max = 30 }: Options = {}) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetAt: now + windowMs };
  }
  b.count += 1;
  if (b.count > max) return { ok: false, remaining: 0, resetAt: b.resetAt };
  return { ok: true, remaining: max - b.count, resetAt: b.resetAt };
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

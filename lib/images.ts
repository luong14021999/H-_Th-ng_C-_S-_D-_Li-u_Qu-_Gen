// Turn a stored Supabase Storage *public object* URL into a resized, on-the-fly
// transformed URL so we don't download multi-MB originals for small previews.
// Non-Supabase URLs (e.g. base64 data: for not-yet-uploaded images, or external
// links) are returned unchanged.
//
//   .../storage/v1/object/public/<bucket>/<path>
//      -> .../storage/v1/render/image/public/<bucket>/<path>?width=..&quality=..

const PUBLIC_MARKER = "/storage/v1/object/public/";

export function imageUrl(
  src: string | undefined | null,
  opts: { width?: number; height?: number; quality?: number; resize?: "cover" | "contain" | "fill" } = {}
): string {
  if (!src) return "";
  const i = src.indexOf(PUBLIC_MARKER);
  if (i < 0) return src; // data: URL or non-Supabase source — leave as-is
  const base = src.slice(0, i);
  const objectPath = src.slice(i + PUBLIC_MARKER.length).split("?")[0];

  const params = new URLSearchParams();
  if (opts.width) params.set("width", String(opts.width));
  if (opts.height) params.set("height", String(opts.height));
  params.set("quality", String(opts.quality ?? 75));
  if (opts.resize) params.set("resize", opts.resize);

  return `${base}/storage/v1/render/image/public/${objectPath}?${params.toString()}`;
}

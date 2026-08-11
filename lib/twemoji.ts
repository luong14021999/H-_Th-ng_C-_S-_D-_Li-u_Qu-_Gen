const TWEMOJI_BASE = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg";

// Convert a single emoji (possibly multi-codepoint, e.g. ZWJ sequence) to the
// Twemoji filename used in its CDN, e.g. "🌾" -> "1f33e", "👨‍👩‍👧" -> "1f468-200d-1f469-200d-1f467".
// Per Twemoji convention the U+FE0F variation selector is stripped, except in a
// few specific keycap-like cases that we don't use here.
function emojiToCodepoints(emoji: string): string {
  const parts: string[] = [];
  for (const ch of emoji) {
    const cp = ch.codePointAt(0);
    if (cp === undefined) continue;
    if (cp === 0xfe0f) continue;
    parts.push(cp.toString(16));
  }
  return parts.join("-");
}

export function twemojiUrl(emoji: string): string {
  return `${TWEMOJI_BASE}/${emojiToCodepoints(emoji)}.svg`;
}

// emoji -> inlined data: URI. Populated by preloadTwemoji(). Using a same-origin
// data URI (instead of the cross-origin CDN URL) lets html2canvas capture the
// marker emojis when exporting the map to image/PDF — cross-origin SVGs render
// blank otherwise.
const dataUriCache = new Map<string, string>();

// Fetch each emoji's SVG once and store it as a data: URI. Safe to call repeatedly
// (cached) and on unknown emojis (failures are ignored → falls back to the CDN URL).
export async function preloadTwemoji(emojis: Iterable<string>): Promise<void> {
  const todo = [...new Set(emojis)].filter((e) => e && !dataUriCache.has(e));
  await Promise.all(
    todo.map(async (e) => {
      try {
        const res = await fetch(twemojiUrl(e));
        if (!res.ok) return;
        const svg = await res.text();
        dataUriCache.set(e, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
      } catch {
        /* leave uncached → falls back to CDN url */
      }
    })
  );
}

// The best available source for an emoji: the inlined data URI if preloaded,
// otherwise the CDN URL.
export function twemojiSrc(emoji: string): string {
  return dataUriCache.get(emoji) ?? twemojiUrl(emoji);
}

export function twemojiImgHtml(emoji: string, size = 22, extraStyle = ""): string {
  const url = twemojiSrc(emoji);
  return `<img src="${url}" alt="${emoji}" width="${size}" height="${size}" style="display:inline-block;vertical-align:middle;width:${size}px;height:${size}px;${extraStyle}" />`;
}

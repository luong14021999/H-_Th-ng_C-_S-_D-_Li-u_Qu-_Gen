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

export function twemojiImgHtml(emoji: string, size = 22, extraStyle = ""): string {
  const url = twemojiUrl(emoji);
  return `<img src="${url}" alt="${emoji}" width="${size}" height="${size}" style="display:inline-block;vertical-align:middle;width:${size}px;height:${size}px;${extraStyle}" />`;
}

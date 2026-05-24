import DOMPurify from "isomorphic-dompurify";

// Allow only safe inline formatting tags used by the rich-text editor.
// Strips <script>, on* event handlers, javascript: URLs, <iframe>, <object>, etc.
const ALLOWED_TAGS = [
  "b", "i", "u", "s", "em", "strong", "sub", "sup", "br", "span", "p", "div",
  "a", "ul", "ol", "li", "blockquote", "code",
];
const ALLOWED_ATTR = ["href", "title", "target", "rel", "style"];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    // Force external links to open safely.
    ADD_ATTR: ["target", "rel"],
  });
}

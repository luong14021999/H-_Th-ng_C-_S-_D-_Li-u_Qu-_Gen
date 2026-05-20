// Strip Vietnamese diacritics and lowercase so search can match
// "lua" -> "lúa", "duoc lieu" -> "Dược liệu", etc.
export function normalizeVi(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

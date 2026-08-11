import Link from "next/link";
import { CATEGORIES } from "@/data/nguonGen";

// The site's main crawlable sections — real <a href> links that let Google
// discover the structure (and can encourage sitelinks in search results).
export const SITE_SECTIONS: { href: string; label: string }[] = [
  { href: "/", label: "Bản đồ nguồn gen" },
  ...CATEGORIES.map((c) => ({ href: `/ban-do/${c.id.toLowerCase()}`, label: `Nguồn gen ${c.label}` })),
  { href: "/danh-muc-hien-trang", label: "Danh mục hiện trạng" },
];

export default function SiteNav({
  className = "",
  linkClassName = "",
}: {
  className?: string;
  linkClassName?: string;
}) {
  return (
    <nav aria-label="Chuyên mục" className={className}>
      {SITE_SECTIONS.map((s) => (
        <Link key={s.href} href={s.href} className={linkClassName}>
          {s.label}
        </Link>
      ))}
    </nav>
  );
}

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CATEGORIES } from "@/data/nguonGen";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "/",
    "/danh-muc-hien-trang",
    ...CATEGORIES.map((c) => `/ban-do/${c.id.toLowerCase()}`),
  ];
  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}

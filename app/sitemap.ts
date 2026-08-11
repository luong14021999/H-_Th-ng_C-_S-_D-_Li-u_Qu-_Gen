import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { supabaseAdmin } from "@/lib/supabase-server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Category map pages (/ban-do/*) are intentionally left out — the gene detail
  // pages are the SEO targets.
  const staticPaths = ["/", "/danh-muc-hien-trang"];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  // One detail page per gene record.
  try {
    const { data } = await supabaseAdmin.from("nguon_gen").select("ma, updated_at");
    for (const r of data ?? []) {
      entries.push({
        url: `${SITE_URL}/nguon-gen/${r.ma}`,
        lastModified: r.updated_at ? new Date(r.updated_at as string) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    /* DB unavailable at build — ship the static entries. */
  }

  return entries;
}

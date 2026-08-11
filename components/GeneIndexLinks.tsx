import Link from "next/link";
import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";

// All gene records (cached hourly) — used to render crawlable internal links to
// every gene detail page, so Google treats the gene pages as the site's key
// content.
const getGenes = unstable_cache(
  async (): Promise<{ ma: string; ten: string }[]> => {
    const { data } = await supabaseAdmin.from("nguon_gen").select("ma, ten").order("ma");
    return (data ?? []) as { ma: string; ten: string }[];
  },
  ["gene-index-links"],
  { revalidate: 3600 }
);

export default async function GeneIndexLinks({
  className = "",
  linkClassName = "",
}: {
  className?: string;
  linkClassName?: string;
}) {
  const genes = await getGenes();
  return (
    <nav aria-label="Danh sách nguồn gen" className={className}>
      {genes.map((g) => (
        <Link key={g.ma} href={`/nguon-gen/${g.ma}`} className={linkClassName}>
          {g.ten}
        </Link>
      ))}
    </nav>
  );
}

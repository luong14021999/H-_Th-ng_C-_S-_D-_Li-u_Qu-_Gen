import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { CATEGORY_MAP } from "@/data/nguonGen";
import { SITE_URL, SITE_NAME, ORG_NAME } from "@/lib/site";

// Pre-render every gene at build time; refresh hourly so edits/new records show.
export const revalidate = 3600;
export const dynamicParams = true;

type Params = { ma: string };

interface Gene {
  ma: string;
  ten: string;
  khoa_hoc: string;
  don_vi: string;
  phan_nhom: string;
  nhom: string;
  lat: number | null;
  lng: number | null;
}
interface Form1 {
  nguon_giao?: string;
  noi_thu_thap_tinh?: string;
  noi_thu_thap_huyen?: string;
  noi_thu_thap_xa?: string;
  dia_chi_chi_tiet?: string;
  mo_ta_thu_thap?: string;
  noi_phan_bo?: string;
  hinh_anh?: string[];
}

async function getGene(ma: string): Promise<{ gene: Gene; form1: Form1 | null } | null> {
  const { data: gene } = await supabaseAdmin
    .from("nguon_gen")
    .select("ma, ten, khoa_hoc, don_vi, phan_nhom, nhom, lat, lng")
    .eq("ma", ma)
    .maybeSingle();
  if (!gene) return null;
  const { data: form1 } = await supabaseAdmin
    .from("form1_data")
    .select("nguon_giao, noi_thu_thap_tinh, noi_thu_thap_huyen, noi_thu_thap_xa, dia_chi_chi_tiet, mo_ta_thu_thap, noi_phan_bo, hinh_anh")
    .eq("ma_nguon_gen", ma)
    .maybeSingle();
  return { gene: gene as Gene, form1: (form1 as Form1) ?? null };
}

async function getRelated(nhom: string, excludeMa: string): Promise<{ ma: string; ten: string }[]> {
  const { data } = await supabaseAdmin
    .from("nguon_gen")
    .select("ma, ten")
    .eq("nhom", nhom)
    .neq("ma", excludeMa)
    .limit(12);
  return (data ?? []) as { ma: string; ten: string }[];
}

export async function generateStaticParams(): Promise<Params[]> {
  const { data } = await supabaseAdmin.from("nguon_gen").select("ma");
  return (data ?? []).map((r) => ({ ma: r.ma as string }));
}

function buildDescription(gene: Gene, form1: Form1 | null): string {
  const cat = CATEGORY_MAP[gene.nhom]?.label ?? "";
  const parts = [
    gene.khoa_hoc && `Tên khoa học: ${gene.khoa_hoc}`,
    cat && `Nhóm: ${cat}`,
    gene.phan_nhom && `Phân nhóm: ${gene.phan_nhom}`,
    gene.don_vi && `Đơn vị: ${gene.don_vi}`,
    form1?.mo_ta_thu_thap,
  ].filter(Boolean);
  const s = parts.join(". ") || `Thông tin nguồn gen ${gene.ten} tỉnh Thanh Hóa.`;
  return s.length > 300 ? s.slice(0, 297) + "…" : s;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { ma } = await params;
  const res = await getGene(decodeURIComponent(ma));
  if (!res) return { title: "Không tìm thấy nguồn gen", robots: { index: false } };
  const { gene, form1 } = res;
  const description = buildDescription(gene, form1);
  const img = form1?.hinh_anh?.[0];
  return {
    title: `${gene.ten} (${gene.ma})`,
    description,
    alternates: { canonical: `/nguon-gen/${gene.ma}` },
    openGraph: {
      type: "article",
      title: `${gene.ten} — ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/nguon-gen/${gene.ma}`,
      images: img ? [{ url: img, alt: gene.ten }] : ["/logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: gene.ten,
      description,
      images: img ? [img] : ["/logo.png"],
    },
  };
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 py-2.5 border-b border-gray-100">
      <dt className="text-sm font-semibold text-gray-800">{label}</dt>
      <dd className="sm:col-span-2 text-sm text-gray-700 whitespace-pre-line">{value}</dd>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { ma } = await params;
  const res = await getGene(decodeURIComponent(ma));
  if (!res) notFound();
  const { gene, form1 } = res;
  const related = await getRelated(gene.nhom, gene.ma);
  const cat = CATEGORY_MAP[gene.nhom];
  const noiThuThap = [form1?.noi_thu_thap_xa, form1?.noi_thu_thap_huyen, form1?.noi_thu_thap_tinh]
    .filter(Boolean)
    .join(", ");
  const description = buildDescription(gene, form1);
  const img = form1?.hinh_anh?.[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: gene.ten,
    ...(gene.khoa_hoc ? { alternateName: gene.khoa_hoc } : {}),
    identifier: gene.ma,
    description,
    inLanguage: "vi-VN",
    keywords: [cat?.label, gene.phan_nhom, "nguồn gen", "quỹ gen", "Thanh Hóa"].filter(Boolean).join(", "),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: ORG_NAME, url: SITE_URL },
    ...(img ? { image: img } : {}),
    ...(gene.lat && gene.lng
      ? { spatialCoverage: { "@type": "Place", geo: { "@type": "GeoCoordinates", latitude: gene.lat, longitude: gene.lng } } }
      : {}),
  };

  return (
    <main className="h-dvh overflow-y-auto bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-green-700 text-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="text-green-100 hover:text-white text-sm">← Về bản đồ nguồn gen</Link>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">{gene.ten}</h1>
          <p className="text-green-100 text-sm mt-0.5">
            {gene.khoa_hoc && <em>{gene.khoa_hoc}</em>}
            <span className="font-mono ml-2 opacity-90">{gene.ma}</span>
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-6">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={gene.ten} className="w-full max-h-96 object-cover rounded-xl border border-gray-200 mb-6" />
        )}

        <dl className="bg-white rounded-xl border border-gray-200 px-4 divide-y divide-gray-100">
          <Row label="Tên Việt Nam" value={gene.ten} />
          <Row label="Tên khoa học" value={gene.khoa_hoc} />
          <Row label="Nhóm nguồn gen" value={cat ? `${cat.icon} ${cat.label}` : gene.nhom} />
          <Row label="Phân nhóm" value={gene.phan_nhom} />
          <Row label="Đơn vị" value={gene.don_vi} />
          <Row label="Người/cơ quan cung cấp giống" value={form1?.nguon_giao} />
          <Row label="Nơi thu thập" value={noiThuThap} />
          <Row label="Địa chỉ chi tiết" value={form1?.dia_chi_chi_tiet} />
          <Row label="Nơi phân bố/nuôi/trồng" value={form1?.noi_phan_bo} />
          <Row label="Mô tả" value={form1?.mo_ta_thu_thap} />
          {gene.lat != null && gene.lng != null && (
            <Row label="Toạ độ" value={`${gene.lat}, ${gene.lng}`} />
          )}
        </dl>

        {form1?.hinh_anh && form1.hinh_anh.length > 1 && (
          <div className="mt-6">
            <h2 className="font-semibold text-gray-800 mb-2">Hình ảnh</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {form1.hinh_anh.slice(1).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`${gene.ten} ${i + 2}`} className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-8">
          Nguồn: {ORG_NAME} — {SITE_NAME}.
        </p>
      </article>

      {related.length > 0 && (
        <footer className="border-t border-gray-200 bg-white mt-4">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Nguồn gen khác cùng nhóm {cat ? cat.label : ""}
            </p>
            <nav aria-label="Nguồn gen liên quan" className="flex flex-wrap gap-x-4 gap-y-2">
              {related.map((g) => (
                <Link key={g.ma} href={`/nguon-gen/${g.ma}`} className="text-sm text-green-700 hover:underline">
                  {g.ten}
                </Link>
              ))}
            </nav>
          </div>
        </footer>
      )}
    </main>
  );
}

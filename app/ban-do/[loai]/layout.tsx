import type { Metadata } from "next";
import { CATEGORY_MAP } from "@/data/nguonGen";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ loai: string }>;
}): Promise<Metadata> {
  const { loai } = await params;
  const cat = CATEGORY_MAP[loai.toUpperCase()];
  const label = cat?.label ?? "nguồn gen";
  const title = `Bản đồ nguồn gen ${label} tỉnh Thanh Hóa`;
  return {
    title,
    description: `Bản đồ phân bố và danh sách các nguồn gen ${label} của tỉnh Thanh Hóa: vị trí thu thập, thông tin bảo tồn và khai thác.`,
    alternates: { canonical: `/ban-do/${loai.toLowerCase()}` },
  };
}

export default function BanDoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

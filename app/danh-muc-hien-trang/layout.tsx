import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh mục hiện trạng bảo tồn, khai thác, sử dụng nguồn gen tỉnh Thanh Hóa",
  description:
    "Danh mục hiện trạng bảo tồn, khai thác và sử dụng nguồn gen cây trồng, vật nuôi, " +
    "thủy sản, lâm nghiệp, dược liệu, vi sinh vật của tỉnh Thanh Hóa.",
  alternates: { canonical: "/danh-muc-hien-trang" },
};

export default function DanhMucLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

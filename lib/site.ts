// Canonical site identity for SEO metadata (layout, sitemap, robots, manifest).
// Override the domain in production via NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nguongenviennongnghiepthanhhoa.vn"
).replace(/\/+$/, "");

export const SITE_NAME = "Hệ Thống Cơ Sở Dữ Liệu Quỹ Gen Tỉnh Thanh Hóa";

export const SITE_DESCRIPTION =
  "Cơ sở dữ liệu nguồn gen tỉnh Thanh Hóa: tra cứu, bản đồ phân bố và thông tin " +
  "bảo tồn, khai thác nguồn gen cây trồng, vật nuôi, thủy sản, lâm nghiệp, dược " +
  "liệu và vi sinh vật của tỉnh Thanh Hóa.";

export const ORG_NAME = "Viện Nông nghiệp Thanh Hóa";

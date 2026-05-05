import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hệ Thống Cơ Sở Dữ Liệu Quỹ Gen Tỉnh Thanh Hóa",
  description: "Cơ sở dữ liệu nguồn gen tỉnh Thanh Hóa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}

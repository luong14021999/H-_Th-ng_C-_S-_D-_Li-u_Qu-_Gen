import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hệ Thống Cơ Sở Dữ Liệu Quỹ Gen Tỉnh Thanh Hóa",
  description: "Cơ sở dữ liệu nguồn gen tỉnh Thanh Hóa",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-visual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-dvh">
      <body className="h-dvh overflow-hidden">{children}</body>
    </html>
  );
}

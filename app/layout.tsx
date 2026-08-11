import type { Metadata, Viewport } from "next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, ORG_NAME } from "@/lib/site";
import GeneIndexLinks from "@/components/GeneIndexLinks";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "nguồn gen", "quỹ gen", "Thanh Hóa", "cơ sở dữ liệu nguồn gen",
    "bảo tồn nguồn gen", "đa dạng sinh học", "cây trồng", "vật nuôi",
    "thủy sản", "dược liệu", "lâm nghiệp", "vi sinh vật",
    "bản đồ nguồn gen", ORG_NAME,
  ],
  authors: [{ name: ORG_NAME }],
  creator: ORG_NAME,
  publisher: ORG_NAME,
  category: "science",
  verification: {
    google: "Xr1eqorYk0BwFw7XbDm7wQK0BS72gOlo77baMdWLWDA",
  },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [{ url: "/logo.png", alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-visual",
  viewportFit: "cover",
  themeColor: "#15803d",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "vi-VN",
  publisher: {
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-dvh">
      <body className="h-dvh overflow-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Server-rendered primary heading for crawlers (the app UI is client-side). */}
        <h1 className="sr-only">{SITE_NAME}</h1>
        {/* Crawlable links to every gene detail page (visually hidden — the
            visible UI is client-side). Makes the gene pages the site's key
            indexable content. */}
        <GeneIndexLinks className="sr-only" />
        {children}
      </body>
    </html>
  );
}

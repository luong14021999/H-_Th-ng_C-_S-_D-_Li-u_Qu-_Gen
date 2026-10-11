import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      // Keep *.vercel.app (production alias + previews) reachable but out of
      // search results, so only the custom domain gets indexed. Crawling stays
      // allowed on purpose: Google must fetch a page to see the noindex.
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;

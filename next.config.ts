import type { NextConfig } from "next";

const LONG_CACHE = "public, max-age=31536000, immutable";
const DAY_CACHE = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: LONG_CACHE }],
      },
      {
        source: "/gallery/:path*",
        headers: [{ key: "Cache-Control", value: LONG_CACHE }],
      },
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: DAY_CACHE }],
      },
      {
        source: "/favicon.svg",
        headers: [{ key: "Cache-Control", value: DAY_CACHE }],
      },
      {
        source: "/favicon-96x96.png",
        headers: [{ key: "Cache-Control", value: DAY_CACHE }],
      },
      {
        source: "/apple-touch-icon.png",
        headers: [{ key: "Cache-Control", value: DAY_CACHE }],
      },
      {
        source: "/web-app-manifest-:size.png",
        headers: [{ key: "Cache-Control", value: DAY_CACHE }],
      },
      {
        source: "/logo.png",
        headers: [{ key: "Cache-Control", value: DAY_CACHE }],
      },
      {
        source: "/og.jpg",
        headers: [{ key: "Cache-Control", value: DAY_CACHE }],
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const studioUrl =
  process.env.NEXT_PUBLIC_STUDIO_URL?.replace(/\/$/, "") ??
  process.env.STUDIO_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "react-icons"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  async redirects() {
    if (!studioUrl) {
      return [];
    }

    return [
      {
        source: "/studio",
        destination: studioUrl,
        permanent: false,
      },
      {
        source: "/studio/:path*",
        destination: `${studioUrl}/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

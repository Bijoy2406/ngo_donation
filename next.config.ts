import type { NextConfig } from "next";

const studioUrl =
  process.env.NEXT_PUBLIC_STUDIO_URL?.replace(/\/$/, "") ??
  process.env.STUDIO_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  images: {
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

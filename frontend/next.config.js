/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force same-origin API even if Easypanel overrides the Dockerfile build arg.
  env: {
    NEXT_PUBLIC_API_BASE_URL: "/api",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://mysanad.shop",
    // Always true — Easypanel was passing "false" at build time and stripping all pixel code.
    NEXT_PUBLIC_ENABLE_PIXELS: "true",
    NEXT_PUBLIC_SNAP_PIXEL_ID:
      process.env.NEXT_PUBLIC_SNAP_PIXEL_ID || "b2c14550-2acd-4339-a864-2a764ab9b418",
    NEXT_PUBLIC_META_PIXEL_ID:
      process.env.NEXT_PUBLIC_META_PIXEL_ID || "860397819486779",
    NEXT_PUBLIC_TIKTOK_PIXEL_ID:
      process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "D8M0REBC77UCVEHVMJQG",
  },
  output: "standalone",
  images: {
    domains: ["mysanad.shop"],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/dashbord", destination: "/admin", permanent: true },
      { source: "/dashboard", destination: "/admin", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

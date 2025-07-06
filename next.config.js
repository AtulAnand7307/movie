/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // ✅ Updated experimental config
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    // Remove appDir: true as it's no longer needed in Next.js 14
  },
  // ✅ Fix for Prisma on Vercel
  webpack: (config) => {
    config.externals = [...config.externals, { '@prisma/client': '@prisma/client' }];
    return config;
  },
  // ✅ Dynamic API routes configuration
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { 
            key: "Cache-Control", 
            value: "no-store, max-age=0" 
          },
        ],
      },
    ];
  },
  // ✅ Disable static optimization for API routes
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

module.exports = nextConfig;
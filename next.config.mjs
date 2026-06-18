/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,

  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },

  compiler: {
    removeConsole: true,
  },

  images: {
    // AVIF first (40% smaller than WebP), fallback WebP
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images 60 days
    minimumCacheTTL: 5184000,
    // Only generate sizes we actually use
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [320, 480, 640, 800],
    // No domains needed (local /public only)
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,

  compiler: {
    removeConsole: true,
  },

  images: {
    // Serve AVIF first (smallest), fallback to WebP
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 30 days
    minimumCacheTTL: 2592000,
    // Device widths for responsive srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384],
  },

  // Trim unused locales from bundle
  i18n: undefined,

  // Enable HTTP/2 server push hints
  experimental: {
    optimizeCss: false, // requires critters — disable if not installed
  },
};

export default nextConfig;

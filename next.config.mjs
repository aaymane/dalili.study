/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove X-Powered-By header
  poweredByHeader: false,

  // Compress responses with gzip/brotli
  compress: true,

  // Prefer modern image formats (avif → webp → original)
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Compiler options — drop console.* in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;

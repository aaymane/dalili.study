/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove X-Powered-By header
  poweredByHeader: false,

  // Compress responses (gzip/brotli) — default is already true, explicit for clarity
  compress: true,

  // Strip console.* from client bundles in production
  compiler: {
    removeConsole: true,
  },
};

export default nextConfig;

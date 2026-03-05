/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Optimizaciones de build
  swcMinify: true, // Usa SWC (Rust) para minify
  compress: true, // Gzip compression

  // Reduce bundle size
  productionBrowserSourceMaps: false,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // SSG - Static Site Generation
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Optimizaciones de build
  compress: true,
  productionBrowserSourceMaps: false,

  // Trailing slash para Cloudflare Pages
  trailingSlash: true,
};

export default nextConfig;

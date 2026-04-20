
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  assetPrefix: './',
  reactStrictMode: false,
  // Tắt các tính năng gây chèn mã inline script
  productionBrowserSourceMaps: false,
  optimizeFonts: false,
};

export default nextConfig;

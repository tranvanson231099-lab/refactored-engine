
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
  // Tắt React Strict Mode để giảm thiểu script inline phát sinh trong bản build
  reactStrictMode: false,
  // Đảm bảo không có mã HMR/Dev server nào lọt vào bản build out
  productionBrowserSourceMaps: false,
};

export default nextConfig;

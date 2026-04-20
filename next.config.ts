
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
  // Tắt React Strict Mode để giảm thiểu các script tự động chèn của Next.js
  reactStrictMode: false,
};

export default nextConfig;

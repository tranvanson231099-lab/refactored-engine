
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
  // Đảm bảo đường dẫn tương đối để chạy được trong Chrome Extension
  trailingSlash: false,
  assetPrefix: './',
};

export default nextConfig;

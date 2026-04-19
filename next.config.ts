
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
  // Tắt dấu gạch chéo cuối để tránh lỗi đường dẫn trong Chrome Extension
  trailingSlash: false,
};

export default nextConfig;

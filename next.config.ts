
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
  // Quan trọng: Tắt trailingSlash để các tệp .html không bị cho vào thư mục con
  trailingSlash: false,
  // Đảm bảo không có script inline nào được sinh ra thêm
  reactStrictMode: false,
};

export default nextConfig;

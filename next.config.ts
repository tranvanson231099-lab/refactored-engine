
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
  // Tắt trailingSlash để tệp tin được xuất ra chuẩn index.html
  trailingSlash: false,
  // Cực kỳ quan trọng: Vô hiệu hóa mã inline của Next.js
  reactStrictMode: false,
  // Đảm bảo đường dẫn tài nguyên là tương đối
  assetPrefix: './',
};

export default nextConfig;

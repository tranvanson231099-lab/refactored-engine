
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
  // Tắt trailingSlash để tránh tạo thư mục dư thừa cho mỗi trang
  trailingSlash: false,
  // Cực kỳ quan trọng: Sử dụng đường dẫn tương đối để Chrome Extension tìm được file JS/CSS
  assetPrefix: './',
};

export default nextConfig;


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
  // Quan trọng: Phải để false để tránh tạo thư mục lồng nhau gây sai đường dẫn trong Extension
  trailingSlash: false,
};

export default nextConfig;

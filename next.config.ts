import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GAP_API_USERNAME: process.env.GAP_API_USERNAME,
    GAP_API_PASSWORD: process.env.GAP_API_PASSWORD,
    GAP_SELLER_NODE_CODE: process.env.GAP_SELLER_NODE_CODE,
  },
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  /* config options here */
};

export default nextConfig;

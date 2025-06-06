import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GAP_API_USERNAME: process.env.GAP_API_USERNAME,
    GAP_API_PASSWORD: process.env.GAP_API_PASSWORD,
    GAP_SELLER_NODE_CODE: process.env.GAP_SELLER_NODE_CODE,
  },
  /* config options here */
};

export default nextConfig;

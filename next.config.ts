import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NIE umieszczaj sekretów w `env` next.config, bo Next wstrzykuje je do bundle (ryzyko wycieku).
  // Używaj `process.env.*` po stronie serwera (Route Handlers) oraz `NEXT_PUBLIC_*` wyłącznie dla wartości jawnych na kliencie.
  // Turbopack potrafi błędnie wykryć workspace root przy wielu lockfile'ach — ustawiamy jawnie root na katalog aplikacji.
  turbopack: {
    root: __dirname,
  },
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGINS || 'https://gapauto.pl',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

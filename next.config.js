/** @type {import('next').NextConfig} */
const nextConfig = {
  // Trigger Rebuild: 2026-02-10 22:30
  // Permitir imágenes externas
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Rewrites for Local Development (proxies /api to backend port 8000)
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev) return [];

    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/docs',
        destination: 'http://localhost:8000/docs',
      },
      {
        source: '/openapi.json',
        destination: 'http://localhost:8000/openapi.json',
      }
    ]
  },
};

module.exports = nextConfig;

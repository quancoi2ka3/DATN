/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'https://localhost:5001',
  },  images: {
    remotePatterns: [
      // HTTPS patterns for port 5001
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5001',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
      // HTTP patterns for port 5001 (fallback)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
      // HTTP patterns for port 5000 (legacy support)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
  },async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:5001/api/:path*', // Use your backend HTTPS port
      },
    ];
  },
}

module.exports = nextConfig
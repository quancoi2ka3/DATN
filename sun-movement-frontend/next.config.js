/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // Basic optimizations
  experimental: {
    optimizeCss: true,
    // Removed esmExternals for Turbopack compatibility
    serverComponentsExternalPackages: [], // Prevent external package issues
  },
  
  // Optimize loading
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Webpack configuration to fix chunk loading (only for non-Turbopack builds)
  webpack: (config, { isServer, dev }) => {
    // Skip webpack customization if using Turbopack
    if (process.env.NEXT_RUNTIME === 'turbopack') {
      return config;
    }
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Only apply chunk optimization in development
    if (dev) {
      // Optimize chunk splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              priority: 20,
              chunks: 'all',
            },
          },
        },
      };
      
      // Set publicPath to fix chunk loading
      config.output = {
        ...config.output,
        publicPath: '/_next/',
      };
    }
    
    return config;
  },
  
  // Add development server configuration
  devIndicators: {
    buildActivity: false,
  },
  
  // Optimize for development
  ...(process.env.NODE_ENV === 'development' && {
    swcMinify: false,
    optimizeFonts: false,
  }),
  
  // Output configuration for better stability
  output: 'standalone',
  
  // Environment variables
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000',
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5001',
        pathname: '/images/**',
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
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5001',
        pathname: '/**',
      },
    ],
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
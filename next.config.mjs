/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add output tracing for better error reporting
  output: 'standalone',
  // Suppress webpack warnings about missing SWC packages
  webpack: (config, { isServer }) => {
    // Suppress warnings about missing optional dependencies
    config.infrastructureLogging = {
      level: 'error',
    };
    
    // Handle server-side specific configurations
    if (isServer) {
      // Ensure proper handling of optional dependencies
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }
    
    return config;
  },
  // Add experimental features for better Vercel compatibility
  experimental: {
    // Enable server actions
    serverActions: true,
    // Optimize package imports
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-*'
    ]
  }
}

export default nextConfig
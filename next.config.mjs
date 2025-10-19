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
  // Suppress webpack warnings about missing SWC packages
  webpack: (config, { isServer }) => {
    // Suppress warnings about missing optional dependencies
    config.infrastructureLogging = {
      level: 'error',
    };
    
    return config;
  },
}

export default nextConfig
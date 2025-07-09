import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable static generation for dynamic pages
  experimental: {
    // This helps with build issues on platforms like Render
    workerThreads: false,
    cpus: 1,
  },
  // Configure output for better compatibility
  output: 'standalone',
};

export default nextConfig;

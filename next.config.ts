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
  // Environment variables for client side
  env: {
    // Add any environment variables you want to expose to the client
    // These will be available as process.env.NEXT_PUBLIC_* on the client
    CUSTOM_ENV: process.env.CUSTOM_ENV,
  },
};

export default nextConfig;

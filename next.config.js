/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default_key',
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Handle pg (PostgreSQL) package for server-side
      config.externals = config.externals || [];
      config.externals.push('pg');
      config.externals.push('pg-hstore');
      
      // Add fallback for node modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
        path: false,
        os: false,
        url: false,
        querystring: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        constants: false,
        events: false,
        punycode: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        vm: false,
        domain: false,
        dns: false,
        dgram: false,
        child_process: false,
        cluster: false,
        module: false,
        global: false,
        console: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig 
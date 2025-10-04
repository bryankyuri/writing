/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable React Compiler due to large data files causing compilation timeouts
  // experimental: {
  //   reactCompiler: true,
  // },
  
  // Optimize image loading to prevent unnecessary preloads
  images: {
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },

  // Webpack configuration to fix framer-motion bundling issues
  webpack: (config, { isServer }) => {
    // Fix for framer-motion with Next.js 15
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // Ensure proper handling of ES modules
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    return config;
  },
};

export default nextConfig;

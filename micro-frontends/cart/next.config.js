/* eslint-disable @typescript-eslint/no-var-requires */
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  eslint: {
    dirs: ['pages', 'common', 'modules', 'styles'],
  },
  images: {
    domains: ['images.unsplash.com', 'i.dummyjson.com', 'loremflickr.com'],
  },
  webpack(config) {
    Object.assign(config.experiments, { topLevelAwait: true });

    config.plugins.push(
      new NextFederationPlugin({
        name: 'cart',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './CartDrawer': './common/components/CartDrawerWrapped',
        },
        shared: [
          '@tanstack/react-query',
          '@tanstack/query-core',
          '@chakra-ui/react',
          '@emotion/react',
          '@emotion/styled',
          'framer-motion',
        ],
      })
    );

    return config;
  },
};

module.exports = nextConfig;

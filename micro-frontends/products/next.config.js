/* eslint-disable @typescript-eslint/no-var-requires */
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  // basePath: '/products',
  eslint: {
    dirs: ['pages', 'common', 'modules', 'styles'],
  },
  images: {
    domains: ['images.unsplash.com', 'i.dummyjson.com', 'loremflickr.com'],
  },
  webpack(config, options) {
    Object.assign(config.experiments, { topLevelAwait: true });

    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'products',
          filename: 'static/chunks/remoteEntry.js',
          remotes: {
            // TODO: Extract to an env var
            // '@mfe/cart': 'cart@http://localhost:3000/remoteEntry.js',
          },
          exposes: {
            './ProductCard': './modules/product/components/ProductCard',
          },
          // shared,
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;

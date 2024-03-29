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
  redirects: async () => [
    {
      source: '/categories/:path*',
      destination: `${process.env.NEXT_PUBLIC_CATEGORIES_HOST}/categories/:path*`,
      permanent: true,
    },
  ],
  webpack(config, options) {
    Object.assign(config.experiments, { topLevelAwait: true });

    const { isServer } = options;
    const suffix = `_next/static/${isServer ? 'ssr' : 'chunks'}/remoteEntry.js`;

    config.plugins.push(
      new NextFederationPlugin({
        name: 'products',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          '@mfe/cart': `cart@${process.env.NEXT_PUBLIC_CART_HOST}/${suffix}`,
        },
        exposes: {
          './ProductCard': './modules/product/components/ProductCard',
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;

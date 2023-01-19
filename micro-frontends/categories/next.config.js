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
  redirects: async () => [
    {
      source: '/products/:path*',
      destination: `${process.env.NEXT_PUBLIC_PRODUCTS_HOST}/products/:path*`,
      permanent: true,
    },
  ],
  webpack(config, options) {
    Object.assign(config.experiments, { topLevelAwait: true });

    const { isServer } = options;
    const suffix = `_next/static/${isServer ? 'ssr' : 'chunks'}/remoteEntry.js`;

    config.plugins.push(
      new NextFederationPlugin({
        name: 'categories',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          // TODO: Extract to an env var
          '@mfe/cart': `cart@${process.env.NEXT_PUBLIC_CART_HOST}/${suffix}`,
          '@mfe/products': `products@${process.env.NEXT_PUBLIC_PRODUCTS_HOST}/${suffix}`,
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

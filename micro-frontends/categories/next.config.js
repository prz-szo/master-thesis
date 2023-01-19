/* eslint-disable @typescript-eslint/no-var-requires */
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');
const deps = require('./package.json').dependencies;

const shared = {
  react: { singleton: true, eager: true, requiredVersion: deps.react },
  'react-dom': {
    singleton: true,
    requiredVersion: deps['react-dom'],
  },

  '@tanstack/react-query': {
    singleton: true,
    requiredVersion: deps['@tanstack/react-query'],
  },

  '@chakra-ui/react': {
    singleton: true,
    requiredVersion: deps['@chakra-ui/react'],
  },
  '@emotion/react': {
    singleton: true,
    requiredVersion: deps['@emotion/react'],
  },
  '@emotion/styled': {
    singleton: true,
    requiredVersion: deps['@emotion/styled'],
  },
  'framer-motion': {
    singleton: true,
    requiredVersion: deps['framer-motion'],
  },
};

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
  webpack(config, options) {
    Object.assign(config.experiments, { topLevelAwait: true });

    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: 'categories',
        filename: 'static/chunks/remoteEntry.js',
        remotes: {
          // TODO: Extract to an env var
          '@mfe/cart': 'cart@http://localhost:3002/remoteEntry.js',
          '@mfe/products': `products@http://localhost:3001/_next/static/${
            isServer ? 'ssr' : 'chunks'
          }/remoteEntry.js`,
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;

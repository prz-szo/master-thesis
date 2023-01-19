const { ModuleFederationPlugin } = require('webpack').container;

const deps = require('./package.json').dependencies;

const shared = {
  react: {
    singleton: true,
    requiredVersion: deps['react'],
  },
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

/** @type {import('@craco/types').CracoConfig} */
const cracoConfig = {
  webpack: {
    configure: (config) => ({
      ...config,
      output: {
        publicPath: 'auto',
      },
    }),
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: 'cart',
          filename: 'remoteEntry.js',
          exposes: {
            './CartDrawer': './src/components/CartDrawer',
          },
          shared: {
            '@tanstack/react-query': {
              singleton: true,
              requiredVersion: deps['@tanstack/react-query'],
            },
          },
        }),
      ],
    },
  },
};

module.exports = cracoConfig;

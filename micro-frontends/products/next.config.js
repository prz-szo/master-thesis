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
};

module.exports = nextConfig;

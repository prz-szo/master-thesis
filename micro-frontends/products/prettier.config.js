/** @type {import('prettier').Config} */
module.exports = {
  trailingComma: 'es5',
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  semi: true,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  pluginSearchDirs: false,
};

import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

const extensions = ['.ts', '.tsx'];

export default {
  input: './src/App.tsx',
  output: {
    file: 'dist/widget.mjs',
    format: 'es',
  },
  external: [],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({ extensions }),
    babel({
      exclude: 'node_modules/**',
      presets: ['solid', '@babel/preset-typescript'],
      extensions,
    }),
    postcss({
      plugins: [
        autoprefixer(),
        tailwindcss({
          content: ['./src/**/*.tsx'],
        })
      ],
      extract: true,
      modules: false,
      autoModules: false,
      minimize: true,
      inject: false,
    }),
    terser({ output: { comments: false } }),
  ],
};

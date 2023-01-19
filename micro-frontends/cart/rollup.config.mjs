import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';


const extensions = ['.ts', '.tsx'];

export default {
  input: './common/components/AddToCartButton/export-to-wc.ts',

  output: {
    file: 'dist/mfe-cart/static/js/widget.mjs',
    format: 'es',
  },
  external: [],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({ extensions }),
    // babel({
    //   exclude: 'node_modules/**',
    //   presets: ['@babel/preset-react', '@babel/preset-typescript'],
    //   extensions,
    // }),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    terser(),
  ],
};

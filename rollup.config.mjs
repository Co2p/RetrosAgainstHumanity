import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/js/main.js',
  output: {
    file: 'static/main.min.js',
    format: 'iife',
    assetFileNames: '[name][extname]',
    plugins: [
      terser(),
    ]
  },
  plugins: [
    json({ compact: true }),
    scss({
      name: 'main.min.css',
      failOnError: true,
      runtime: import("sass"),
      outputStyle: "compressed",
    }),
    commonjs(),
    nodeResolve()],
};
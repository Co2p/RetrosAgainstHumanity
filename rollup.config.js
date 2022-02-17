import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import scss from 'rollup-plugin-scss';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/js/main.js',
  output: {
    file: 'static/js/main.min.js',
    format: 'cjs',
    plugins: [
      terser(),
    ]
  },
  plugins: [
    json({ compact: true }),
    scss({
      output: "static/css/main.min.css",
      failOnError: true,
      runtime: require("sass"),
      outputStyle: "compressed",
    }),
    commonjs(),
    nodeResolve()],
};
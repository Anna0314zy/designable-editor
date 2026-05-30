import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import path from 'path';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import packageConfig  from './package.json'
import nodePolyfills from 'rollup-plugin-node-polyfills';
import babel from '@rollup/plugin-babel';
import htmlTemplate from 'rollup-plugin-generate-html-template';



const env = dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });
export default {
  input: './src/main.ts',
  output: {
    file: `dist/${packageConfig.version}/mcc-index.js`,
    format: 'umd',
    sourcemap: true
  },
  external: [],
  plugins: [
    typescript(),
    nodeResolve({ jsnext: true, preferBuiltins: true, browser: true, extensions: ['.js', '.ts'], }),
    commonjs(),
    babel({
        presets: [
          ['@babel/preset-env', { targets: "> 0.25%, not dead" }]
        ],
        plugins: ['@babel/plugin-proposal-optional-chaining'],
    }),
    json({
      compact: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env.parsed.NODE_ENV),
    }),
    postcss(),
    nodePolyfills(),
    htmlTemplate({
      template: 'src/template.html',
      target: 'index.html',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};

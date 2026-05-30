import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import esbuild from 'rollup-plugin-esbuild'
import legacy from '@vitejs/plugin-legacy'
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [viteCommonjs({}),react(),{
    ...esbuild({
      target: 'chrome70',
      // 如有需要可以在这里加 js ts 之类的其他后缀
      include: /\.vue|\.js|.ts|.tsx$/,
      exclude: /node_modules/,
      loaders: {
        '.vue': 'js',
        '.ts': 'js',
        '.tsx': 'js'
      },
    }),
    enforce: 'post',
  }, legacy({
    targets: ['> 0%'],
    additionalLegacyPolyfills: ['regenerator-runtime/runtime']
  }),
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),],
  server: {
    port: 9001,
    host: '0.0.0.0'
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      }
    }
  }
})

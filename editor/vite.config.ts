import { defineConfig } from 'vite'
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";
import packageJson from './package.json';
import { resolve } from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    strictPort: true,
    port: 5175,
    proxy: {
      // 当请求匹配这个路径前缀时，将请求转发到目标服务器
      '/api': {
        target: "http://localhost:5177",
        // target: "http://8.141.7.113:5177",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist/' + packageJson.version,
    rollupOptions: {
      input: {
        index: resolve(__dirname, './index.html'),
        slide: resolve(__dirname, './slide.html'),
      },
    },
  },
  envDir:"env",
  plugins: [
    VitePWA({
      injectRegister: "auto",
      registerType: "autoUpdate",
      manifest: false,
      filename: `sw.${packageJson.version}.js`,
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ["**/*.{js,css}"],
        globIgnores: ["**/node_modules/**/*", "workbox-*.js"],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(woff|ttf|woff2)/, // 图片缓存
            handler: "CacheFirst",
            options: {
              cacheName: "fonts-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    viteCommonjs({}),
    basicSsl(),
    react()
  ]
})

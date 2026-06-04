import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import basicSsl from '@vitejs/plugin-basic-ssl'
import packageJson from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist/' + packageJson.version,
  },
  plugins: [react(),basicSsl()],
  envDir:"env",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src")
    }
  },
  server: {
    strictPort: true,
    port: 5176,
    proxy: {
      "/api": {
        target: "http://8.141.7.113:5177",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/test": {
        target: "",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/test/, ""),
      },
    },
  },
})

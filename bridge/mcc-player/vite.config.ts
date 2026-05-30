import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
import path from 'path';
import packageConfig  from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server:{
    strictPort: true,
    port: 5173,
    host: '0.0.0.0'
  },
  plugins: [
  ],
  build: {
    assetsDir: 'mcc-assets',
    outDir: `dist/${packageConfig.version}`,
    minify: false,
    sourcemap: true,
    rollupOptions: {
      manualChunks: {},
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})

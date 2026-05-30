import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  envDir:"env",
  server: {
    host: '0.0.0.0'
  },
  build: {
    sourcemap: true,
    minify: false,
  }
})

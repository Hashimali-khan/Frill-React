import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), svgr(),tailwindcss()],
  resolve: {
    alias: {
      // import Button from '@/components/atoms/Button'
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // Proxy API calls in dev so CORS is not an issue
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Code-split Fabric.js into its own chunk (heavy: ~500KB)
    rollupOptions: {
      output: {
        manualChunks: {
          'fabric':  ['fabric'],
          'redux':   ['@reduxjs/toolkit', 'react-redux'],
          'framer':  ['framer-motion'],
        },
      },
    },
  },
})
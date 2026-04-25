import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
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
        manualChunks(id) {
          if (id.includes('/node_modules/fabric/') || id.includes('\\node_modules\\fabric\\')) {
            return 'fabric'
          }

          if (
            id.includes('/node_modules/@reduxjs/toolkit/') ||
            id.includes('\\node_modules\\@reduxjs\\toolkit\\') ||
            id.includes('/node_modules/react-redux/') ||
            id.includes('\\node_modules\\react-redux\\')
          ) {
            return 'redux'
          }

          if (id.includes('/node_modules/framer-motion/') || id.includes('\\node_modules\\framer-motion\\')) {
            return 'framer'
          }
        },
      },
    },
  },
})
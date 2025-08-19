import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Simple setup—remove path alias relying on Node globals to avoid type issues in Netlify build
  build: {
  // Netlify will publish the "build" directory (see netlify.toml)
  outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animation: ['framer-motion'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
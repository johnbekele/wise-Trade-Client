import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detect if running in Docker
const isDocker = process.env.DOCKER_ENV === 'true' || process.env.IN_DOCKER === 'true'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: isDocker ? '0.0.0.0' : 'localhost', // Listen on all interfaces in Docker, localhost locally
    port: 3000,
    watch: {
      usePolling: isDocker, // Only use polling in Docker
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || (isDocker ? 'http://backend:8001' : 'http://localhost:8000'),
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})


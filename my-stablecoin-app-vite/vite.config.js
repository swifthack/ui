import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://35.240.210.229:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

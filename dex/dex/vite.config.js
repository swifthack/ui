import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://34.87.19.64:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const outgoingPath = proxyReq.path || proxyReq._path || req.url;
            const fullPath = `${options.target}${outgoingPath}`;
            console.log(`[PROXY][REQ] ${req.method} ${req.url}  -> ${fullPath}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const fullPath = `${options.target}${req.url}`;
            console.log(`[PROXY][RES] ${req.method} ${req.url} <- ${fullPath} [status: ${proxyRes.statusCode}]`);
          });
        },
      },
    },
   
      
  },
});

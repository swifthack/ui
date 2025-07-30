import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      
      '/api1': {
        // Place rewrite as the first property
        rewrite: (path) => {
          console.log("rewrite called with path:", path);
          const rewritten = path.replace(/^\/api1/, '');
          console.log(`[PROXY][REWRITE] incoming: ${path} -> rewritten: ${rewritten}`);
          return rewritten;
        },
        target: 'http://34.87.19.64:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          console.log('[PROXY][STARTUP] /api1 proxy config loaded');
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const outgoingPath = proxyReq.path || proxyReq._path || req.url;
            console.log(`[PROXY][REQ] ${req.method} original: ${req.url} | outgoing: ${outgoingPath}`);
            const fullPath = `${options.target}${outgoingPath}`;
            console.log(`[PROXY][REQ] ${req.method} ${req.url} -> ${fullPath}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const fullPath = `${options.target}${req.url}`;
            console.log(`[PROXY][RES] ${req.method} ${req.url} <- ${fullPath} [status: ${proxyRes.statusCode}]`);
          });
        },
      },
      '/api': {
        target: 'http://34.87.19.64:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            const outgoingPath = proxyReq.path || proxyReq._path || req.url;
            const fullPath = `${options.target}${outgoingPath}`;
            console.log(`[PROXY][REQ] ${req.method} ${req.url} -> ${fullPath}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const fullPath = `${options.target}${req.url}`;
            console.log(`[PROXY][RES] ${req.method} ${req.url} <- ${fullPath} [status: ${proxyRes.statusCode}]`);
          });
        },
      },
    },
  },
})

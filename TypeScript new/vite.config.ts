import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function translationsPlugin(): Plugin {
  return {
    name: 'translations-backend-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/api\/v1\/translations\/([^/]+)\/([^/?#]+)/);
        if (match) {
          const [, lng, nsRaw] = match;
          const ns = nsRaw.replace(/\.json$/, '');
          const filePath = path.resolve(process.cwd(), 'src/locales', lng, `${ns}.json`);
          if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(data);
            return;
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/api\/v1\/translations\/([^/]+)\/([^/?#]+)/);
        if (match) {
          const [, lng, nsRaw] = match;
          const ns = nsRaw.replace(/\.json$/, '');
          const filePath = path.resolve(process.cwd(), 'src/locales', lng, `${ns}.json`);
          if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(data);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    translationsPlugin(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://api-service.fintechhub.uz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        bypass: (req) => {
          if (req.url && req.url.startsWith('/api/v1/translations')) {
            return req.url;
          }
        },
      },
    },
  },
});

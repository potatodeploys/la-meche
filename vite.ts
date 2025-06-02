
import { ViteDevServer } from "vite";
import express from "express";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function setupVite(app: express.Express, server: any) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}

export function serveStatic(app: express.Express) {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile(resolve(__dirname, 'dist', 'index.html'));
  });
}

export function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

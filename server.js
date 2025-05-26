import fs from 'node:fs/promises';
import hpp from 'hpp';
// import xss from 'xss-clean';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { adminRoutes, appRoutes, featureRequestRoutes } from './src/server/routes/_index.js';
import { globalErrorHandler } from './src/server/middlewares/error.js';
import { HttpError } from './src/server/utils/_index.js';

// Load environment variables
dotenv.config();

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction ? await fs.readFile('./dist/client/index.html', 'utf-8') : '';
const ssrManifest = isProduction ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8') : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

// Allow CORS
app.use(cors());

// Use trust proxy
// app.set('trust proxy', true);

// Limit requests from the same IP
app.use(
  '/api',
  rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP. Please try again in an hour',
    handler: (_req, _res, next) => {
      next(new HttpError(429, 'Too many requests from this IP. Please try again in an hour.'));
    },
  })
);

// Parse json data from request body
app.use(bodyParser.json({ limit: '512kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// // Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Import API routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/app', appRoutes);
app.use('/api/v1/feature-request', featureRequestRoutes);

// Error handling
app.use(globalErrorHandler);

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/client/entry-server.jsx')).render;
    } else {
      template = templateHtml;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    const rendered = await render(url, ssrManifest);

    const html = template
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    // console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});


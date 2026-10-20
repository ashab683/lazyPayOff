import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRouter from './routes/health.js';
import aiRouter from './routes/ai.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup - allows local frontend requests
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parser with 1mb limit
app.use(express.json({ limit: '1mb' }));

// API Routes
app.use('/api', healthRouter);
app.use('/api/ai', aiRouter);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    ok: false,
    code: 'ROUTE_NOT_FOUND',
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handler
app.use(errorHandler);

// Only listen when executed directly as entrypoint, not during test imports
const currentFile = fileURLToPath(import.meta.url);
const isDirectlyExecuted = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile);

if (isDirectlyExecuted) {
  app.listen(PORT, () => {
    console.log(`🦥 The Lazy Payoff API server running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   AI status:    http://localhost:${PORT}/api/ai/status`);
  });
}

export default app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import grievanceRoutes from './04_routes/grievanceRoutes.js';
import { checkOllamaHealth } from './01_config/ollamaConfig.js';
import { getDbStatus } from './01_config/dbConfig.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware configuration
app.use(cors());
// 100mb body limit to allow dual high-res base64 images
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Mount Municipal Grievance API Routes
app.use('/api', grievanceRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'CivicEye-Agent',
    title: 'Dual-Language Multimodal Municipal Action Engine',
    hackathon: 'Hacktoberfest 2026 (DigitalOcean Best Open-Source AI Project & Best Use of Gemma 4)',
    status: 'ACTIVE',
    endpoints: {
      health: '/api/health',
      analyze: 'POST /api/analyze',
      grievances: '/api/grievances',
      tools: '/api/tools'
    },
    documentation: 'https://github.com/your-username/civiceye-agent'
  });
});

// Global Express error handler middleware
app.use((err, req, res, next) => {
  console.error('[Express Global Error]:', err.stack || err.message || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Process-level crash prevention guards
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception Guard]:', err.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection Guard]:', reason?.message || reason);
});

// Start listening
const server = app.listen(PORT, HOST, async () => {
  console.log('================================================================');
  console.log('🏛️  CIVICEYE-AGENT: DUAL-LANGUAGE MUNICIPAL ACTION ENGINE');
  console.log('🏆 Built for Hacktoberfest 2026 (DigitalOcean & Best Use of Gemma 4)');
  console.log(`🚀 Server listening on: http://${HOST}:${PORT}`);
  console.log('================================================================');

  // Async health check on startup
  try {
    const ollamaStatus = await checkOllamaHealth();
    const dbStatus = getDbStatus();

    if (ollamaStatus.isOnline) {
      console.log(`🟢 Local Ollama: Online at ${ollamaStatus.host} (Models: ${ollamaStatus.availableModels.join(', ') || 'None'})`);
    } else {
      console.log(`🟡 Local Ollama: ${ollamaStatus.message}`);
    }
    console.log(`💾 Database: ${dbStatus.storageType} (${dbStatus.totalRecords} initial records loaded)`);
    console.log('----------------------------------------------------------------');
  } catch (err) {
    console.warn('Startup diagnostic warning:', err.message);
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

export default app;

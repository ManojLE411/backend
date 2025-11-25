/**
 * Server Entry Point
 * Starts the Express server and connects to MongoDB
 */

/// <reference path="./types/express.d.ts" />
import app from './app';
import database from './config/database';
import env from './config/env';
import logger from './utils/logger';

const PORT = env.PORT || 5000;

// Start server
async function startServer() {
  try {
    // Connect to database
    await database.connect();

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🌐 API Base URL: ${env.API_BASE_URL}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

// Start the server
startServer();


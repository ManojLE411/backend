/**
 * MongoDB Database Connection
 * Handles connection to MongoDB using Mongoose
 */

import mongoose from 'mongoose';
import env from './env';
import logger from '../utils/logger';

class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('Database already connected');
      return;
    }

    try {
      const mongoUri = env.NODE_ENV === 'production' && env.MONGODB_URI_PROD
        ? env.MONGODB_URI_PROD
        : env.MONGODB_URI;

      await mongoose.connect(mongoUri, {
        // Mongoose 6+ options
      });

      this.isConnected = true;
      logger.info('✅ MongoDB connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
        this.isConnected = true;
      });
    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB disconnected');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

export default Database.getInstance();


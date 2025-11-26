/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */

/// <reference path="./types/express.d.ts" />
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import env from './config/env';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import path from 'path';

const app: Express = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // List of allowed origins
      const allowedOrigins: string[] = [];
      
      // Add configured CORS_ORIGIN
      if (env.CORS_ORIGIN) {
        // Support comma-separated list of origins
        const origins = env.CORS_ORIGIN.split(',').map(o => o.trim());
        allowedOrigins.push(...origins);
      }
      
      // In development, allow all localhost origins
      if (env.NODE_ENV === 'development') {
        // Allow any localhost or 127.0.0.1 with any port
        if (
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:')
        ) {
          return callback(null, true);
        }
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Log rejected origin for debugging
      console.warn(`CORS: Origin "${origin}" not allowed. Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting - Disabled in development, enabled in production
if (env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again later.',
      },
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip rate limiting for health checks
    skip: (req) => req.path === '/health',
  });

  app.use('/api/', limiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_PATH)));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;


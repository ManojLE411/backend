/**
 * Environment Variables Configuration
 * Validates and exports all environment variables
 */

import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().int().positive()).default('5000'),
  API_BASE_URL: z.string().url().optional().default('http://localhost:5000'),

  // MongoDB
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_URI_PROD: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).pipe(z.number().int().positive()).default('5242880'),
  UPLOAD_PATH: z.string().default('./uploads'),

  // Email (Optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // CORS - In development, multiple origins are allowed (see app.ts)
  // In production, only this origin will be allowed
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),

  // Admin Registration
  ADMIN_REGISTRATION_KEY: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export default env;


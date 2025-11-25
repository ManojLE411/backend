/**
 * Validation Middleware
 * Request validation using Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Validate request body
 */
export const validateBody = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(new ValidationError('Validation failed', details));
      } else {
        next(new ValidationError('Invalid request data'));
      }
    }
  };
};

/**
 * Validate request query parameters
 */
export const validateQuery = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(new ValidationError('Query validation failed', details));
      } else {
        next(new ValidationError('Invalid query parameters'));
      }
    }
  };
};

/**
 * Validate request params
 */
export const validateParams = <T extends z.ZodTypeAny>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(new ValidationError('Parameter validation failed', details));
      } else {
        next(new ValidationError('Invalid route parameters'));
      }
    }
  };
};


/**
 * Error Handling Middleware
 * Global error handler for Express
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import { ApiError } from '../types/common.types';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle known AppError
  if (err instanceof AppError) {
    const errorResponse: ApiError = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    };

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Handle unknown errors
  const errorResponse: ApiError = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  res.status(500).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const errorResponse: ApiError = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  };

  res.status(404).json(errorResponse);
};


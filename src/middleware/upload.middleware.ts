/**
 * Upload Middleware
 * File upload error handling
 */

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ValidationError } from '../utils/errors';

/**
 * Handle multer errors
 */
export const handleUploadError = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new ValidationError('File size exceeds maximum allowed size (5MB)'));
      return;
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      next(new ValidationError('Too many files uploaded'));
      return;
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      next(new ValidationError('Unexpected file field'));
      return;
    }
    next(new ValidationError(`Upload error: ${err.message}`));
    return;
  }

  if (err.message.includes('Invalid file type')) {
    next(new ValidationError(err.message));
    return;
  }

  next(err);
};


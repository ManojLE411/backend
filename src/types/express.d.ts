/**
 * Express Type Extensions
 * Add custom properties to Express Request
 */

import { RequestUser } from './common.types';

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export {};


/**
 * Authentication Middleware
 * JWT token verification and user extraction
 */

import { Request, Response, NextFunction } from 'express';
import jwtConfig from '../config/jwt';
import { UnauthorizedError } from '../utils/errors';

/**
 * Extract token from Authorization header
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError('Authentication token required');
    }

    const payload = jwtConfig.verifyToken(token);
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof Error && error.message.includes('expired')) {
      next(new UnauthorizedError('Token expired'));
    } else if (error instanceof Error && error.message.includes('Invalid')) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(new UnauthorizedError('Authentication failed'));
    }
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't require it
 */
export const optionalAuthenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (token) {
      const payload = jwtConfig.verifyToken(token);
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};


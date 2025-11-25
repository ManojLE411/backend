/**
 * Role-Based Access Control Middleware
 * Restricts access based on user roles
 */

import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';
import { UserRole } from '../types/common.types';
import { User } from '../models/User.model';

/**
 * Require admin role
 */
export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    next(new UnauthorizedError('Authentication required'));
    return;
  }

  if (req.user.role !== 'admin') {
    next(new ForbiddenError('Admin access required'));
    return;
  }

  next();
};

/**
 * Require student role
 */
export const requireStudent = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    next(new UnauthorizedError('Authentication required'));
    return;
  }

  if (req.user.role !== 'student') {
    next(new ForbiddenError('Student access required'));
    return;
  }

  next();
};

/**
 * Require any authenticated user (student or admin)
 */
export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    next(new UnauthorizedError('Authentication required'));
    return;
  }

  next();
};

/**
 * Allow specific roles
 */
export const allowRoles = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError(`Access restricted to: ${roles.join(', ')}`));
      return;
    }

    next();
  };
};

/**
 * Require admin OR allow if no admin exists (for first admin registration)
 */
export const requireAdminOrAllowFirst = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  // If user is authenticated and is admin, allow
  if (req.user && req.user.role === 'admin') {
    next();
    return;
  }

  // If no user, check if any admin exists
  const adminCount = await User.countDocuments({ role: 'admin' });
  
  // If no admin exists, allow (first admin registration)
  if (adminCount === 0) {
    next();
    return;
  }

  // If admin exists but user is not authenticated or not admin, deny
  if (!req.user) {
    next(new UnauthorizedError('Authentication required'));
    return;
  }

  next(new ForbiddenError('Admin access required'));
};


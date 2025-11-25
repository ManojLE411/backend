/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { ApiResponse } from '../types/common.types';
import { AuthResponse } from '../types/auth.types';
import { z } from 'zod';

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
});

class AuthController {
  /**
   * Student login
   * POST /api/auth/login
   */
  async studentLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials = loginSchema.parse(req.body);
      const response = await authService.studentLogin(credentials);

      const apiResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: response,
        message: 'Login successful',
      };

      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin login
   * POST /api/auth/admin/login
   */
  async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials = loginSchema.parse(req.body);
      const response = await authService.adminLogin(credentials);

      const apiResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: response,
        message: 'Admin login successful',
      };

      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Student registration
   * POST /api/auth/register
   */
  async studentRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = registerSchema.parse(req.body);
      const response = await authService.studentRegister(data);

      const apiResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: response,
        message: 'Registration successful',
      };

      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin registration
   * POST /api/auth/admin/register
   */
  async adminRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = registerSchema.parse(req.body);
      const existingAdminId = req.user?.userId; // If called by existing admin
      const response = await authService.adminRegister(data, existingAdminId);

      const apiResponse: ApiResponse<AuthResponse> = {
        success: true,
        data: response,
        message: 'Admin registration successful',
      };

      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user
   * GET /api/auth/me
   */
  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new Error('User not found in request');
      }

      const user = await authService.getCurrentUser(req.user.userId);
      const userObj = user.toJSON();

      const apiResponse: ApiResponse<typeof userObj> = {
        success: true,
        data: userObj,
      };

      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   * PATCH /api/auth/profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new Error('User not found in request');
      }

      const updates = updateProfileSchema.parse(req.body);
      const user = await authService.updateProfile(req.user.userId, updates);
      const userObj = user.toJSON();

      const apiResponse: ApiResponse<typeof userObj> = {
        success: true,
        data: userObj,
        message: 'Profile updated successfully',
      };

      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh token
   * POST /api/auth/refresh
   */
  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new Error('User not found in request');
      }

      const tokenData = await authService.refreshToken(req.user.userId);

      const apiResponse: ApiResponse<typeof tokenData> = {
        success: true,
        data: tokenData,
        message: 'Token refreshed successfully',
      };

      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout
   * POST /api/auth/logout
   */
  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a stateless JWT system, logout is handled client-side
      // But we can log it for audit purposes
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Logged out successfully' },
      };

      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();


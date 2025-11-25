/**
 * User Controller
 * Admin-only user management
 */

import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { ApiResponse } from '../types/common.types';
import { z } from 'zod';

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
  enrolledPrograms: z.array(z.string()).optional(),
});

class UserController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.getAll(req.query as any);
      const apiResponse: ApiResponse<typeof result.data> = {
        success: true,
        data: result.data,
      };
      (apiResponse as any).pagination = result.pagination;
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getById(req.params.id);
      const userObj = user.toJSON();      const apiResponse: ApiResponse<typeof userObj> = {
        success: true,
        data: userObj,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updates = userUpdateSchema.parse(req.body);
      const user = await userService.update(req.params.id, updates);
      const userObj = user.toJSON();      const apiResponse: ApiResponse<typeof userObj> = {
        success: true,
        data: userObj,
        message: 'User updated successfully',
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.delete(req.params.id);
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'User deleted successfully' },
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();


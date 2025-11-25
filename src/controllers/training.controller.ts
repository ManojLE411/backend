/**
 * Training Controller
 */

import { Request, Response, NextFunction } from 'express';
import trainingService from '../services/training.service';
import { ApiResponse } from '../types/common.types';
import { z } from 'zod';

export const trainingSchema = z.object({
  title: z.string().min(1),
  category: z.enum(['Institutional', 'Corporate', 'Other']),
  description: z.string().min(1),
  features: z.array(z.string()),
  icon: z.string().optional(),
});

class TrainingController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const programs = await trainingService.getAll();
      const apiResponse: ApiResponse<typeof programs> = {
        success: true,
        data: programs,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const program = await trainingService.getById(req.params.id);
      const programObj = program.toJSON();      const apiResponse: ApiResponse<typeof programObj> = {
        success: true,
        data: programObj,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = trainingSchema.parse(req.body);
      const program = await trainingService.create(data);
      const programObj = program.toJSON();      const apiResponse: ApiResponse<typeof programObj> = {
        success: true,
        data: programObj,
        message: 'Training program created successfully',
      };
      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = trainingSchema.partial().parse(req.body);
      const program = await trainingService.update(req.params.id, data);
      const programObj = program.toJSON();      const apiResponse: ApiResponse<typeof programObj> = {
        success: true,
        data: programObj,
        message: 'Training program updated successfully',
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await trainingService.delete(req.params.id);
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Training program deleted successfully' },
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new TrainingController();


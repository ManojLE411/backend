/**
 * Service Controller
 */

import { Request, Response, NextFunction } from 'express';
import serviceService from '../services/service.service';
import { ApiResponse } from '../types/common.types';
import { z } from 'zod';

export const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.string()),
  icon: z.string().min(1),
  image: z.string().optional(),
});

class ServiceController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await serviceService.getAll();
      const apiResponse: ApiResponse<typeof services> = {
        success: true,
        data: services,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const service = await serviceService.getById(req.params.id);
      const serviceObj = service.toJSON();      const apiResponse: ApiResponse<typeof serviceObj> = {
        success: true,
        data: serviceObj,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = serviceSchema.parse(req.body);
      const service = await serviceService.create(data);
      const serviceObj = service.toJSON();      const apiResponse: ApiResponse<typeof serviceObj> = {
        success: true,
        data: serviceObj,
        message: 'Service created successfully',
      };
      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = serviceSchema.partial().parse(req.body);
      const service = await serviceService.update(req.params.id, data);
      const serviceObj = service.toJSON();      const apiResponse: ApiResponse<typeof serviceObj> = {
        success: true,
        data: serviceObj,
        message: 'Service updated successfully',
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await serviceService.delete(req.params.id);
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Service deleted successfully' },
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new ServiceController();


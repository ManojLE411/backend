/**
 * Testimonial Controller
 */

import { Request, Response, NextFunction } from 'express';
import testimonialService from '../services/testimonial.service';
import { ApiResponse } from '../types/common.types';
import { z } from 'zod';

export const testimonialSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  quote: z.string().min(1),
  avatar: z.string().optional(),
});

class TestimonialController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonials = await testimonialService.getAll();
      const apiResponse: ApiResponse<typeof testimonials> = {
        success: true,
        data: testimonials,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonial = await testimonialService.getById(req.params.id);
      const testimonialObj = testimonial.toJSON();      const apiResponse: ApiResponse<typeof testimonialObj> = {
        success: true,
        data: testimonialObj,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = testimonialSchema.parse(req.body);
      const testimonial = await testimonialService.create(data, req.file);
      const testimonialObj = testimonial.toJSON();      const apiResponse: ApiResponse<typeof testimonialObj> = {
        success: true,
        data: testimonialObj,
        message: 'Testimonial created successfully',
      };
      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = testimonialSchema.partial().parse(req.body);
      const testimonial = await testimonialService.update(req.params.id, data, req.file);
      const testimonialObj = testimonial.toJSON();      const apiResponse: ApiResponse<typeof testimonialObj> = {
        success: true,
        data: testimonialObj,
        message: 'Testimonial updated successfully',
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await testimonialService.delete(req.params.id);
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Testimonial deleted successfully' },
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new TestimonialController();


/**
 * Contact Controller
 */

import { Request, Response, NextFunction } from 'express';
import contactService from '../services/contact.service';
import { ApiResponse } from '../types/common.types';
import { z } from 'zod';

export const contactSubmitSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  mobile: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
});

class ContactController {
  async submitMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = contactSubmitSchema.parse(req.body);
      const message = await contactService.submitMessage(data);
      const messageObj = message.toJSON();
      const apiResponse: ApiResponse<typeof messageObj> = {
        success: true,
        data: messageObj,
        message: 'Message submitted successfully',
      };
      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await contactService.getAll(req.query as any);
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
      const message = await contactService.getById(req.params.id);
      const messageObj = message.toJSON();
      const apiResponse: ApiResponse<typeof messageObj> = {
        success: true,
        data: messageObj,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = z.object({ status: z.enum(['New', 'Read', 'Replied']) }).parse(req.body);
      const message = await contactService.updateStatus(req.params.id, status);
      const messageObj = message.toJSON();
      const apiResponse: ApiResponse<typeof messageObj> = {
        success: true,
        data: messageObj,
        message: 'Message status updated successfully',
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await contactService.delete(req.params.id);
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Message deleted successfully' },
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new ContactController();


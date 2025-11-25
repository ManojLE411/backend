/**
 * Internship Controller
 */

import { Request, Response, NextFunction } from 'express';
import internshipService from '../services/internship.service';
import { ApiResponse } from '../types/common.types';
import { z } from 'zod';

export const internshipSchema = z.object({
  title: z.string().min(1),
  duration: z.string().min(1),
  mode: z.enum(['Online', 'Offline', 'Hybrid']),
  skills: z.array(z.string()),
  description: z.string().min(1),
  image: z.string().min(1),
});

export const applicationSchema = z.object({
  internshipId: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  course: z.string().min(1),
  message: z.string().min(1),
  studentId: z.string().optional(),
});

class InternshipController {
  async getAllTracks(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tracks = await internshipService.getAllTracks();
      const apiResponse: ApiResponse<typeof tracks> = {
        success: true,
        data: tracks,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getTrackById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const track = await internshipService.getTrackById(req.params.id);
      const trackObj = track.toJSON();      const apiResponse: ApiResponse<typeof trackObj> = {
        success: true,
        data: trackObj,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async createTrack(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = internshipSchema.parse(req.body);
      const track = await internshipService.createTrack(data);
      const trackObj = track.toJSON();      const apiResponse: ApiResponse<typeof trackObj> = {
        success: true,
        data: trackObj,
        message: 'Internship track created successfully',
      };
      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async updateTrack(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = internshipSchema.partial().parse(req.body);
      const track = await internshipService.updateTrack(req.params.id, data);
      const trackObj = track.toJSON();      const apiResponse: ApiResponse<typeof trackObj> = {
        success: true,
        data: trackObj,
        message: 'Internship track updated successfully',
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async deleteTrack(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await internshipService.deleteTrack(req.params.id);
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Internship track deleted successfully' },
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getAllApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await internshipService.getAllApplications(req.query as any);
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

  async createApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedData = applicationSchema.parse(req.body);
      const data: any = {
        ...parsedData,
        internshipId: parsedData.internshipId, // Will be converted by Mongoose
        studentId: parsedData.studentId, // Will be converted by Mongoose
      };
      const file = req.file;
      const application = await internshipService.createApplication(data, file);
      const applicationObj = application.toJSON();      const apiResponse: ApiResponse<typeof applicationObj> = {
        success: true,
        data: applicationObj,
        message: 'Application submitted successfully',
      };
      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async updateApplicationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = z.object({ status: z.enum(['Pending', 'Approved', 'Rejected']) }).parse(req.body);
      const application = await internshipService.updateApplicationStatus(req.params.id, status);
      const applicationObj = application.toJSON();      const apiResponse: ApiResponse<typeof applicationObj> = {
        success: true,
        data: applicationObj,
        message: 'Application status updated successfully',
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async deleteApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await internshipService.deleteApplication(req.params.id);
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Application deleted successfully' },
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new InternshipController();


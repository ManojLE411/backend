/**
 * Job Controller
 */

import { Request, Response, NextFunction } from 'express';
import jobService from '../services/job.service';
import { ApiResponse } from '../types/common.types';
import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1),
  department: z.string().min(1),
  type: z.enum(['Full-time', 'Part-time', 'Contract']),
  location: z.enum(['Remote', 'On-site', 'Hybrid']),
  description: z.string().optional(),
});

export const jobApplicationSchema = z.object({
  jobId: z.string(),
  jobTitle: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  coverLetter: z.string().optional(),
  userId: z.string().optional(),
});

class JobController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobs = await jobService.getAll();
      const apiResponse: ApiResponse<typeof jobs> = {
        success: true,
        data: jobs,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await jobService.getById(req.params.id);
      const jobObj = job.toJSON();      const apiResponse: ApiResponse<typeof jobObj> = {
        success: true,
        data: jobObj,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = jobSchema.parse(req.body);
      const job = await jobService.create(data);
      const jobObj = job.toJSON();      const apiResponse: ApiResponse<typeof jobObj> = {
        success: true,
        data: jobObj,
        message: 'Job created successfully',
      };
      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = jobSchema.partial().parse(req.body);
      const job = await jobService.update(req.params.id, data);
      const jobObj = job.toJSON();      const apiResponse: ApiResponse<typeof jobObj> = {
        success: true,
        data: jobObj,
        message: 'Job updated successfully',
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await jobService.delete(req.params.id);
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Job deleted successfully' },
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getAllApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await jobService.getAllApplications(req.query as any);
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
      const parsedData = jobApplicationSchema.parse(req.body);
      const data: any = {
        ...parsedData,
        jobId: parsedData.jobId, // Will be converted by Mongoose
        userId: parsedData.userId, // Will be converted by Mongoose
      };
      const file = req.file;
      const application = await jobService.createApplication(data, file);
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
      const application = await jobService.updateApplicationStatus(req.params.id, status);
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
      await jobService.deleteApplication(req.params.id);
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

export default new JobController();


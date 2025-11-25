/**
 * Project Controller
 */

import { Request, Response, NextFunction } from 'express';
import projectService from '../services/project.service';
import { ApiResponse } from '../types/common.types';
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1),
  category: z.enum(['AI/ML', 'Web', 'VLSI', 'IoT', 'Data Science']),
  description: z.string().min(1),
  techStack: z.array(z.string()),
  image: z.string().optional(),
});

class ProjectController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projects = await projectService.getAll();
      const apiResponse: ApiResponse<typeof projects> = {
        success: true,
        data: projects,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.getById(req.params.id);
      const projectObj = project.toJSON();      const apiResponse: ApiResponse<typeof projectObj> = {
        success: true,
        data: projectObj,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = projectSchema.parse(req.body);
      const project = await projectService.create(data, req.file);
      const projectObj = project.toJSON();      const apiResponse: ApiResponse<typeof projectObj> = {
        success: true,
        data: projectObj,
        message: 'Project created successfully',
      };
      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = projectSchema.partial().parse(req.body);
      const project = await projectService.update(req.params.id, data, req.file);
      const projectObj = project.toJSON();      const apiResponse: ApiResponse<typeof projectObj> = {
        success: true,
        data: projectObj,
        message: 'Project updated successfully',
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await projectService.delete(req.params.id);
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Project deleted successfully' },
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();


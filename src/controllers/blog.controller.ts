/**
 * Blog Controller
 * Handles blog-related HTTP requests
 */

import { Request, Response, NextFunction } from 'express';
import blogService from '../services/blog.service';
import { ApiResponse } from '../types/common.types';
import { z } from 'zod';

export const blogCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().min(1, 'Image is required'),
  date: z.string().optional(),
});

export const blogUpdateSchema = blogCreateSchema.partial();

class BlogController {
  /**
   * Get all blog posts
   * GET /api/blog
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await blogService.getAll(req.query as any);

      const apiResponse: ApiResponse<any[]> = {
        success: true,
        data: result.data,
        message: 'Blog posts retrieved successfully',
      };

      // Add pagination info
      (apiResponse as any).pagination = result.pagination;

      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get blog post by ID
   * GET /api/blog/:id
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await blogService.getById(req.params.id);
      const postObj = post.toJSON();

      const apiResponse: ApiResponse<typeof postObj> = {
        success: true,
        data: postObj,
      };

      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create blog post
   * POST /api/blog
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedData = blogCreateSchema.parse(req.body);
      const data = {
        ...parsedData,
        date: parsedData.date ? new Date(parsedData.date) : new Date(),
      };
      const post = await blogService.create(data);
      const postObj = post.toJSON();

      const apiResponse: ApiResponse<typeof postObj> = {
        success: true,
        data: postObj,
        message: 'Blog post created successfully',
      };

      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update blog post
   * PUT /api/blog/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedData = blogUpdateSchema.parse(req.body);
      const data: any = { ...parsedData };
      if (parsedData.date) {
        data.date = new Date(parsedData.date);
      }
      const post = await blogService.update(req.params.id, data);
      const postObj = post.toJSON();

      const apiResponse: ApiResponse<typeof postObj> = {
        success: true,
        data: postObj,
        message: 'Blog post updated successfully',
      };

      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete blog post
   * DELETE /api/blog/:id
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await blogService.delete(req.params.id);

      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Blog post deleted successfully' },
      };

      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new BlogController();


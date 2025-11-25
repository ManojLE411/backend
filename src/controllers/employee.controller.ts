/**
 * Employee Controller
 */

import { Request, Response, NextFunction } from 'express';
import employeeService from '../services/employee.service';
import { ApiResponse } from '../types/common.types';
import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  summary: z.string().min(1),
  skills: z.array(z.string()),
  image: z.string().optional(),
});

class EmployeeController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employees = await employeeService.getAll();
      const apiResponse: ApiResponse<typeof employees> = {
        success: true,
        data: employees,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employee = await employeeService.getById(req.params.id);
      const employeeObj = employee.toJSON();
      const apiResponse: ApiResponse<typeof employeeObj> = {
        success: true,
        data: employeeObj,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = employeeSchema.parse(req.body);
      const employee = await employeeService.create(data, req.file);
      const employeeObj = employee.toJSON();
      const apiResponse: ApiResponse<typeof employeeObj> = {
        success: true,
        data: employeeObj,
        message: 'Employee created successfully',
      };
      res.status(201).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = employeeSchema.partial().parse(req.body);
      const employee = await employeeService.update(req.params.id, data, req.file);
      const employeeObj = employee.toJSON();
      const apiResponse: ApiResponse<typeof employeeObj> = {
        success: true,
        data: employeeObj,
        message: 'Employee updated successfully',
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await employeeService.delete(req.params.id);
      const apiResponse: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Employee deleted successfully' },
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new EmployeeController();


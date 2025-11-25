/**
 * Employee Service
 * Business logic for employees
 */

import { Employee, IEmployee } from '../models/Employee.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { isValidObjectId } from '../utils/helpers';
import logger from '../utils/logger';
import fs from 'fs';

class EmployeeService {
  async getAll(): Promise<IEmployee[]> {
    const employees = await Employee.find().sort({ createdAt: -1 }).lean() as any;
    // Transform _id to id for lean documents (toJSON transform doesn't apply to lean())
    return employees.map((employee: any) => ({
      ...employee,
      id: employee._id.toString(),
      _id: undefined,
      __v: undefined,
    }));
  }

  async getById(id: string): Promise<IEmployee> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid employee ID format');
    }
    const employee = await Employee.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee');
    }
    return employee;
  }

  async create(data: Partial<IEmployee>, file?: Express.Multer.File): Promise<IEmployee> {
    if (file) {
      data.image = file.path;
    }

    const employee = new Employee(data);
    await employee.save();
    logger.info(`Employee created: ${employee.name}`);
    return employee;
  }

  async update(
    id: string,
    data: Partial<IEmployee>,
    file?: Express.Multer.File
  ): Promise<IEmployee> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid employee ID format');
    }
    const existing = await Employee.findById(id);
    if (!existing) {
      throw new NotFoundError('Employee');
    }

    // Delete old image if new one is uploaded
    if (file && existing.image && fs.existsSync(existing.image)) {
      try {
        fs.unlinkSync(existing.image);
      } catch (error) {
        logger.warn(`Failed to delete old image: ${existing.image}`);
      }
    }

    if (file) {
      data.image = file.path;
    }

    const employee = await Employee.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      throw new NotFoundError('Employee');
    }

    logger.info(`Employee updated: ${employee.name}`);
    return employee;
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid employee ID format');
    }
    const employee = await Employee.findById(id);
    if (!employee) {
      throw new NotFoundError('Employee');
    }

    // Delete image file
    if (employee.image && fs.existsSync(employee.image)) {
      try {
        fs.unlinkSync(employee.image);
      } catch (error) {
        logger.warn(`Failed to delete image: ${employee.image}`);
      }
    }

    await Employee.findByIdAndDelete(id);
    logger.info(`Employee deleted: ${employee.name}`);
  }
}

export default new EmployeeService();


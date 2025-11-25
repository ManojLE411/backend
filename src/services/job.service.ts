/**
 * Job Service
 * Business logic for jobs and applications
 */

import { Job, IJob } from '../models/Job.model';
import { JobApplication, IJobApplication } from '../models/JobApplication.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { isValidObjectId } from '../utils/helpers';
import { parsePagination } from '../utils/pagination';
import logger from '../utils/logger';
import fs from 'fs';

class JobService {
  async getAll(): Promise<IJob[]> {
    const jobs = await Job.find().sort({ createdAt: -1 }).lean() as any;
    // Transform _id to id for lean documents (toJSON transform doesn't apply to lean())
    return jobs.map((job: any) => ({
      ...job,
      id: job._id.toString(),
      _id: undefined,
      __v: undefined,
    }));
  }

  async getById(id: string): Promise<IJob> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid job ID format');
    }
    const job = await Job.findById(id);
    if (!job) {
      throw new NotFoundError('Job');
    }
    return job;
  }

  async create(data: Partial<IJob>): Promise<IJob> {
    const job = new Job(data);
    await job.save();
    logger.info(`Job created: ${job.title}`);
    return job;
  }

  async update(id: string, data: Partial<IJob>): Promise<IJob> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid job ID format');
    }
    const job = await Job.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      throw new NotFoundError('Job');
    }
    logger.info(`Job updated: ${job.title}`);
    return job;
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid job ID format');
    }
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      throw new NotFoundError('Job');
    }
    logger.info(`Job deleted: ${job.title}`);
  }

  async getAllApplications(query: { page?: string; pageSize?: string }) {
    const { page, pageSize } = parsePagination(query);
    const skip = (page - 1) * pageSize;

    try {
      const [applications, total] = await Promise.all([
        JobApplication.find()
          .populate({
            path: 'jobId',
            select: 'title department',
            model: 'Job',
          })
          .sort({ date: -1, createdAt: -1 })
          .skip(skip)
          .limit(pageSize)
          .lean(),
        JobApplication.countDocuments(),
      ]);

      // Transform the data to ensure proper formatting
      const transformedApplications = applications.map((app: any) => {
        const result: any = { ...app };
        result.id = app._id ? app._id.toString() : app.id;
        
        // Handle populated jobId
        if (app.jobId) {
          if (typeof app.jobId === 'object' && app.jobId !== null) {
            result.jobId = app.jobId._id ? app.jobId._id.toString() : app.jobId.toString();
            result.jobTitle = app.jobId.title || null;
            result.jobDepartment = app.jobId.department || null;
          } else {
            result.jobId = app.jobId.toString();
          }
        }
        
        // Handle userId
        if (app.userId) {
          result.userId = typeof app.userId === 'object' 
            ? (app.userId._id ? app.userId._id.toString() : app.userId.toString())
            : app.userId.toString();
        }
        
        // Clean up MongoDB-specific fields
        if (result._id) delete result._id;
        if (result.__v !== undefined) delete result.__v;
        
        return result;
      });

      return {
        data: transformedApplications as any,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    } catch (error) {
      logger.error('Error fetching job applications:', error);
      throw error;
    }
  }

  async createApplication(
    data: Partial<IJobApplication>,
    file?: Express.Multer.File
  ): Promise<IJobApplication> {
    if (!file) {
      throw new Error('Resume file is required');
    }

    const application = new JobApplication({
      ...data,
      resumeName: file.originalname,
      resumePath: file.path,
    });

    await application.save();
    logger.info(`Job application created: ${application.email}`);
    return application;
  }

  async updateApplicationStatus(
    id: string,
    status: 'Pending' | 'Approved' | 'Rejected'
  ): Promise<IJobApplication> {
    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      throw new NotFoundError('Job application');
    }

    logger.info(`Job application status updated: ${id} -> ${status}`);
    return application;
  }

  async deleteApplication(id: string): Promise<void> {
    const application = await JobApplication.findById(id);

    if (!application) {
      throw new NotFoundError('Job application');
    }

    // Delete resume file
    if (application.resumePath && fs.existsSync(application.resumePath)) {
      try {
        fs.unlinkSync(application.resumePath);
      } catch (error) {
        logger.warn(`Failed to delete resume file: ${application.resumePath}`);
      }
    }

    await JobApplication.findByIdAndDelete(id);
    logger.info(`Job application deleted: ${id}`);
  }
}

export default new JobService();


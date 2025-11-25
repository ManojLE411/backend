/**
 * Internship Service
 * Business logic for internships and applications
 */

import { Internship, IInternship } from '../models/Internship.model';
import {
  InternshipApplication,
  IInternshipApplication,
} from '../models/InternshipApplication.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { isValidObjectId } from '../utils/helpers';
import { parsePagination } from '../utils/pagination';
import logger from '../utils/logger';
import fs from 'fs';

class InternshipService {
  async getAllTracks(): Promise<IInternship[]> {
    const tracks = await Internship.find().sort({ createdAt: -1 }).lean() as any;
    // Transform _id to id for lean documents (toJSON transform doesn't apply to lean())
    return tracks.map((track: any) => ({
      ...track,
      id: track._id.toString(),
      _id: undefined,
      __v: undefined,
    }));
  }

  async getTrackById(id: string): Promise<IInternship> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid internship track ID format');
    }
    const track = await Internship.findById(id);
    if (!track) {
      throw new NotFoundError('Internship track');
    }
    return track;
  }

  async createTrack(data: Partial<IInternship>): Promise<IInternship> {
    const track = new Internship(data);
    await track.save();
    logger.info(`Internship track created: ${track.title}`);
    return track;
  }

  async updateTrack(id: string, data: Partial<IInternship>): Promise<IInternship> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid internship track ID format');
    }
    const track = await Internship.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!track) {
      throw new NotFoundError('Internship track');
    }
    logger.info(`Internship track updated: ${track.title}`);
    return track;
  }

  async deleteTrack(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid internship track ID format');
    }
    const track = await Internship.findByIdAndDelete(id);
    if (!track) {
      throw new NotFoundError('Internship track');
    }
    logger.info(`Internship track deleted: ${track.title}`);
  }

  async getAllApplications(query: { page?: string; pageSize?: string }): Promise<{
    data: IInternshipApplication[];
    pagination: any;
  }> {
    const { page, pageSize } = parsePagination(query);
    const skip = (page - 1) * pageSize;

    try {
      const [applications, total] = await Promise.all([
        InternshipApplication.find()
          .populate({
            path: 'internshipId',
            select: 'title',
            model: 'Internship',
          })
          .sort({ date: -1, createdAt: -1 })
          .skip(skip)
          .limit(pageSize)
          .lean(),
        InternshipApplication.countDocuments(),
      ]);

      // Transform the data to ensure proper formatting
      const transformedApplications = applications.map((app: any) => {
        const result: any = { ...app };
        result.id = app._id ? app._id.toString() : app.id;
        
        // Handle populated internshipId
        if (app.internshipId) {
          if (typeof app.internshipId === 'object' && app.internshipId !== null) {
            result.internshipId = app.internshipId._id ? app.internshipId._id.toString() : app.internshipId.toString();
            result.internshipTitle = app.internshipId.title || null;
          } else {
            result.internshipId = app.internshipId.toString();
          }
        }
        
        // Handle studentId
        if (app.studentId) {
          result.studentId = typeof app.studentId === 'object' 
            ? (app.studentId._id ? app.studentId._id.toString() : app.studentId.toString())
            : app.studentId.toString();
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
      logger.error('Error fetching internship applications:', error);
      throw error;
    }
  }

  async createApplication(
    data: Partial<IInternshipApplication>,
    file?: Express.Multer.File
  ): Promise<IInternshipApplication> {
    if (!file) {
      throw new Error('Resume file is required');
    }

    const application = new InternshipApplication({
      ...data,
      resumeName: file.originalname,
      resumePath: file.path,
    });

    await application.save();
    logger.info(`Internship application created: ${application.email}`);
    return application;
  }

  async updateApplicationStatus(
    id: string,
    status: 'Pending' | 'Approved' | 'Rejected'
  ): Promise<IInternshipApplication> {
    const application = await InternshipApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      throw new NotFoundError('Internship application');
    }

    logger.info(`Internship application status updated: ${id} -> ${status}`);
    return application;
  }

  async deleteApplication(id: string): Promise<void> {
    const application = await InternshipApplication.findById(id);

    if (!application) {
      throw new NotFoundError('Internship application');
    }

    // Delete resume file
    if (application.resumePath && fs.existsSync(application.resumePath)) {
      try {
        fs.unlinkSync(application.resumePath);
      } catch (error) {
        logger.warn(`Failed to delete resume file: ${application.resumePath}`);
      }
    }

    await InternshipApplication.findByIdAndDelete(id);
    logger.info(`Internship application deleted: ${id}`);
  }
}

export default new InternshipService();


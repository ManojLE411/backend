/**
 * Project Service
 * Business logic for projects
 */

import { Project, IProject } from '../models/Project.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { isValidObjectId } from '../utils/helpers';
import logger from '../utils/logger';
import fs from 'fs';

class ProjectService {
  async getAll(): Promise<IProject[]> {
    const projects = await Project.find().sort({ createdAt: -1 }).lean() as any;
    // Transform _id to id for lean documents (toJSON transform doesn't apply to lean())
    return projects.map((project: any) => ({
      ...project,
      id: project._id.toString(),
      _id: undefined,
      __v: undefined,
    }));
  }

  async getById(id: string): Promise<IProject> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid project ID format');
    }
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError('Project');
    }
    return project;
  }

  async create(data: Partial<IProject>, file?: Express.Multer.File): Promise<IProject> {
    if (file) {
      data.image = file.path;
    }

    const project = new Project(data);
    await project.save();
    logger.info(`Project created: ${project.title}`);
    return project;
  }

  async update(
    id: string,
    data: Partial<IProject>,
    file?: Express.Multer.File
  ): Promise<IProject> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid project ID format');
    }
    const existing = await Project.findById(id);
    if (!existing) {
      throw new NotFoundError('Project');
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

    const project = await Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      throw new NotFoundError('Project');
    }

    logger.info(`Project updated: ${project.title}`);
    return project;
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid project ID format');
    }
    const project = await Project.findById(id);
    if (!project) {
      throw new NotFoundError('Project');
    }

    // Delete image file
    if (project.image && fs.existsSync(project.image)) {
      try {
        fs.unlinkSync(project.image);
      } catch (error) {
        logger.warn(`Failed to delete image: ${project.image}`);
      }
    }

    await Project.findByIdAndDelete(id);
    logger.info(`Project deleted: ${project.title}`);
  }
}

export default new ProjectService();


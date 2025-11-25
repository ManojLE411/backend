/**
 * Training Service
 * Business logic for training programs
 */

import { Training, ITraining } from '../models/Training.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { isValidObjectId } from '../utils/helpers';
import logger from '../utils/logger';

class TrainingService {
  async getAll(): Promise<ITraining[]> {
    const programs = await Training.find().sort({ createdAt: -1 }).lean() as any;
    // Transform _id to id for lean documents (toJSON transform doesn't apply to lean())
    return programs.map((program: any) => ({
      ...program,
      id: program._id.toString(),
      _id: undefined,
      __v: undefined,
    }));
  }

  async getById(id: string): Promise<ITraining> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid training program ID format');
    }
    const program = await Training.findById(id);
    if (!program) {
      throw new NotFoundError('Training program');
    }
    return program;
  }

  async create(data: Partial<ITraining>): Promise<ITraining> {
    const program = new Training(data);
    await program.save();
    logger.info(`Training program created: ${program.title}`);
    return program;
  }

  async update(id: string, data: Partial<ITraining>): Promise<ITraining> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid training program ID format');
    }
    const program = await Training.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!program) {
      throw new NotFoundError('Training program');
    }
    logger.info(`Training program updated: ${program.title}`);
    return program;
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid training program ID format');
    }
    const program = await Training.findByIdAndDelete(id);
    if (!program) {
      throw new NotFoundError('Training program');
    }
    logger.info(`Training program deleted: ${program.title}`);
  }
}

export default new TrainingService();


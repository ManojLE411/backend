/**
 * Testimonial Service
 * Business logic for testimonials
 */

import { Testimonial, ITestimonial } from '../models/Testimonial.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { isValidObjectId } from '../utils/helpers';
import logger from '../utils/logger';
import fs from 'fs';

class TestimonialService {
  async getAll(): Promise<ITestimonial[]> {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean() as any;
    // Transform _id to id for lean documents (toJSON transform doesn't apply to lean())
    return testimonials.map((testimonial: any) => ({
      ...testimonial,
      id: testimonial._id.toString(),
      _id: undefined,
      __v: undefined,
    }));
  }

  async getById(id: string): Promise<ITestimonial> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid testimonial ID format');
    }
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      throw new NotFoundError('Testimonial');
    }
    return testimonial;
  }

  async create(data: Partial<ITestimonial>, file?: Express.Multer.File): Promise<ITestimonial> {
    if (file) {
      data.avatar = file.path;
    }

    const testimonial = new Testimonial(data);
    await testimonial.save();
    logger.info(`Testimonial created: ${testimonial.name}`);
    return testimonial;
  }

  async update(
    id: string,
    data: Partial<ITestimonial>,
    file?: Express.Multer.File
  ): Promise<ITestimonial> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid testimonial ID format');
    }
    const existing = await Testimonial.findById(id);
    if (!existing) {
      throw new NotFoundError('Testimonial');
    }

    // Delete old avatar if new one is uploaded
    if (file && existing.avatar && fs.existsSync(existing.avatar)) {
      try {
        fs.unlinkSync(existing.avatar);
      } catch (error) {
        logger.warn(`Failed to delete old avatar: ${existing.avatar}`);
      }
    }

    if (file) {
      data.avatar = file.path;
    }

    const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      throw new NotFoundError('Testimonial');
    }

    logger.info(`Testimonial updated: ${testimonial.name}`);
    return testimonial;
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid testimonial ID format');
    }
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      throw new NotFoundError('Testimonial');
    }

    // Delete avatar file
    if (testimonial.avatar && fs.existsSync(testimonial.avatar)) {
      try {
        fs.unlinkSync(testimonial.avatar);
      } catch (error) {
        logger.warn(`Failed to delete avatar: ${testimonial.avatar}`);
      }
    }

    await Testimonial.findByIdAndDelete(id);
    logger.info(`Testimonial deleted: ${testimonial.name}`);
  }
}

export default new TestimonialService();


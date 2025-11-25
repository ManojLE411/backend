/**
 * Service Service
 * Business logic for services
 */

import { Service, IService } from '../models/Service.model';
import { NotFoundError, ValidationError } from '../utils/errors';
import { isValidObjectId } from '../utils/helpers';
import logger from '../utils/logger';

class ServiceService {
  async getAll(): Promise<IService[]> {
    const services = await Service.find().sort({ createdAt: -1 }).lean() as any;
    // Transform _id to id for lean documents (toJSON transform doesn't apply to lean())
    return services.map((service: any) => ({
      ...service,
      id: service._id.toString(),
      _id: undefined,
      __v: undefined,
    }));
  }

  async getById(id: string): Promise<IService> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid service ID format');
    }
    const service = await Service.findById(id);
    if (!service) {
      throw new NotFoundError('Service');
    }
    return service;
  }

  async create(data: Partial<IService>): Promise<IService> {
    const service = new Service(data);
    await service.save();
    logger.info(`Service created: ${service.title}`);
    return service;
  }

  async update(id: string, data: Partial<IService>): Promise<IService> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid service ID format');
    }
    const service = await Service.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      throw new NotFoundError('Service');
    }
    logger.info(`Service updated: ${service.title}`);
    return service;
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new ValidationError('Invalid service ID format');
    }
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      throw new NotFoundError('Service');
    }
    logger.info(`Service deleted: ${service.title}`);
  }
}

export default new ServiceService();


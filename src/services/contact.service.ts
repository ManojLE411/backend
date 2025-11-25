/**
 * Contact Service
 * Business logic for contact messages
 */

import { Contact, IContact } from '../models/Contact.model';
import { NotFoundError } from '../utils/errors';
import { parsePagination, createPaginatedResponse } from '../utils/pagination';
import logger from '../utils/logger';

class ContactService {
  async submitMessage(data: Partial<IContact>): Promise<IContact> {
    const message = new Contact(data);
    await message.save();
    logger.info(`Contact message received: ${message.email}`);
    return message;
  }

  async getAll(query: { page?: string; pageSize?: string }) {
    const { page, pageSize } = parsePagination(query);
    const skip = (page - 1) * pageSize;

    const [messages, total] = await Promise.all([
      Contact.find()
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean() as any,
      Contact.countDocuments(),
    ]);

    // Transform _id to id for lean documents (toJSON transform doesn't apply to lean())
    const transformedMessages = messages.map((message: any) => ({
      ...message,
      id: message._id.toString(),
      date: message.date ? new Date(message.date).toISOString() : message.date,
      _id: undefined,
      __v: undefined,
    }));

    return createPaginatedResponse(transformedMessages, total, page, pageSize);
  }

  async getById(id: string): Promise<IContact> {
    const message = await Contact.findById(id);
    if (!message) {
      throw new NotFoundError('Contact message');
    }
    return message;
  }

  async updateStatus(
    id: string,
    status: 'New' | 'Read' | 'Replied'
  ): Promise<IContact> {
    const message = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      throw new NotFoundError('Contact message');
    }

    logger.info(`Contact message status updated: ${id} -> ${status}`);
    return message;
  }

  async delete(id: string): Promise<void> {
    const message = await Contact.findByIdAndDelete(id);
    if (!message) {
      throw new NotFoundError('Contact message');
    }
    logger.info(`Contact message deleted: ${id}`);
  }
}

export default new ContactService();


/**
 * Testimonial Routes
 */

import { Router } from 'express';
import testimonialController from '../controllers/testimonial.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { uploadImage } from '../config/multer';
import { handleUploadError } from '../middleware/upload.middleware';
import { testimonialSchema } from '../controllers/testimonial.controller';

const router = Router();

// Public routes
router.get('/', testimonialController.getAll.bind(testimonialController));
router.get('/:id', testimonialController.getById.bind(testimonialController));

// Admin routes
router.post('/', authenticate, requireAdmin, uploadImage.single('avatar'), handleUploadError, validateBody(testimonialSchema), testimonialController.create.bind(testimonialController));
router.put('/:id', authenticate, requireAdmin, uploadImage.single('avatar'), handleUploadError, validateBody(testimonialSchema.partial()), testimonialController.update.bind(testimonialController));
router.delete('/:id', authenticate, requireAdmin, testimonialController.delete.bind(testimonialController));

export default router;


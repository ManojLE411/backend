/**
 * Project Routes
 */

import { Router } from 'express';
import projectController from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { uploadImage } from '../config/multer';
import { handleUploadError } from '../middleware/upload.middleware';
import { projectSchema } from '../controllers/project.controller';

const router = Router();

// Public routes
router.get('/', projectController.getAll.bind(projectController));
router.get('/:id', projectController.getById.bind(projectController));

// Admin routes
router.post('/', authenticate, requireAdmin, uploadImage.single('image'), handleUploadError, validateBody(projectSchema), projectController.create.bind(projectController));
router.put('/:id', authenticate, requireAdmin, uploadImage.single('image'), handleUploadError, validateBody(projectSchema.partial()), projectController.update.bind(projectController));
router.delete('/:id', authenticate, requireAdmin, projectController.delete.bind(projectController));

export default router;


/**
 * Employee Routes
 */

import { Router } from 'express';
import employeeController from '../controllers/employee.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { uploadImage } from '../config/multer';
import { handleUploadError } from '../middleware/upload.middleware';
import { employeeSchema } from '../controllers/employee.controller';

const router = Router();

// Public routes
router.get('/', employeeController.getAll.bind(employeeController));
router.get('/:id', employeeController.getById.bind(employeeController));

// Admin routes
router.post('/', authenticate, requireAdmin, uploadImage.single('image'), handleUploadError, validateBody(employeeSchema), employeeController.create.bind(employeeController));
router.put('/:id', authenticate, requireAdmin, uploadImage.single('image'), handleUploadError, validateBody(employeeSchema.partial()), employeeController.update.bind(employeeController));
router.delete('/:id', authenticate, requireAdmin, employeeController.delete.bind(employeeController));

export default router;


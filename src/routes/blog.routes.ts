/**
 * Blog Routes
 */

import { Router } from 'express';
import blogController from '../controllers/blog.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { blogCreateSchema, blogUpdateSchema } from '../controllers/blog.controller';

const router = Router();

// Public routes
router.get('/', blogController.getAll.bind(blogController));
router.get('/:id', blogController.getById.bind(blogController));

// Admin routes
router.post('/', authenticate, requireAdmin, validateBody(blogCreateSchema), blogController.create.bind(blogController));
router.put('/:id', authenticate, requireAdmin, validateBody(blogUpdateSchema), blogController.update.bind(blogController));
router.delete('/:id', authenticate, requireAdmin, blogController.delete.bind(blogController));

export default router;


/**
 * Training Routes
 */

import { Router } from 'express';
import trainingController from '../controllers/training.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { trainingSchema } from '../controllers/training.controller';

const router = Router();

// Public routes
router.get('/', trainingController.getAll.bind(trainingController));
router.get('/:id', trainingController.getById.bind(trainingController));

// Admin routes
router.post('/', authenticate, requireAdmin, validateBody(trainingSchema), trainingController.create.bind(trainingController));
router.put('/:id', authenticate, requireAdmin, validateBody(trainingSchema.partial()), trainingController.update.bind(trainingController));
router.delete('/:id', authenticate, requireAdmin, trainingController.delete.bind(trainingController));

export default router;


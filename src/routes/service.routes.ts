/**
 * Service Routes
 */

import { Router } from 'express';
import serviceController from '../controllers/service.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { serviceSchema } from '../controllers/service.controller';

const router = Router();

// Public routes
router.get('/', serviceController.getAll.bind(serviceController));
router.get('/:id', serviceController.getById.bind(serviceController));

// Admin routes
router.post('/', authenticate, requireAdmin, validateBody(serviceSchema), serviceController.create.bind(serviceController));
router.put('/:id', authenticate, requireAdmin, validateBody(serviceSchema.partial()), serviceController.update.bind(serviceController));
router.delete('/:id', authenticate, requireAdmin, serviceController.delete.bind(serviceController));

export default router;


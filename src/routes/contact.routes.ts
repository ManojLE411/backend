/**
 * Contact Routes
 */

import { Router } from 'express';
import contactController from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { contactSubmitSchema } from '../controllers/contact.controller';
import { z } from 'zod';

const router = Router();

// Public route
router.post('/', validateBody(contactSubmitSchema), contactController.submitMessage.bind(contactController));

// Admin routes
router.get('/', authenticate, requireAdmin, contactController.getAll.bind(contactController));
router.get('/:id', authenticate, requireAdmin, contactController.getById.bind(contactController));
router.patch('/:id', authenticate, requireAdmin, validateBody(z.object({ status: z.enum(['New', 'Read', 'Replied']) })), contactController.updateStatus.bind(contactController));
router.delete('/:id', authenticate, requireAdmin, contactController.delete.bind(contactController));

export default router;


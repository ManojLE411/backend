/**
 * User Routes
 * Admin-only user management
 */

import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { userUpdateSchema } from '../controllers/user.controller';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

router.get('/', userController.getAll.bind(userController));
router.get('/:id', userController.getById.bind(userController));
router.put('/:id', validateBody(userUpdateSchema), userController.update.bind(userController));
router.delete('/:id', userController.delete.bind(userController));

export default router;


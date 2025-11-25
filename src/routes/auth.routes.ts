/**
 * Authentication Routes
 */

import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';
import { requireAdminOrAllowFirst } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from '../controllers/auth.controller';

const router = Router();

// Student authentication
router.post('/login', validateBody(loginSchema), authController.studentLogin.bind(authController));
router.post('/register', validateBody(registerSchema), authController.studentRegister.bind(authController));

// Admin authentication
router.post('/admin/login', validateBody(loginSchema), authController.adminLogin.bind(authController));
router.post('/admin/register', optionalAuthenticate, requireAdminOrAllowFirst, validateBody(registerSchema), authController.adminRegister.bind(authController));

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser.bind(authController));
router.post('/refresh', authenticate, authController.refreshToken.bind(authController));
router.post('/logout', authenticate, authController.logout.bind(authController));
router.patch('/profile', authenticate, validateBody(updateProfileSchema), authController.updateProfile.bind(authController));

export default router;


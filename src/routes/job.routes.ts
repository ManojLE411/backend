/**
 * Job Routes
 */

import { Router } from 'express';
import jobController from '../controllers/job.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { uploadResume } from '../config/multer';
import { handleUploadError } from '../middleware/upload.middleware';
import { jobSchema, jobApplicationSchema } from '../controllers/job.controller';
import { z } from 'zod';

const router = Router();

// Public routes - Jobs
router.get('/', jobController.getAll.bind(jobController));

// Application routes (must be before /:id route to avoid route conflicts)
router.get('/applications', authenticate, requireAdmin, jobController.getAllApplications.bind(jobController));
router.post('/applications', uploadResume.single('resume'), handleUploadError, validateBody(jobApplicationSchema), jobController.createApplication.bind(jobController));
router.patch('/applications/:id/status', authenticate, requireAdmin, validateBody(z.object({ status: z.enum(['Pending', 'Approved', 'Rejected']) })), jobController.updateApplicationStatus.bind(jobController));
router.delete('/applications/:id', authenticate, requireAdmin, jobController.deleteApplication.bind(jobController));

// Public routes - Single Job (must be after /applications)
router.get('/:id', jobController.getById.bind(jobController));

// Admin routes - Jobs
router.post('/', authenticate, requireAdmin, validateBody(jobSchema), jobController.create.bind(jobController));
router.put('/:id', authenticate, requireAdmin, validateBody(jobSchema.partial()), jobController.update.bind(jobController));
router.delete('/:id', authenticate, requireAdmin, jobController.delete.bind(jobController));

export default router;


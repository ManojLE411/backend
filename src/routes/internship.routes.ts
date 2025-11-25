/**
 * Internship Routes
 */

import { Router } from 'express';
import internshipController from '../controllers/internship.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/role.middleware';
import { validateBody } from '../middleware/validation.middleware';
import { uploadResume } from '../config/multer';
import { handleUploadError } from '../middleware/upload.middleware';
import { internshipSchema, applicationSchema } from '../controllers/internship.controller';
import { z } from 'zod';

const router = Router();

// Public routes - Tracks
router.get('/', internshipController.getAllTracks.bind(internshipController));

// Application routes (must be before /:id route to avoid route conflicts)
router.get('/applications', authenticate, requireAdmin, internshipController.getAllApplications.bind(internshipController));
router.post('/applications', uploadResume.single('resume'), handleUploadError, validateBody(applicationSchema), internshipController.createApplication.bind(internshipController));
router.patch('/applications/:id', authenticate, requireAdmin, validateBody(z.object({ status: z.enum(['Pending', 'Approved', 'Rejected']) })), internshipController.updateApplicationStatus.bind(internshipController));
router.delete('/applications/:id', authenticate, requireAdmin, internshipController.deleteApplication.bind(internshipController));

// Public routes - Single Track (must be after /applications)
router.get('/:id', internshipController.getTrackById.bind(internshipController));

// Admin routes - Tracks
router.post('/', authenticate, requireAdmin, validateBody(internshipSchema), internshipController.createTrack.bind(internshipController));
router.put('/:id', authenticate, requireAdmin, validateBody(internshipSchema.partial()), internshipController.updateTrack.bind(internshipController));
router.delete('/:id', authenticate, requireAdmin, internshipController.deleteTrack.bind(internshipController));

export default router;


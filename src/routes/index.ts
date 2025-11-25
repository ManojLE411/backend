/**
 * Routes Index
 * Aggregates all routes
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import blogRoutes from './blog.routes';
import trainingRoutes from './training.routes';
import internshipRoutes from './internship.routes';
import employeeRoutes from './employee.routes';
import contactRoutes from './contact.routes';
import userRoutes from './user.routes';
import serviceRoutes from './service.routes';
import jobRoutes from './job.routes';
import testimonialRoutes from './testimonial.routes';
import projectRoutes from './project.routes';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/blog', blogRoutes);
router.use('/training', trainingRoutes);
router.use('/internships', internshipRoutes);
router.use('/employees', employeeRoutes);
router.use('/contact', contactRoutes);
router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/jobs', jobRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/projects', projectRoutes);

export default router;


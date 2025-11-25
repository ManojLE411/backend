/**
 * Multer Configuration
 * File upload configuration for different file types
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import env from './env';
import logger from '../utils/logger';

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    path.join(env.UPLOAD_PATH, 'images', 'blog'),
    path.join(env.UPLOAD_PATH, 'images', 'employees'),
    path.join(env.UPLOAD_PATH, 'images', 'projects'),
    path.join(env.UPLOAD_PATH, 'images', 'testimonials'),
    path.join(env.UPLOAD_PATH, 'resumes', 'internships'),
    path.join(env.UPLOAD_PATH, 'resumes', 'jobs'),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created upload directory: ${dir}`);
    }
  });
};

// Initialize directories
ensureUploadDirs();

/**
 * File filter for images
 */
const imageFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.'));
  }
};

/**
 * File filter for resumes
 */
const resumeFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'));
  }
};

/**
 * Storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = env.UPLOAD_PATH;

    // Determine upload path based on field name and type
    if (file.fieldname === 'resume') {
      if (req.path.includes('internships')) {
        uploadPath = path.join(env.UPLOAD_PATH, 'resumes', 'internships');
      } else if (req.path.includes('jobs')) {
        uploadPath = path.join(env.UPLOAD_PATH, 'resumes', 'jobs');
      }
    } else if (file.fieldname === 'image') {
      if (req.path.includes('blog')) {
        uploadPath = path.join(env.UPLOAD_PATH, 'images', 'blog');
      } else if (req.path.includes('employees')) {
        uploadPath = path.join(env.UPLOAD_PATH, 'images', 'employees');
      } else if (req.path.includes('projects')) {
        uploadPath = path.join(env.UPLOAD_PATH, 'images', 'projects');
      } else if (req.path.includes('testimonials')) {
        uploadPath = path.join(env.UPLOAD_PATH, 'images', 'testimonials');
      }
    } else if (file.fieldname === 'avatar') {
      uploadPath = path.join(env.UPLOAD_PATH, 'images', 'testimonials');
    }

    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  },
});

/**
 * Multer instance for image uploads
 */
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE, // 5MB default
  },
});

/**
 * Multer instance for resume uploads
 */
export const uploadResume = multer({
  storage,
  fileFilter: resumeFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE, // 5MB default
  },
});

/**
 * Multer instance for general file uploads
 */
export const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
});


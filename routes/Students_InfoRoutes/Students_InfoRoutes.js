import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from '../../controllers/Students_InfoController/Students_InfoController.js';

import { authenticate, authorize } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Get all students with optional filtering
router.get('/', getAllStudents);

// Get student by ID
router.get('/:id', getStudentById);

// Create a new student (only admin/principal)
router.post('/', authorize(['admin', 'principal']), createStudent);

// Update student (only admin/principal)
router.put('/:id', authorize(['admin', 'principal']), updateStudent);

// Delete student (soft delete, only admin/principal)
router.delete('/:id', authorize(['admin', 'principal']), deleteStudent);

export default router;
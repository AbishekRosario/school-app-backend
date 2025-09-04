import express from 'express';
import {
  registerStudent,
  registerTeacher,
  registerAdmin,
  login,
  verifyEmail,
  refreshToken,
  logout,
} from '../../controllers/logincontroller/authController.js';

const router = express.Router();

router.post('/register/student', registerStudent);
router.post('/register/teacher', registerTeacher);
router.post('/register/admin', registerAdmin);

router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;

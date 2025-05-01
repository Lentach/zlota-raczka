import express from 'express';
import { login, register, getProfile, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { validateRegistration, validateLogin, validateProfileUpdate } from '../middleware/validationMiddleware';
import { authLimiter } from '../middleware/rateLimitMiddleware';

const router = express.Router();

router.post('/register', authLimiter, validateRegistration, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validateProfileUpdate, updateProfile);

export default router; 
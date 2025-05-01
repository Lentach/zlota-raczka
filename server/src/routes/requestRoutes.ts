import express from 'express';
import { createRequest, getAllRequests, getRequestById, updateRequestStatus } from '../controllers/requestController';
import { protect } from '../middleware/authMiddleware';
import { validateServiceRequest, validateRequestUpdate } from '../middleware/requestValidationMiddleware';
import { requestCreationLimiter } from '../middleware/rateLimitMiddleware';

const router = express.Router();

router.post('/', protect, requestCreationLimiter, validateServiceRequest, createRequest);
router.get('/', protect, getAllRequests);
router.get('/:id', protect, getRequestById);
router.patch('/:id', protect, validateRequestUpdate, updateRequestStatus);

export default router; 
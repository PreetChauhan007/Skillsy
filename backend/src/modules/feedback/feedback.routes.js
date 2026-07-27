import express from 'express';
import {
  addFeedback,
  getUserFeedback,
  getSwapFeedback,
  getAllFeedbacks
} from './feedback.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { feedbackValidation } from './feedback.validation.js';

const router = express.Router();

// Submit feedback (protected)
router.post('/', protect, feedbackValidation, addFeedback);

// Get feedback for a user
router.get('/user/:userId', getUserFeedback);

// Get feedback for a swap
router.get('/swap/:swapRequestId', getSwapFeedback);

// Admin: Get all feedbacks (could be protected by admin middleware)
router.get('/', getAllFeedbacks);

export default router;

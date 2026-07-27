import express from 'express';
import {
  sendSwapRequest,
  getMySwapRequests,
  getSwapRequestsForMe,
  respondToSwapRequest,
  cancelSwapRequest,
  deleteSwapRequestController,
  createSwapRequestController,
  updateSwapRequest,
  getUserSwapRequests,
  getAllSwapRequests,
  deleteSwapRequestByBody
} from './swap.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { swapValidation, swapStatusValidation } from './swap.validation.js';

const router = express.Router();

// Create a new swap request
router.post('/create', protect, swapValidation, createSwapRequestController);

// Send a swap request (legacy endpoint)
router.post('/', protect, swapValidation, sendSwapRequest);

// View my sent swap requests
router.get('/my', protect, getMySwapRequests);

// View swap requests sent to me
router.get('/received', protect, getSwapRequestsForMe);

// Get user's swap requests
router.get('/user', protect, getUserSwapRequests);

// Get all swap requests (admin only)
router.get('/all', protect, getAllSwapRequests);

// Accept or reject a swap request
router.patch('/:id/status', protect, swapStatusValidation, respondToSwapRequest);

// Update swap request
router.put('/update', protect, updateSwapRequest);

// Cancel (by requester) or delete (if not accepted)
router.patch('/:id/cancel', protect, cancelSwapRequest);
router.delete('/:id', protect, deleteSwapRequestController);

// Delete swap request (frontend endpoint)
router.delete('/delete', protect, deleteSwapRequestByBody);

export default router;

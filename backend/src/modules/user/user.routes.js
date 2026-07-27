import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUserProfile,
  updateUserProfile,
  logoutUser,
  searchUsers,
  getUserById,
  getUserFeedback,
  updateProfilePhoto
} from './user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/upload.middleware.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// User search (public)
router.get('/search', searchUsers);

// Protected Routes
router.route('/profile')
.get(protect, getCurrentUserProfile)
.put(protect, updateUserProfile);

router.put('/profile/photo', protect, upload.single('profilePhoto'), updateProfilePhoto);

// Get user by ID (public)
router.get('/:id', getUserById);

// Get user feedback (public)
router.get('/:id/feedback', getUserFeedback);

export default router;

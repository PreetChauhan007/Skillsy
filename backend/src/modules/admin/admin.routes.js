import express from 'express';
import {
  handleBanUser,
  handleUnbanUser,
  handleRejectSkill,
  handleSendPlatformMessage,
  getAllAdminActions,
} from './admin.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { adminOnly } from '../../middlewares/role.middleware.js';
import {
  banUserValidation,
  rejectSkillValidation,
  platformMessageValidation,
} from './admin.validation.js';

const router = express.Router();

// All routes below are protected and admin-only
router.use(protect, adminOnly);

router.patch('/ban-user/:userId', banUserValidation, handleBanUser);
router.patch('/unban-user/:userId', handleUnbanUser);
router.delete('/reject-skill/:skillId', rejectSkillValidation, handleRejectSkill);
router.post('/platform-message', platformMessageValidation, handleSendPlatformMessage);
router.get('/actions', getAllAdminActions);

export default router;

import express from 'express';
import { protect } from '../../middlewares/auth.middleware.js';
import { getConversation, sendMessage } from './chat.controller.js';

const router = express.Router();
router.use(protect);
router.get('/:swapId', getConversation);
router.post('/:swapId/messages', sendMessage);

export default router;

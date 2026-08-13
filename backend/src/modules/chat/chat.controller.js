import Conversation from './chat.model.js';
import SwapRequest from '../swap/swap.model.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import { getIO } from '../../config/socket.js';

const getAcceptedSwapForParticipant = async (swapId, userId) => {
  const swap = await SwapRequest.findById(swapId);
  if (!swap || swap.status !== 'accepted') throw new Error('Chat is available only for accepted swaps');
  const participantIds = [swap.requesterId, swap.targetUserId].map((id) => String(id));
  if (!participantIds.includes(String(userId))) throw new Error('You are not a participant in this swap');
  return swap;
};

export const getConversation = async (req, res) => {
  try {
    const swap = await getAcceptedSwapForParticipant(req.params.swapId, req.user.id);
    const participants = [swap.requesterId, swap.targetUserId];
    const conversation = await Conversation.findOneAndUpdate(
      { swapRequest: swap._id },
      { $setOnInsert: { participants } },
      { new: true, upsert: true }
    ).populate('messages.sender', 'name profilePhoto');
    return successResponse(res, conversation);
  } catch (error) {
    return errorResponse(res, error, error.message.includes('participant') ? 403 : 400);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
    if (!content) return errorResponse(res, 'Message cannot be empty', 400);
    const swap = await getAcceptedSwapForParticipant(req.params.swapId, req.user.id);
    const participants = [swap.requesterId, swap.targetUserId];
    const conversation = await Conversation.findOneAndUpdate(
      { swapRequest: swap._id },
      { $setOnInsert: { participants }, $push: { messages: { sender: req.user.id, content } } },
      { new: true, upsert: true }
    ).populate('messages.sender', 'name profilePhoto');
    const storedMessages = conversation?.messages || [];
    const message = storedMessages[storedMessages.length - 1];
    if (!message) throw new Error('Message could not be saved');
    getIO()?.to(`swap:${swap._id}`).emit('chat:message', message.toObject());
    return successResponse(res, message, 'Message sent', 201);
  } catch (error) {
    return errorResponse(res, error, error.message.includes('participant') ? 403 : 400);
  }
};

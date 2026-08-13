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

const serializeMessage = (message) => {
  const sender = message.sender?.toObject ? message.sender.toObject({ virtuals: false }) : message.sender;
  return {
    _id: String(message._id),
    sender: sender && typeof sender === 'object'
      ? { _id: String(sender._id), name: sender.name || 'Swap partner', profilePhoto: sender.profilePhoto || null }
      : String(sender),
    content: message.content,
    createdAt: message.createdAt ? new Date(message.createdAt).toISOString() : new Date().toISOString(),
  };
};

export const getConversation = async (req, res) => {
  try {
    const swap = await getAcceptedSwapForParticipant(req.params.swapId, req.user.id);
    const participants = [swap.requesterId, swap.targetUserId];
    const conversation = await Conversation.findOneAndUpdate(
      { swapRequest: swap._id },
      { $setOnInsert: { participants } },
      { new: true, upsert: true }
    ).populate('messages.sender', 'name profilePhoto createdAt');
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
    ).populate('messages.sender', 'name profilePhoto createdAt');
    const storedMessages = conversation?.messages || [];
    const message = storedMessages[storedMessages.length - 1];
    if (!message) throw new Error('Message could not be saved');
    const messagePayload = serializeMessage(message);
    getIO()?.to(`swap:${swap._id}`).emit('chat:message', messagePayload);
    return successResponse(res, messagePayload, 'Message sent', 201);
  } catch (error) {
    return errorResponse(res, error, error.message.includes('participant') ? 403 : 400);
  }
};

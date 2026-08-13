import Conversation from './chat.model.js';
import SwapRequest from '../swap/swap.model.js';
import { successResponse, errorResponse } from '../../utils/response.js';

const getAcceptedSwapForParticipant = async (swapId, userId) => {
  const swap = await SwapRequest.findById(swapId);
  if (!swap || swap.status !== 'accepted') throw new Error('Chat is available only for accepted swaps');
  if (![swap.requesterId, swap.targetUserId].includes(userId)) throw new Error('You are not a participant in this swap');
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
    const content = req.body.content?.trim();
    if (!content) return errorResponse(res, 'Message cannot be empty', 400);
    const swap = await getAcceptedSwapForParticipant(req.params.swapId, req.user.id);
    const participants = [swap.requesterId, swap.targetUserId];
    const conversation = await Conversation.findOneAndUpdate(
      { swapRequest: swap._id },
      { $setOnInsert: { participants }, $push: { messages: { sender: req.user.id, content } } },
      { new: true, upsert: true }
    ).populate('messages.sender', 'name profilePhoto');
    return successResponse(res, conversation.messages.at(-1), 'Message sent', 201);
  } catch (error) {
    return errorResponse(res, error, error.message.includes('participant') ? 403 : 400);
  }
};

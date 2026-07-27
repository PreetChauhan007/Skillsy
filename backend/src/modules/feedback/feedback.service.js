import Feedback from './feedback.model.js';


export const createFeedback = async (data) => {
  return await Feedback.create(data);
};


export const getFeedbackForUser = async (userId) => {
  return await Feedback.find({ toUser: userId })
    .populate('fromUser', 'name')
    .populate('swapRequest');
};


export const getFeedbackBySwap = async (swapRequestId) => {
  return await Feedback.find({ swapRequest: swapRequestId })
    .populate('fromUser', 'name')
    .populate('toUser', 'name');
};


export const getAllFeedback = async () => {
  return await Feedback.find()
    .populate('fromUser', 'name')
    .populate('toUser', 'name')
    .populate('swapRequest');
};

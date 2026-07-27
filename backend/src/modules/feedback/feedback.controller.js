import {
  createFeedback,
  getFeedbackForUser,
  getFeedbackBySwap,
  getAllFeedback
} from './feedback.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export const addFeedback = async (req, res) => {
  try {
    const data = {
      swapRequest: req.body.swapRequest,
      fromUser: req.user.id,
      toUser: req.body.toUser,
      rating: req.body.rating,
      comment: req.body.comment,
    };
    const feedback = await createFeedback(data);

    // Recalculate and update recipient user's average rating
    try {
      const allFeedback = await (await import('./feedback.model.js')).default.find({ toUser: data.toUser });
      if (allFeedback.length > 0) {
        const avgRating = allFeedback.reduce((sum, f) => sum + (f.rating || 0), 0) / allFeedback.length;
        const User = (await import('../user/user.model.js')).default;
        await User.updateOne({ _id: data.toUser }, { rating: avgRating });
      }
    } catch (err) {
      // Log but don't block response
      console.error('Failed to update user rating:', err);
    }

    return successResponse(res, feedback, 'Feedback submitted', 201);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const getUserFeedback = async (req, res) => {
  try {
    const feedbacks = await getFeedbackForUser(req.params.userId);
    return successResponse(res, feedbacks);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const getSwapFeedback = async (req, res) => {
  try {
    const feedbacks = await getFeedbackBySwap(req.params.swapRequestId);
    return successResponse(res, feedbacks);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await getAllFeedback();
    // Safely serialize createdAt/updatedAt fields to avoid toISOString errors
    const safeFeedbacks = feedbacks.map(fb => {
      const obj = fb.toObject ? fb.toObject() : fb;
      return {
        ...obj,
        createdAt: obj.createdAt ? obj.createdAt.toISOString() : null,
        updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : null,
      };
    });
    return successResponse(res, safeFeedbacks);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

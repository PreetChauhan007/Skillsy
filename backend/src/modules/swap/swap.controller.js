import {
  createSwapRequest,
  getSwapRequests,
  getSwapRequestById,
  updateSwapRequestStatus,
  deleteSwapRequest
} from './swap.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';
import User from '../user/user.model.js';

export const sendSwapRequest = async (req, res) => {
  try {
    const data = {
      requesterId: req.user.id,
      targetUserId: req.body.targetUserId,
      offeredSkill: req.body.offeredSkill,
      requestedSkill: req.body.requestedSkill,
      message: req.body.message
    };
    const swap = await createSwapRequest(data);
    return successResponse(res, swap, 'Swap request sent', 201);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

// Create swap request (frontend endpoint)
export const createSwapRequestController = async (req, res) => {
  try {
    const data = {
      requesterId: req.user.id,
      targetUserId: req.body.targetUserId,
      offeredSkill: req.body.offeredSkill,
      requestedSkill: req.body.requestedSkill,
      message: req.body.message
    };
    const swap = await createSwapRequest(data);
    return successResponse(res, swap, 'Swap request created', 201);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const getMySwapRequests = async (req, res) => {
  try {
    let swaps = await getSwapRequests({ requesterId: req.user.id });
    swaps = await attachUserDetailsToSwaps(swaps);
    return successResponse(res, swaps);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const getSwapRequestsForMe = async (req, res) => {
  try {
    let swaps = await getSwapRequests({ targetUserId: req.user.id });
    swaps = await attachUserDetailsToSwaps(swaps);
    return successResponse(res, swaps);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

// Get user's swap requests
export const getUserSwapRequests = async (req, res) => {
  try {
    let swaps = await getSwapRequests({
      $or: [{ requesterId: req.user.id }, { targetUserId: req.user.id }]
    });
    swaps = await attachUserDetailsToSwaps(swaps);
    return successResponse(res, swaps);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

// Get all swap requests (admin only)
export const getAllSwapRequests = async (req, res) => {
  try {
    let swaps = await getSwapRequests({});
    swaps = await attachUserDetailsToSwaps(swaps);
    return successResponse(res, swaps);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};
// Helper to attach user details to swap requests
async function attachUserDetailsToSwaps(swaps) {
  const userIds = Array.from(new Set(swaps.flatMap(s => [s.requesterId, s.targetUserId])));
  const users = await User.find({ _id: { $in: userIds } });
  const userMap = {};
  users.forEach(u => { userMap[u._id.toString()] = u.toObject(); });
  return swaps.map(swap => ({
    ...swap.toObject(),
    requester: userMap[swap.requesterId] || null,
    targetUser: userMap[swap.targetUserId] || null
  }));
}

export const respondToSwapRequest = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }
    const swap = await updateSwapRequestStatus(req.params.id, status);
    if (!swap) return errorResponse(res, 'Swap request not found', 404);

    // If completed, increment totalSwaps for both users
    if (status === 'completed') {
      try {
        await User.updateOne({ _id: swap.requesterId }, { $inc: { totalSwaps: 1 } });
        await User.updateOne({ _id: swap.targetUserId }, { $inc: { totalSwaps: 1 } });
      } catch (err) {
        // Log but don't block response
        console.error('Failed to increment totalSwaps:', err);
      }
    }
    return successResponse(res, swap, `Swap request ${status}`);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

// Update swap request
export const updateSwapRequest = async (req, res) => {
  try {
    const { id, ...updates } = req.body;
    const swap = await updateSwapRequestById(id, updates);
    if (!swap) return errorResponse(res, 'Swap request not found', 404);
    return successResponse(res, swap, 'Swap request updated');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const cancelSwapRequest = async (req, res) => {
  try {
    const swap = await updateSwapRequestStatus(req.params.id, 'cancelled');
    if (!swap) return errorResponse(res, 'Swap request not found', 404);
    return successResponse(res, swap, 'Swap request cancelled');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const deleteSwapRequestController = async (req, res) => {
  try {
    const deleted = await deleteSwapRequest(req.params.id, req.user.id);
    if (!deleted) return errorResponse(res, 'Cannot delete swap request', 403);
    return successResponse(res, null, 'Swap request deleted');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

// Delete swap request (frontend endpoint)
export const deleteSwapRequestByBody = async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await deleteSwapRequest(id, req.user.id);
    if (!deleted) return errorResponse(res, 'Cannot delete swap request', 403);
    return successResponse(res, null, 'Swap request deleted');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

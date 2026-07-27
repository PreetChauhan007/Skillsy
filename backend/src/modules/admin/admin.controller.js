import {
  banUser,
  unbanUser,
  rejectSkill,
  sendPlatformMessage,
  getAdminActions,
} from './admin.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export const handleBanUser = async (req, res) => {
  try {
    const user = await banUser(req.params.userId, req.user.id, req.body.reason);
    return successResponse(res, user, 'User banned');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const handleUnbanUser = async (req, res) => {
  try {
    const user = await unbanUser(req.params.userId, req.user.id);
    return successResponse(res, user, 'User unbanned');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const handleRejectSkill = async (req, res) => {
  try {
    await rejectSkill(req.params.skillId, req.user.id, req.body.reason);
    return successResponse(res, null, 'Skill rejected and removed');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const handleSendPlatformMessage = async (req, res) => {
  try {
    await sendPlatformMessage(req.user.id, req.body.message);
    return successResponse(res, null, 'Platform message sent');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const getAllAdminActions = async (req, res) => {
  try {
    const actions = await getAdminActions();
    // Safely serialize createdAt/updatedAt fields to avoid toISOString errors
    const safeActions = actions.map(action => {
      const obj = action.toObject ? action.toObject() : action;
      return {
        ...obj,
        createdAt: obj.createdAt ? obj.createdAt.toISOString() : null,
        updatedAt: obj.updatedAt ? obj.updatedAt.toISOString() : null,
      };
    });
    return successResponse(res, safeActions);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

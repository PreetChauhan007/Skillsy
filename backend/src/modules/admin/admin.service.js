import AdminAction from './admin.model.js';
import User from '../user/user.model.js';
import Skill from '../skill/skill.model.js';

export const logAdminAction = async (actionData) => {
  return await AdminAction.create(actionData);
};

export const banUser = async (userId, adminId, reason) => {
  const user = await User.findByIdAndUpdate(userId, { isBanned: true }, { new: true });
  await logAdminAction({
    admin: adminId,
    actionType: 'ban_user',
    targetUser: userId,
    description: reason,
  });
  return user;
};

export const unbanUser = async (userId, adminId) => {
  const user = await User.findByIdAndUpdate(userId, { isBanned: false }, { new: true });
  await logAdminAction({
    admin: adminId,
    actionType: 'unban_user',
    targetUser: userId,
    description: 'User unbanned',
  });
  return user;
};

export const rejectSkill = async (skillId, adminId, reason) => {
  await Skill.findByIdAndDelete(skillId);
  await logAdminAction({
    admin: adminId,
    actionType: 'reject_skill',
    targetSkill: skillId,
    description: reason,
  });
};

export const sendPlatformMessage = async (adminId, message) => {
  // Implementation depends on your notification system
  await logAdminAction({
    admin: adminId,
    actionType: 'send_message',
    description: message,
  });
};

export const getAdminActions = async (filter = {}) => {
  return await AdminAction.find(filter)
    .populate('admin', 'name email')
    .populate('targetUser', 'name email')
    .populate('targetSkill', 'name');
};

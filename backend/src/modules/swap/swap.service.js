import SwapRequest from './swap.model.js';

export const createSwapRequest = async (data) => {
  return await SwapRequest.create(data);
};

export const getSwapRequests = async (filter = {}) => {
  return await SwapRequest.find(filter)
    .sort({ createdAt: -1 });
};

export const getSwapRequestById = async (id) => {
  return await SwapRequest.findById(id);
};

export const updateSwapRequestStatus = async (id, status) => {
  const updateData = { status };
  if (status === 'completed') {
    updateData.completedAt = new Date();
  }
  return await SwapRequest.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );
};

export const updateSwapRequestById = async (id, updates) => {
  return await SwapRequest.findByIdAndUpdate(
    id,
    { ...updates, updatedAt: new Date() },
    { new: true }
  );
};

export const deleteSwapRequest = async (id, userId) => {
  // Only allow deletion if the requester is the current user and status is pending
  return await SwapRequest.findOneAndDelete({
    _id: id,
    requesterId: userId,
    status: 'pending'
  });
};

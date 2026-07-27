import User from './user.model.js';
import jwt from 'jsonwebtoken';
import Feedback from '../feedback/feedback.model.js';
import Skill from '../skill/skill.model.js';

// Function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUserService = async (userData) => {
  // Expect userData.password, hash it and store as passwordHash
  const { password, ...rest } = userData;
  if (!password) throw new Error('Password is required');
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.default.genSalt(10);
  const passwordHash = await bcrypt.default.hash(password, salt);
  const user = await User.create({ ...rest, passwordHash });
  const token = generateToken(user._id);
  return { user, token };
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (user && (await user.comparePassword(password))) {
    const token = generateToken(user._id);
    return { user, token };
  }
  throw new Error('Invalid email or password');
};

export const updateUserProfileService = async (userId, updateData) => {
  // Ensure sensitive data like password is not updated here
  const allowedUpdates = {
    name: updateData.name,
    location: updateData.location,
    availability: updateData.availability,
    isPublic: updateData.isPublic,
    skillsOffered: updateData.skillsOffered,
    skillsWanted: updateData.skillsWanted,
    profilePhoto: updateData.profilePhoto
  };

  // Add new skills to the global skills collection if they don't exist
  const allSkills = [
    ...(Array.isArray(updateData.skillsOffered) ? updateData.skillsOffered : []),
    ...(Array.isArray(updateData.skillsWanted) ? updateData.skillsWanted : [])
  ];
  for (const skillName of allSkills) {
    if (skillName && typeof skillName === 'string') {
      await Skill.findOneAndUpdate(
        { name: skillName.trim() },
        { name: skillName.trim() },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  }

  return await User.findByIdAndUpdate(userId, allowedUpdates, { new: true });
};

export const getUserProfileService = async (userId) => {
  return await User.findById(userId);
};

// Search users with filters and pagination
export const searchUsersService = async (filters) => {
  const { skill, location, availability, page, limit } = filters;

  let query = { isPublic: true };

  // Apply skill filter
  if (skill) {
    const skillRegex = new RegExp(skill, 'i');
    query.$or = [
      { skillsOffered: { $in: [skillRegex] } },
      { skillsWanted: { $in: [skillRegex] } }
    ];
  }

  // Apply location filter
  if (location) {
    query.location = new RegExp(location, 'i');
  }

  // Apply availability filter
  if (availability && availability !== 'all') {
    query.availability = availability;
  }

  const skip = (page - 1) * limit;
  const users = await User.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ lastActive: -1 });

  const total = await User.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  return {
    data: users,
    total,
    page,
    limit,
    totalPages,
  };
};

// Get user by ID
export const getUserByIdService = async (userId) => {
  return await User.findById(userId);
};

// Get user feedback
export const getUserFeedbackService = async (userId) => {
  return await Feedback.find({ toUserId: userId })
    .sort({ createdAt: -1 });
};

import Skill from './skill.model.js';

export const createSkill = async (skillData) => {
  return await Skill.create(skillData);
};

export const getAllSkills = async (filter = {}) => {
  return await Skill.find(filter);
};

export const getSkillById = async (id) => {
  return await Skill.findById(id);
};

export const updateSkill = async (id, updateData) => {
  return await Skill.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteSkill = async (id) => {
  return await Skill.findByIdAndDelete(id);
};

export const findSkillByName = async (name) => {
  return await Skill.findOne({ name: new RegExp(`^${name}$`, 'i') });
};

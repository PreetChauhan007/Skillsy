import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  findSkillByName,
} from './skill.service.js';
import { successResponse, errorResponse } from '../../utils/response.js';

export const addSkill = async (req, res) => {
  try {
    const { name, description } = req.body;
    // Optionally, check for duplicates
    const existing = await findSkillByName(name);
    if (existing) return errorResponse(res, 'Skill already exists', 409);

    const skill = await createSkill({
      name,
      description,
      createdBy: req.user?.id, // If using auth middleware
    });
    return successResponse(res, skill, 'Skill created', 201);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await getAllSkills();
    return successResponse(res, skills);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const getSkill = async (req, res) => {
  try {
    const skill = await getSkillById(req.params.id);
    if (!skill) return errorResponse(res, 'Skill not found', 404);
    return successResponse(res, skill);
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const editSkill = async (req, res) => {
  try {
    const skill = await updateSkill(req.params.id, req.body);
    if (!skill) return errorResponse(res, 'Skill not found', 404);
    return successResponse(res, skill, 'Skill updated');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

export const removeSkill = async (req, res) => {
  try {
    const skill = await deleteSkill(req.params.id);
    if (!skill) return errorResponse(res, 'Skill not found', 404);
    return successResponse(res, skill, 'Skill deleted');
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

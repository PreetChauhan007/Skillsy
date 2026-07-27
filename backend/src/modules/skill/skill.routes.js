import express from 'express';
import {
  addSkill,
  getSkills,
  getSkill,
  editSkill,
  removeSkill,
} from './skill.controller.js';
import { skillValidation } from './skill.validation.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Public: get all skills, get one skill
router.get('/', getSkills);
router.get('/:id', getSkill);

// Protected: create, update, delete
router.post('/', protect, skillValidation, addSkill);
router.put('/:id', protect, skillValidation, editSkill);
router.delete('/:id', protect, removeSkill);

export default router;

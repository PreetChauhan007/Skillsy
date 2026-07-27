import { body } from 'express-validator';

export const skillValidation = [
  body('name').notEmpty().withMessage('Skill name is required'),
  body('description').optional().isString(),
];

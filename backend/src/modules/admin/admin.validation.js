import { body } from 'express-validator';

export const banUserValidation = [
  body('reason').notEmpty().withMessage('Ban reason is required'),
];

export const rejectSkillValidation = [
  body('reason').notEmpty().withMessage('Rejection reason is required'),
];

export const platformMessageValidation = [
  body('message').notEmpty().withMessage('Message is required'),
];

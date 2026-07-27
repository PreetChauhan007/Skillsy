import { body } from 'express-validator';

export const swapValidation = [
  body('targetUserId').notEmpty().withMessage('Target user ID is required'),
  body('offeredSkill').notEmpty().withMessage('Offered skill is required'),
  body('requestedSkill').notEmpty().withMessage('Requested skill is required'),
  body('message').optional().isString()
];

export const swapStatusValidation = [
  body('status').isIn(['accepted', 'rejected', 'completed', 'cancelled']).withMessage('Status must be accepted, rejected, completed, or cancelled')
];

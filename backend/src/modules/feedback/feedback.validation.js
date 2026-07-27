import { body } from 'express-validator';

export const feedbackValidation = [
  body('swapRequest').notEmpty().withMessage('Swap request ID is required'),
  body('toUser').notEmpty().withMessage('Recipient user ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().isString(),
];

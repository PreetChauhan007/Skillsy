// src/modules/user/index.js
import userRoutes from './user.routes.js';
import User from './user.model.js';
import * as userController from './user.controller.js';
import * as userService from './user.service.js';
import * as userValidation from './user.validation.js';

export {
  userRoutes,
  User,
  userController,
  userService,
  userValidation,
};

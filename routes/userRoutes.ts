import express from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateCurrentUser,
  deleteCurrentUser,
  getMe,
} from '../controllers/userController';
import * as authController from '../controllers/authController';
import { body } from 'express-validator';
export const router = express.Router();

router.post(
  '/signup',
  body(['name', 'email', 'password', 'passwordConfirm']).escape(),
  authController.signup
);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateCurrentUser', authController.protect, updateCurrentUser);
router.delete('/deleteCurrentUser', authController.protect, deleteCurrentUser);

router.get('/me', authController.protect, getMe, getUser);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

import express from 'express';
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateCurrentUser,
  deleteCurrentUser,
} from '../controllers/userController';
import * as authController from '../controllers/authController';
export const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateCurrentUser', authController.protect, updateCurrentUser);
router.delete('/deleteCurrentUser', authController.protect, deleteCurrentUser);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

import express from 'express';
import {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { login, signup } from '../controllers/authController';
export const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

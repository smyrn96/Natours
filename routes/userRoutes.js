const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = userController;

const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  protectEndpoints,
  updatePassword,
} = authController;

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-pasword').post(resetPassword);

router.route('/update-password').patch(protectEndpoints, updatePassword);

router.route('/update-me').patch(protectEndpoints, updateMe);

router.route('/delete-me').patch(protectEndpoints, deleteMe);

router.route('/signup').post(signup);

router.route('/login').post(login);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;

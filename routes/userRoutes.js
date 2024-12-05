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
  getMe,
} = userController;

const {
  signup,
  login,
  resetPassword,
  forgotPassword,
  protectEndpoints,
  updatePassword,
  restrictTo,
} = authController;

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-pasword').post(resetPassword);

router.route('/signup').post(signup);

router.route('/login').post(login);

router.use(protectEndpoints);

router.route('/update-password').patch(updatePassword);

router.route('/update-me').patch(updateMe);

router.route('/delete-me').patch(deleteMe);

router.route('/get-me').get(getMe, getUser);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;

const express = require('express');

const router = express.Router({ mergeParams: true });

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  getReview,
  setUserTourIds,
} = reviewController;
const { protectEndpoints, restrictTo } = authController;

router.use(protectEndpoints);

router
  .route('/')
  .get(getAllReviews)
  .post(protectEndpoints, restrictTo('user'), setUserTourIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;

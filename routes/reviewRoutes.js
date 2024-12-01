const express = require('express');

const router = express.Router();

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const { getAllReviews, createReview } = reviewController;
const { protectEndpoints, restrictTo } = authController;

router
  .route('/')
  .get(getAllReviews)
  .post(protectEndpoints, restrictTo('user'), createReview);

module.exports = router;

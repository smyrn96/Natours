const express = require('express');

const router = express.Router();
const reviewRouter = require('./reviewRoutes');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  getFiveCheapTours,
  getTourStats,
  getMonthlyPlan,
} = tourController;

const { protectEndpoints, restrictTo } = authController;

router.use('/:tourId/reviews', reviewRouter);

// router.param('id', tourController.checkID);

router.route('/tour-stats').get(getTourStats);

router.route('/top-5-cheap').get(getFiveCheapTours, getAllTours);

router
  .route('/monthly-plan/:year')
  .get(
    protectEndpoints,
    restrictTo('admin', 'guide', 'lead-guide'),
    getMonthlyPlan,
  );

router
  .route('/')
  .get(authController.protectEndpoints, getAllTours)
  .post(protectEndpoints, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protectEndpoints, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protectEndpoints, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;

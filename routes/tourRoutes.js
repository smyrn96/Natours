const express = require('express');

const router = express.Router();

const tourController = require('../controllers/tourController');

const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  getFiveCheapTours,
} = tourController;

// router.param('id', tourController.checkID);

router.route('/top-5-cheap').get(getFiveCheapTours, getAllTours);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;

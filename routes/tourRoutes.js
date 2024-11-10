const express = require('express');
const tourController = require('./../controllers/tourController');
const router = express.Router();

const { getAllTours, getTour, updateTour, deleteTour, createTour, checkBody } =
  tourController;

router.param('id', tourController.checkID);

router.route('/').get(getAllTours).post(checkBody, createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;

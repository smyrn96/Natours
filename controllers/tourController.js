const fs = require('fs');
const Tour = require('../models/tourModel');

exports.getFiveCheapTours = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const { sort, page, limit, fields } = req.query;

    //Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    //Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|lte|gt|lt\b)/g, (match) => `$${match}`),
    );
    let query = Tour.find(queryStr);

    //Sorting
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    //Field limiting
    if (fields) {
      const fieldsBy = fields.split(',').join(' ');
      query = query.select(fieldsBy);
    } else {
      query = query.select('-__v');
    }

    //Pagination
    const pageNumber = page * 1 || 1;
    const limitNumber = limit * 1 || 100;
    const skip = (pageNumber - 1) * limitNumber;
    query = query.skip(skip).limit(limitNumber);

    if (page) {
      const numTours = await Tour.countDocuments();

      if (numTours <= skip) throw new Error('The page does not exist');
    }

    const tours = await query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const tour = await Tour.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const id = req.params.id;
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      message: err,
    });
  }
};

const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.operational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const createCastErrorDB = (err) => {
  const message = `Invalid value for ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const createJsonWebTokenError = () => {
  const message = 'Invalid JWT token. Please login.';
  return new AppError(message, 401);
};

const createTokenExpiredError = () => {
  const message = 'JWT token is expired. Please login.';
  return new AppError(message, 401);
};

const createDuplicateFieldValuErroreDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate value: ${value}`;
  return new AppError(message, 400);
};

const createValidationErroreDB = (err) => {
  const errors = Object.values(err.errors).map((elem) => elem.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

exports.errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, code: err.code, errmsg: err.errmsg };

    if (error.name === 'CastError') {
      error = createCastErrorDB(error);
    }

    if (error.code === 11000) {
      error = createDuplicateFieldValuErroreDB(error);
    }

    if (error.name === 'ValidationError') {
      error = createValidationErroreDB(error);
    }

    if (error.name === 'JsonWebTokenError') {
      error = createJsonWebTokenError();
    }

    if (error.name === 'TokenExpiredError') {
      error = createTokenExpiredError();
    }

    sendErrorProd(error, res);
  }
};

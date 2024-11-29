const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const { errorController } = require('./controllers/errorController');

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(xss());

app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`There in no page with that URL(${req.originalUrl})`, 404));
});

app.use(errorController);

module.exports = app;

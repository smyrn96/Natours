const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const { errorController } = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours/', tourRouter);
app.use('/api/v1/users/', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`There in no page with that URL(${req.originalUrl})`, 404));
});

app.use(errorController);

module.exports = app;

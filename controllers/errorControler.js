const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //render website
    res.status(err.statusCode).render('error', {
      title: 'SOmething went wrong',
      msg: err.message,
    });
  }
};
const sendErrorProduction = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      console.error(err);
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    console.error(err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
  if (err.isOperational) {
    console.error(err);
    return res.status(err.statusCode).render('error', {
      title: 'SOmething went wrong',
      msg: err.message,
    });
  }
  console.error(err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicationErrorDB = (err) => {
  const message = `Duplication on ${Object.entries(err.keyValue)[0].join(
    ': '
  )}`;
  return new AppError(message, 400);
};

const JWTError = () => new AppError('Invalid token. Please log in again!', 401);

const JWTExpiration = () =>
  new AppError('Your session expired, please log in again!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicationErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = JWTError();
    if (error.name === 'TokenExpiredError') error = JWTExpiration();

    sendErrorProduction(error, req, res);
  }
};

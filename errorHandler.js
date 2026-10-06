const AppError = require('../utils/AppError');

// 404 for unknown routes
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// Centralized error handler
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors;

  if (err.name === 'ValidationError' && err.errors) {
    // Mongoose schema validation
    status = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  } else if (err.name === 'CastError') {
    status = 400;
    message = `Invalid value for ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    // Duplicate key (unique SKU)
    status = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value: ${field} '${err.keyValue[field]}' already exists`;
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON in request body';
  }

  if (status === 500) console.error(err);

  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && status === 500 && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };

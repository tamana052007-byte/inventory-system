const AppError = require('../utils/AppError');

const STRING_FIELDS = ['name', 'sku', 'category', 'supplier'];
const NUMBER_FIELDS = ['price', 'quantity', 'reorderLevel'];
const INTEGER_FIELDS = ['quantity', 'reorderLevel'];
const REQUIRED_ON_CREATE = ['name', 'sku', 'category', 'price'];

/**
 * Validates request body before it reaches the controller.
 * isCreate = true  -> required fields must be present
 * isCreate = false -> partial update, only supplied fields are checked
 */
const validateProduct = (isCreate) => (req, res, next) => {
  const body = req.body;
  const errors = [];

  if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
    return next(new AppError('Request body cannot be empty', 400));
  }

  if (isCreate) {
    REQUIRED_ON_CREATE.forEach((f) => {
      if (body[f] === undefined || body[f] === null || body[f] === '') {
        errors.push(`${f} is required`);
      }
    });
  }

  STRING_FIELDS.forEach((f) => {
    if (body[f] !== undefined && typeof body[f] !== 'string') {
      errors.push(`${f} must be a string`);
    }
  });

  NUMBER_FIELDS.forEach((f) => {
    if (body[f] === undefined) return;
    if (typeof body[f] !== 'number' || !Number.isFinite(body[f])) {
      errors.push(`${f} must be a number`);
    } else if (body[f] < 0) {
      errors.push(`${f} cannot be negative`);
    } else if (INTEGER_FIELDS.includes(f) && !Number.isInteger(body[f])) {
      errors.push(`${f} must be a whole number`);
    }
  });

  if (errors.length) {
    const err = new AppError('Validation failed', 400);
    err.errors = errors;
    return next(err);
  }
  next();
};

// Validates body of PATCH /:id/stock  ->  { "change": 10 } or { "change": -3 }
const validateStockChange = (req, res, next) => {
  const { change } = req.body || {};
  if (typeof change !== 'number' || !Number.isInteger(change) || change === 0) {
    return next(new AppError('"change" must be a non-zero integer (positive = restock, negative = sale)', 400));
  }
  next();
};

module.exports = { validateProduct, validateStockChange };

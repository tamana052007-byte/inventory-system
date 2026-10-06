const AppError = require('../utils/AppError');

// Rejects malformed MongoDB ids early with a clean 400 response
module.exports = (req, res, next) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    return next(new AppError(`Invalid product id: ${req.params.id}`, 400));
  }
  next();
};

const express = require('express');
const ctrl = require('../controllers/productController');
const { validateProduct, validateStockChange } = require('../middleware/validateProduct');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

// NOTE: static routes MUST come before '/:id' or "low-stock" is treated as an id
router.get('/low-stock', ctrl.getLowStock);
router.get('/summary', ctrl.getSummary);

router
  .route('/')
  .get(ctrl.getProducts)
  .post(validateProduct(true), ctrl.createProduct);

router.patch('/:id/stock', validateObjectId, validateStockChange, ctrl.adjustStock);

router
  .route('/:id')
  .all(validateObjectId)
  .get(ctrl.getProductById)
  .put(validateProduct(false), ctrl.updateProduct)
  .delete(ctrl.deleteProduct);

module.exports = router;

const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SORTABLE = ['name', 'sku', 'category', 'price', 'quantity', 'reorderLevel', 'supplier', 'createdAt', 'updatedAt'];

// ---------------------------------------------------------------
// POST /api/products
// ---------------------------------------------------------------
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// ---------------------------------------------------------------
// GET /api/products
// Query: category, supplier, search, minPrice, maxPrice,
//        sort (e.g. -price,name), page, limit
// ---------------------------------------------------------------
exports.getProducts = asyncHandler(async (req, res) => {
  const { category, supplier, search, minPrice, maxPrice, sort } = req.query;

  // ----- Filtering -----
  const filter = {};
  if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
  if (supplier) filter.supplier = new RegExp(`^${escapeRegex(supplier)}$`, 'i');
  if (search) filter.name = new RegExp(escapeRegex(search), 'i');

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) {
      if (isNaN(minPrice)) throw new AppError('minPrice must be a number', 400);
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined) {
      if (isNaN(maxPrice)) throw new AppError('maxPrice must be a number', 400);
      filter.price.$lte = Number(maxPrice);
    }
  }

  // ----- Sorting (?sort=-price,name) -----
  let sortBy = '-createdAt';
  if (sort) {
    const fields = sort.split(',').map((f) => f.trim()).filter(Boolean);
    const invalid = fields.find((f) => !SORTABLE.includes(f.replace(/^-/, '')));
    if (invalid) throw new AppError(`Cannot sort by '${invalid}'. Allowed: ${SORTABLE.join(', ')}`, 400);
    sortBy = fields.join(' ');
  }

  // ----- Pagination -----
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).sort(sortBy).skip(skip).limit(limit),
  ]);

  res.json({
    total,
    page,
    totalPages: Math.ceil(total / limit),
    count: products.length,
    products,
  });
});

// ---------------------------------------------------------------
// GET /api/products/:id
// ---------------------------------------------------------------
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  res.json(product);
});

// ---------------------------------------------------------------
// PUT /api/products/:id   (details + direct stock quantity update)
// ---------------------------------------------------------------
exports.updateProduct = asyncHandler(async (req, res) => {
  // Never allow protected fields to be overwritten
  const { _id, __v, createdAt, updatedAt, ...updates } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!product) throw new AppError('Product not found', 404);
  res.json(product);
});

// ---------------------------------------------------------------
// PATCH /api/products/:id/stock     body: { "change": 10 | -3 }
// Positive = restock, negative = sale. Atomic ($inc) and never
// lets quantity drop below zero.
// ---------------------------------------------------------------
exports.adjustStock = asyncHandler(async (req, res) => {
  const { change } = req.body;

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, quantity: { $gte: -change } }, // guard against negative stock
    { $inc: { quantity: change } },
    { new: true, runValidators: true }
  );

  if (!product) {
    const exists = await Product.exists({ _id: req.params.id });
    if (!exists) throw new AppError('Product not found', 404);
    throw new AppError('Insufficient stock: sale quantity exceeds available quantity', 400);
  }

  res.json({ message: 'Stock updated', product });
});

// ---------------------------------------------------------------
// DELETE /api/products/:id
// ---------------------------------------------------------------
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  res.json({ message: 'Product deleted', id: product._id });
});

// ---------------------------------------------------------------
// GET /api/products/low-stock   (Aggregation)
// Products where quantity <= reorderLevel
// ---------------------------------------------------------------
exports.getLowStock = asyncHandler(async (req, res) => {
  const lowStockItems = await Product.aggregate([
    { $match: { $expr: { $lte: ['$quantity', '$reorderLevel'] } } },
    { $addFields: { stockValue: { $multiply: ['$price', '$quantity'] }, id: { $toString: '$_id' } } },
    { $sort: { quantity: 1 } },
  ]);

  res.json({ count: lowStockItems.length, lowStockItems });
});

// ---------------------------------------------------------------
// GET /api/products/summary   (Aggregation)
// Category-wise inventory summary
// ---------------------------------------------------------------
exports.getSummary = asyncHandler(async (req, res) => {
  const summary = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        totalItems: { $sum: 1 },
        totalQuantity: { $sum: '$quantity' },
        totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
        avgPrice: { $avg: '$price' },
      },
    },
    { $sort: { totalStockValue: -1 } },
  ]);

  res.json({ categories: summary.length, summary });
});

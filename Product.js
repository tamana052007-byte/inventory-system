const mongoose = require('mongoose');

const isInteger = {
  validator: Number.isInteger,
  message: '{PATH} must be a whole number',
};

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9-]+$/, 'SKU can contain only letters, numbers and hyphens'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
      validate: isInteger,
    },
    reorderLevel: {
      type: Number,
      min: [0, 'Reorder level cannot be negative'],
      default: 10,
      validate: isInteger,
    },
    supplier: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field: total value of stock on hand
productSchema.virtual('stockValue').get(function () {
  return this.price * this.quantity;
});

// Indexes to speed up filtering/sorting
productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);

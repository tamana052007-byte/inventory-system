// Run with: npm run seed   (inserts 12 sample products)
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');

const data = [
  { name: 'Study Table', sku: 'FURN-TB-812', category: 'Furniture', price: 3999, quantity: 2, reorderLevel: 4, supplier: 'IKEA India' },
  { name: 'Office Chair', sku: 'FURN-CH-101', category: 'Furniture', price: 5499, quantity: 15, reorderLevel: 5, supplier: 'Godrej Interio' },
  { name: 'Laptop 15 inch', sku: 'ELEC-LP-001', category: 'Electronics', price: 52000, quantity: 5, reorderLevel: 5, supplier: 'Dell India' },
  { name: 'Wireless Mouse', sku: 'ELEC-MS-014', category: 'Electronics', price: 799, quantity: 60, reorderLevel: 20, supplier: 'Logitech' },
  { name: 'Bluetooth Speaker', sku: 'ELEC-SP-022', category: 'Electronics', price: 2499, quantity: 25, reorderLevel: 10, supplier: 'boAt' },
  { name: 'Smartphone', sku: 'ELEC-PH-030', category: 'Electronics', price: 18999, quantity: 6, reorderLevel: 8, supplier: 'Samsung' },
  { name: 'Cotton T-Shirt', sku: 'APRL-TS-210', category: 'Apparel', price: 499, quantity: 50, reorderLevel: 15, supplier: 'Allen Solly' },
  { name: 'Denim Jacket', sku: 'APRL-JK-305', category: 'Apparel', price: 2299, quantity: 28, reorderLevel: 10, supplier: 'Levis' },
  { name: 'Notebook A4 (Pack of 5)', sku: 'STNY-NB-100', category: 'Stationery', price: 250, quantity: 100, reorderLevel: 30, supplier: 'Classmate' },
  { name: 'Gel Pen Pack of 15', sku: 'STNY-PN-713', category: 'Stationery', price: 120, quantity: 12, reorderLevel: 20, supplier: 'Cello Pens' },
  { name: 'Basmati Rice 5kg', sku: 'GROC-RC-501', category: 'Grocery', price: 650, quantity: 40, reorderLevel: 15, supplier: 'India Gate' },
  { name: 'Olive Oil 1L', sku: 'GROC-OL-502', category: 'Grocery', price: 899, quantity: 3, reorderLevel: 10, supplier: 'Figaro' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(data);
    console.log(`Seeded ${data.length} products`);
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
  }
})();

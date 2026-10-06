require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const productRoutes = require('./src/routes/productRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();

// ---------- Global middleware ----------
app.use(express.json());

// ---------- Routes ----------
app.get('/', (req, res) => {
  res.json({ message: 'Inventory & Data Management API is running' });
});
app.use('/api/products', productRoutes);

// ---------- Error handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start server after DB connects ----------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

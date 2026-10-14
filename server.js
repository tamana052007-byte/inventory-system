
require('dotenv').config();

const express = require('express');
const connectDB = require('./src/config/db');

const productRoutes = require('./src/routes/productRoutes');
const studentRoutes = require('./src/routes/studentRoutes');

const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();

// ---------- Global Middleware ----------
app.use(express.json());

// ---------- Home Route ----------
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Inventory & Data Management API is running'
  });
});

// ---------- API Routes ----------
app.use('/api/products', productRoutes);
app.use('/api/students', studentRoutes);

// ---------- Error Handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start Server After Database Connection ----------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

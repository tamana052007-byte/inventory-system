# inventory-system
# Inventory and Data Management System

## Project Overview

The Inventory and Data Management System is a backend REST API developed using Node.js, Express.js, MongoDB, and Mongoose. It helps manage products, track stock levels, search and filter inventory, and generate inventory reports.

This project was developed for **Web Development III — Assignment 3**.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- Postman for API testing

## Features

- Create, view, update, and delete products.
- Validate product details using Mongoose schemas and middleware.
- Search products by name.
- Filter products by category, supplier, and price range.
- Sort products and use pagination.
- Retrieve an individual product by its ID.
- Increase or decrease product stock safely.
- Generate low-stock alerts.
- Generate category-wise inventory summaries using MongoDB aggregation.
- Handle errors through centralized error-handling middleware.
- Store configuration in environment variables.

## Project Structure

```text
inventory-system/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── productController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── validateObjectId.js
│   │   └── validateProduct.js
│   ├── models/
│   │   └── Product.js
│   ├── routes/
│   │   └── productRoutes.js
│   └── utils/
│       ├── AppError.js
│       └── asyncHandler.js
├── .env.example
├── .gitignore
├── package.json
├── seed.js
└── server.js
```

## Installation and Setup

### Prerequisites

Make sure Node.js, npm, and MongoDB are installed and available.

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd inventory-system
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a guide.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/inventory_db
NODE_ENV=development
```

Use your own valid MongoDB connection string if required. Never commit real credentials or passwords to GitHub.

### 4. Start the server

For development:

```bash
npm run dev
```

Alternatively:

```bash
npm start
```

The server runs at:

`http://localhost:5000`

The root endpoint returns a message confirming that the API is running.

## API Endpoints

Base URL: `http://localhost:5000/api/products`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create a product |
| GET | `/` | Retrieve products |
| GET | `/:id` | Retrieve a product by ID |
| PUT | `/:id` | Update product details |
| PATCH | `/:id/stock` | Adjust product stock |
| DELETE | `/:id` | Delete a product |
| GET | `/low-stock` | Retrieve low-stock products |
| GET | `/summary` | Get category-wise inventory summary |

### Query Parameters

The products endpoint supports:

- `category` — filter by category
- `supplier` — filter by supplier
- `search` — search product names
- `minPrice` and `maxPrice` — filter by price range
- `sort` — sort by fields such as price or name; use `-price` for descending price
- `page` — select the page
- `limit` — set the number of products per page

Example:

```text
GET /api/products?category=Electronics&sort=-price&page=1&limit=5
```

### Stock Adjustment Example

Send a PATCH request to `/api/products/:id/stock` with a JSON body:

```json
{
  "change": 10
}
```

A positive value increases stock; a negative value decreases stock. The API prevents a sale from reducing stock below zero.

## Testing

The API can be tested using Postman. Test product creation, retrieval, updates, deletion, filtering, sorting, pagination, stock adjustments, low-stock alerts, and category-wise inventory summaries.

## Learning Outcomes

This project demonstrates REST API development, database connectivity, Mongoose schema validation, CRUD operations, query parameters, aggregation pipelines, middleware, and error handling.

## Author

**Tamanna**

Web Development III — Assignment 3

## License

This project was developed for academic and educational purposes.

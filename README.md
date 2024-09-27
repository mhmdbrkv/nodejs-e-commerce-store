# Node.js E-Commerce Store

## Description

A brief description of your e-commerce application. What features does it offer? What technology stack is used?

## Key Features

- Database CRUD Operations: Perform Create, Read, Update, Delete operations on products, users, and orders.

- User Profile Management: Users can manage personal information, order history, and preferences.

- Authentication & Authorization: Secure user registration, login, and session management with JWT-based authentication.

- Admin Dashboard: Admin interface for managing users, products, and orders.

- Product Management: Add, update, or delete products, manage product categories, and inventory control.

- Pagination & Search: Efficient product pagination and search capabilities for a smoother user experience.

- Product Reviews: Users can leave reviews and ratings on products.

- Shopping Cart & Checkout: Full shopping cart system, including adding/removing items and proceeding to checkout.

- Payment Integration: Stripe integration for secure and smooth payments.

- File Uploading: Upload product images with Cloudinary for optimized storage.

- Email System: Nodemailer for sending transactional emails (e.g., order confirmations, password resets).

- Error Handling: Centralized error handling system with detailed logging.

- Security Enhancements: Built-in protection against common threats such as XSS, CSRF, and data validation errors.

- Caching: Redis integration for caching and boosting performance.

## Technologies Used

- Backend: Node.js, Express.js
- Database: MongoDB
- Caching: Redis
- Payment Gateway: Stripe
- File Storage: Cloudinary
- Email Service: Nodemailer (via SMTP)
- Security: JWT for authentication, bcrypt for password hashing

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mhmdbrkv/nodejs-e-commerce-store.git
   ```

## Navigate

```bash
   cd nodejs-e-commerce-store
```

```bash
   npm install
```

## Configuration (.env)

- PORT=3000
- NODE_ENV=development
- CLIENT_URL=http://localhost:3000
- DB_CONNECT=mongodb://localhost:27017/ecommerce

- UPSTASH_REDIS_URL=your-redis-url

- JWT_ACCESS_SECRET_KEY=your-access-token-secret
- JWT_REFRESH_SECRET_KEY=your-refresh-token-secret
- JWT_ACCESS_EXPIRE_TIME=15m
- JWT_REFRESH_EXPIRE_TIME=7d

- EMAIL_HOST=smtp.gmail.com
- EMAIL_PORT=587
- EMAIL_USER=your-email@example.com
- EMAIL_PASSWORD=your-email-password

- CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
- CLOUDINARY_API_KEY=your-cloudinary-api-key
- CLOUDINARY_API_SECRET_KEY=your-cloudinary-api-secret
- CLOUDINARY_URL=your-cloudinary-url

- STRIPE_SECRET=your-stripe-secret-key

## Usage

```bash
   npm start
```

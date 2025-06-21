# Node.js E-Commerce Store

## Overview
This is a Node.js-based RESTful API for an e-commerce platform, built with Express.js and MongoDB. It enables users to browse products, manage carts, and complete purchases, while admins can handle product and order management. The project showcases scalable architecture, secure authentication, and Object-Oriented Programming (OOP) principles for modular design, reflecting clean and maintainable code practices.

## Features
- **Product Management**: CRUD operations for products (title, price, description, image).
- **User Authentication**: Secure signup/login with JWT-based authentication.
- **Shopping Cart**: Add, update, or remove items in the cart.
- **Order Processing**: Create and track orders with payment integration (e.g., Stripe).
- **Data Validation**: Robust input validation using Joi.
- **Error Handling**: Consistent error responses for reliable API usage.
- **Database**: MongoDB for flexible and scalable data storage.

## Tech Stack
- **Node.js**: Server-side runtime.
- **Express.js**: Framework for RESTful APIs.
- **MongoDB**: NoSQL database with Mongoose ODM.
- **JWT**: For secure user authentication.
- **Joi**: For request validation.
- **Stripe**: For payment processing.
- **Git**: Version control.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/mhmdbrkv/nodejs-e-commerce-store.git
   cd nodejs-e-commerce-store
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```
4. **Start MongoDB**:
   Ensure MongoDB is running locally or provide a cloud MongoDB URI.
5. **Run the Application**:
   ```bash
   npm start
   ```
   The API is available at `http://localhost:3000`.

## API Endpoints
- **POST /api/auth/signup**: Register a new user.
- **POST /api/auth/login**: Authenticate and receive a JWT.
- **GET /api/products**: List all products.
- **POST /api/products**: Create a product (admin only).
- **GET /api/products/:id**: Get product details.
- **PUT /api/products/:id**: Update a product (admin only).
- **DELETE /api/products/:id**: Delete a product (admin only).
- **POST /api/cart**: Add item to cart.
- **POST /api/orders**: Create an order.

## Usage
1. Sign up or log in to obtain a JWT token.
2. Include the token in the `Authorization` header (`Bearer <token>`) for protected routes.
3. Browse products, manage your cart, and place orders via the API.

## Project Structure
```
nodejs-e-commerce-store/
├── controllers/      # API request handlers
├── models/          # Mongoose schemas (Product, User, Order, Cart)
├── routes/          # Express route definitions
├── middlewares/     # Authentication and validation middleware
├── config/          # Database and app configurations
├── .env             # Environment variables
├── server.js        # Application entry point
└── README.md        # Project documentation
```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
MIT License. See [LICENSE](LICENSE) for details.

## Contact
Reach out to [mhmdbrkv](https://github.com/mhmdbrkv) for questions or feedback.

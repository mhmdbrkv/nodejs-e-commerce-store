import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss";

import ApiError from "./Utils/apiError.js";
import errorMiddleware from "./Middleware/error.middleware.js";
import mountRoutes from "./Routes/index.js";
import connectDB from "./Utils/db.js";

dotenv.config();
const app = express();

// Configure CORS with specific options
const corsOptions = {
  origin: process.env.CLIENT_URL, // Allow a single origin
  credentials: true, // Allow cookies and HTTP authentication
};

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//middlewares
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "20kb" })); // allows you to parse the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // sanitizes user-supplied data to prevent MongoDB Operator Injection.
app.use(xss); // filter input from users to prevent XSS attacks.

// use express-rate-limit
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: ["price", "sold", "quantity", "ratingsNumber", "avgRatings"],
  })
);

app.options("*", cors());

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError("Route not found", 404));
});

// Global Error Handling Inside Express
app.use(errorMiddleware);

//listen server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});

// Handling Rejections Outside Express
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection at:", err.name, err.message);
  server.close(() => {
    console.error("Shuttinf Down...");
    process.exit(1);
  });
});

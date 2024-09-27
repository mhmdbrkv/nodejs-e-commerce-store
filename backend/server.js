import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import ApiError from "./Utils/apiError.js";
import errorMiddleware from "./Middleware/error.middleware.js";
import mountRoutes from "./Routes/index.js";
import connectDB from "./Utils/db.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError("Route not found", 404));
});

// Global Error Handling Inside Express
app.use(errorMiddleware);

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

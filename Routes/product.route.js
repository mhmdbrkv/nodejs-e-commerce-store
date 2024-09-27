import express from "express";
const router = express.Router({ mergeParams: true });
import multer from "multer";

import {
  getAllProducts,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  setProductImage,
  categoriesFilter,
  getRecommendedProducts,
} from "../Controllers/product.controller.js";

import {
  mongoIdValidator,
  createProductValidator,
  updateProductValidator,
  getAllProductsValidator,
} from "../Validators/product.validator.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";
import reviewsRoute from "./review.route.js";

// Nested routes
router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(getAllProductsValidator, categoriesFilter, getAllProducts)
  .post(
    guard,
    allowedTo("admin"),
    multer().single("image"),
    createProductValidator,
    setProductImage,
    createProduct
  );

router.get("/recommendations", getRecommendedProducts);

router
  .route("/:id")
  .get(mongoIdValidator, getOneProduct)
  .put(guard, allowedTo("admin"), updateProductValidator, updateProduct)
  .delete(guard, allowedTo("admin"), mongoIdValidator, deleteProduct);

export default router;

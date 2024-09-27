import express from "express";
const router = express.Router();

import {
  getAllCategories,
  getOneCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../Controllers/category.controller.js";

import {
  mongoIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from "../Validators/category.validator.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";
import productRoute from "./product.route.js";

router
  .route("/")
  .get(getAllCategories)
  .post(createCategoryValidator, guard, allowedTo("admin"), createCategory);

//Nested Routes
router.use("/:categoryId/products", productRoute);

router
  .route("/:id")
  .get(mongoIdValidator, getOneCategory)
  .put(updateCategoryValidator, guard, allowedTo("admin"), updateCategory)
  .delete(mongoIdValidator, guard, allowedTo("admin"), deleteCategory);

export default router;

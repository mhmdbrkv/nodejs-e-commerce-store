import { check } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import ApiError from "../Utils/apiError.js";
import Category from "../Models/category.model.js";
import Product from "../Models/product.model.js";
import slugify from "slugify";

export const mongoIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter product id to search by")
    .isMongoId()
    .withMessage("Invalid mongo db product id format")
    .custom(async (value, { req }) => {
      const product = await Product.findById(value);
      if (!product) throw new ApiError("No product found", 404);
      return true;
    }),

  validatorMiddleware,
];

export const createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("product name is required")
    .isString()
    .withMessage("product name is required as a string")
    .isLength({ min: 8, max: 32 })
    .withMessage("product name length must be between 8 and 32 character")
    .custom(async (value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isString()
    .withMessage("product description is required as a string")
    .isLength({ min: 12, max: 60 })
    .withMessage("description length must be between 12 and 60 character"),

  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .custom((value) => {
      if (value < 0) throw new ApiError("price cannot be negative", 400);
      return true;
    }),

  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .custom((value) => {
      if (value < 0) throw new ApiError("quantity cannot be negative", 400);
      return true;
    }),

  check("category")
    .notEmpty()
    .withMessage("product category id is required")
    .custom(async (value, { req }) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new ApiError(`Category not found with id: ${value}`, 404);
      }
      return true;
    }),

  validatorMiddleware,
];

export const updateProductValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter product id to search by")
    .isMongoId()
    .withMessage("Invalid mongo db product id format")
    .custom(async (value, { req }) => {
      const product = await Product.findById(value);
      if (!product) throw new ApiError("No product found", 404);
      return true;
    }),

  check("name")
    .optional()
    .isString()
    .withMessage("product name is required as a string")
    .isLength({ min: 8, max: 32 })
    .withMessage("product name length must be between 8 and 32 character")
    .custom(async (value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("description")
    .optional()
    .isString()
    .withMessage("product description is required as a string")
    .isLength({ min: 12, max: 60 })
    .withMessage("description length must be between 12 and 60 character"),

  check("price").optional().notEmpty().withMessage("product price is required"),

  check("quantity")
    .optional()
    .isLength({ min: 1 })
    .withMessage("product quantity must be 1 or more"),

  check("category")
    .optional()
    .custom(async (value, { req }) => {
      const category = await Category.findById(value);
      if (!category) {
        throw new ApiError(`Category not found with id: ${value}`, 404);
      }
      return true;
    }),

  validatorMiddleware,
];

export const getAllProductsValidator = [
  check("categoryId")
    .optional()
    .isMongoId()
    .withMessage("invalid category id format")
    .custom(async (value) => {
      const categoryExist = await Category.findById(value);
      if (!categoryExist)
        throw new ApiError(`No category found with This id: ${value}`, 404);
    }),

  validatorMiddleware,
];

import { check } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import ApiError from "../Utils/apiError.js";
import Category from "../Models/category.model.js";
import slugify from "slugify";

export const mongoIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter category id to search by")
    .isMongoId()
    .withMessage("Invalid mongo db category id format")
    .custom(async (value, { req }) => {
      const category = await Category.findById(value);
      if (!category) throw new ApiError("No category found", 404);
      return true;
    }),

  validatorMiddleware,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name is required as a string")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name length must be between 3 and 32 character")
    .custom(async (value, { req }) => {
      const category = await Category.findOne({ name: value });
      if (category) {
        throw new ApiError(`Category already exists`, 400);
      }

      req.body.slug = slugify(value);
      return true;
    }),

  validatorMiddleware,
];

export const updateCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter category id to search by")
    .isMongoId()
    .withMessage("Invalid mongo db category id format")
    .custom(async (value, { req }) => {
      const category = await Category.findById(value);
      if (!category) throw new ApiError("No category found", 404);
      return true;
    }),

  check("name")
    .optional()
    .isString()
    .withMessage("Category name is required as a string")
    .isLength({ min: 8, max: 32 })
    .withMessage("Category name length must be between 8 and 32 character")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  validatorMiddleware,
];

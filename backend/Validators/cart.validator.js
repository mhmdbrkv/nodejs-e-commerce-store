import { check } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import ApiError from "../Utils/apiError.js";

export const addToCartValidator = [
  check("product")
    .notEmpty()
    .withMessage("product id is required")
    .isMongoId()
    .withMessage("Invalid mongo id format"),

  check("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .custom(async (value, { req }) => {
      if (+value <= 0)
        throw new ApiError("Quantity must be greater than 0", 400);

      return true;
    }),

  validatorMiddleware,
];

export const updateCartItemValidator = [
  check("product")
    .notEmpty()
    .withMessage("product id is required")
    .isMongoId()
    .withMessage("Invalid mongo id format"),

  check("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .custom(async (value, { req }) => {
      if (+value <= 0)
        throw new ApiError("Quantity must be greater than 0", 400);

      return true;
    }),

  validatorMiddleware,
];

export const removeCartItemValidator = [
  check("product")
    .optional()
    .notEmpty()
    .withMessage("product id is required")
    .isMongoId()
    .withMessage("Invalid mongo id format"),

  validatorMiddleware,
];

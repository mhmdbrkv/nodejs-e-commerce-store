import { body, check, param } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import Product from "./../Models/product.model.js";
import User from "./../Models/user.model.js";
import ApiError from "../Utils/apiError.js";
import Review from "../Models/review.model.js";

export const createReviewValidator = [
  check("content")
    .notEmpty()
    .withMessage("content is required")
    .isLength({ min: 4 })
    .withMessage("content must be at least 4 characters"),

  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),

  check("productId")
    .notEmpty()
    .withMessage("productId is required")
    .isMongoId()
    .withMessage("Invalid mongo db productId format")
    .custom((value, { req }) => {
      const product = Product.findById(value);
      if (!product) {
        throw new ApiError("Product not found", 404);
      }
      return true;
    }),
  body().custom(async (value, { req }) => {
    const review = await Review.findOne({
      $and: [{ userId: req.user._id }, { productId: req.body.productId }],
    });
    if (review) {
      throw new ApiError("You can only leave one review per product", 400);
    }
    req.body.userId = req.user._id;
    return true;
  }),
  validatorMiddleware,
];

export const updateReviewValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid mongo db reviewId format"),

  check("content")
    .optional()
    .isLength({ min: 4 })
    .withMessage("content must be at least 4 characters"),

  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),

  param().custom(async (value, { req }) => {
    const review = await Review.findOne({
      $and: [{ _id: req.params.id }, { userId: req.user._id }],
    });
    if (!review) {
      throw new ApiError(
        `No review found with id: ${req.params.id} or this review is not yours`,
        404
      );
    }
    return true;
  }),
  validatorMiddleware,
];

export const reviewIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid mongo db reviewId format"),

  param().custom(async (value, { req }) => {
    const review = await Review.findOne({
      $and: [{ _id: req.params.id }, { userId: req.user._id }],
    });
    if (!review) {
      throw new ApiError(
        `No review found with id: ${req.params.id} or this review is not yours`,
        404
      );
    }
    return true;
  }),
  validatorMiddleware,
];

export const getAllReviewsValidator = [
  check("productId")
    .optional()
    .isMongoId()
    .withMessage("invalid product id format")
    .custom(async (value) => {
      const productExist = await Product.findById(value);
      if (!productExist)
        throw new ApiError(`No product found with This id: ${value}`, 404);
    }),
  check("userId")
    .optional()
    .isMongoId()
    .withMessage("invalid user id format")
    .custom(async (value) => {
      const userExist = await User.findById(value);
      if (!userExist)
        throw new ApiError(`No user found with This id: ${value}`, 404);
    }),
  validatorMiddleware,
];

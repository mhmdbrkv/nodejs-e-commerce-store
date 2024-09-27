import { check } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import User from "../Models/user.model.js";
import ApiError from "../Utils/apiError.js";
import bcrypt from "bcryptjs";

export const mongoIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter user id to search by")
    .isMongoId()
    .withMessage("Invalid mongo db user id format")
    .custom(async (value, { req }) => {
      const user = await User.findById(value);
      if (!user) throw new ApiError("No user found", 404);
      else if (req.user.role !== "admin" && req.user._id !== value)
        throw new ApiError("Not authorized to perform this action", 403);

      return true;
    }),

  validatorMiddleware,
];

export const createUserValidator = [
  check("firstName")
    .notEmpty()
    .withMessage("User firstName is required")
    .isString()
    .withMessage("User firstName is required as a string")
    .isLength({ min: 3, max: 12 })
    .withMessage("User name length must be between 3 and 12 character"),

  check("lastName")
    .optional()
    .isString()
    .withMessage("User lastName is required as a string")
    .isLength({ min: 3, max: 12 })
    .withMessage("User name length must be between 3 and 12 character"),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email is required as a valid email format")
    .custom(async (value, { req }) => {
      const exists = await User.findOne({ email: value });
      if (exists) {
        throw new ApiError("User email is unavilable", 400);
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 8 })
    .withMessage("User password length must be more than 8 characters")
    .custom(async (value, { req }) => {
      let regex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
      if (!regex.test(value)) {
        throw new ApiError(
          "Password must contain 8 characters and at least one number, one letter and one unique character such as !#$%&? ",
          400
        );
      }
      return true;
    }),

  validatorMiddleware,
];

export const updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter user id to search by")
    .isMongoId()
    .withMessage("Invalid mongo db user id format")
    .custom(async (value, { req }) => {
      const user = await User.findById(value);
      if (!user) throw new ApiError("No user found", 404);
      else if (req.user.role !== "admin" && req.user._id !== value)
        throw new ApiError("Not authorized to perform this action", 403);

      return true;
    }),

  check("firstName")
    .optional()
    .isString()
    .withMessage("User firstName is required as a string")
    .isLength({ min: 3, max: 12 })
    .withMessage("User name length must be between 3 and 12 character"),

  check("lastName")
    .optional()
    .isString()
    .withMessage("User lastName is required as a string")
    .isLength({ min: 3, max: 12 })
    .withMessage("User name length must be between 3 and 12 character"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("User email is required as a valid email format")
    .custom(async (value, { req }) => {
      const exists = await User.findOne({ email: value });
      if (exists) {
        throw new ApiError("User email is unavilable", 400);
      }
      return true;
    }),

  check("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("User password length must be more than 8 characters")
    .custom(async (value, { req }) => {
      let regex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
      if (!regex.test(value)) {
        throw new ApiError(
          "Password must contain 8 characters and at least one number, one letter and one unique character such as !#$%&? ",
          400
        );
      }
      return true;
    }),

  check("profileImage").optional(),
  validatorMiddleware,
];

export const changeLoggedUserPasswordValidator = [
  check("oldPassword")
    .notEmpty()
    .withMessage("User old password is required")
    .custom(async (value, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) throw new ApiError("No user found for this id", 404);

      const isMatch = await bcrypt.compare(value, req.user.password);
      if (!isMatch) return new ApiError("Enter the correct old password", 400);

      return true;
    }),

  check("newPassword")
    .notEmpty()
    .withMessage("User new password is required")
    .isLength({ min: 8 })
    .withMessage("User password length must be more than 8 characters")
    .custom(async (value, { req }) => {
      let regex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
      if (!regex.test(value)) {
        throw new ApiError(
          "Password must contain 8 characters and at least one number, one letter and one unique character such as !#$%&? ",
          400
        );
      }
      return true;
    }),

  validatorMiddleware,
];

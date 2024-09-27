import { check } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import ApiError from "../Utils/apiError.js";
import User from "../Models/user.model.js";

export const signupValidator = [
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

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("User email is required as a valid email format"),
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

export const newPasswordValidator = [
  check("newPassword")
    .notEmpty()
    .withMessage("newPassword is required")
    .isLength({ min: 8 })
    .withMessage("Password length must be more than 8 characters")
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

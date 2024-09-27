import { check } from "express-validator";
import validatorMiddleware from "../Middleware/validation.middleware.js";
import Coupon from "../Models/coupon.model.js";

export const createCouponValidator = [
  check("code")
    .notEmpty()
    .withMessage("coupon code required")
    .custom(async (val, { req }) => {
      const coupon = await Coupon.findOne({ code: val });
      if (coupon) throw new Error("coupon already exists with the same code");
      return true;
    }),
  check("expiresIn")
    .notEmpty()
    .withMessage("coupon expire date value required")
    .custom((val, { req }) => {
      if (new Date(val).getTime() <= Date.now()) {
        throw new Error(
          `coupon expire date must be greater than the current date:
          ${new Date().toDateString()}`
        );
      }
      return true;
    }),
  check("discount")
    .notEmpty()
    .withMessage("coupon discount value required")
    .isNumeric()
    .withMessage("discount must be a number")
    .isLength({ min: 0, max: 100 })
    .withMessage("discount value must be between 0 and 100"),

  validatorMiddleware,
];

export const updateCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter coupon id to search by")
    .isMongoId()
    .withMessage("invalid coupon id format"),
  check("code")
    .optional()
    .custom(async (val, { req }) => {
      const coupon = await Coupon.findOne({ code: val });
      if (coupon) throw new Error("coupon already exists with the same code");
      return true;
    }),
  check("expiresIn")
    .optional()
    .custom((val, { req }) => {
      if (new Date(val).getTime() <= Date.now()) {
        throw new Error(
          `coupon expire date must be greater than the current date:
          ${new Date().toDateString()}`
        );
      }
      return true;
    }),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("discount must be a number")
    .isLength({ min: 0, max: 100 })
    .withMessage("discount value must be between 0 and 100"),

  validatorMiddleware,
];

export const couponIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("Enter coupon id to search by")
    .isMongoId()
    .withMessage("Invalid mongo db coupon id format"),

  validatorMiddleware,
];

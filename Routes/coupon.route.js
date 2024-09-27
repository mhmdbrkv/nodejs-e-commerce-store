import express from "express";
const router = express.Router();

import {
  createCouponValidator,
  updateCouponValidator,
  couponIdValidator,
} from "../Validators/coupon.validator.js";

import {
  getCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../Controllers/coupon.controller.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";

router.use(guard);

router
  .route("/")
  .get(allowedTo("admin"), getCoupons)
  .post(allowedTo("admin"), createCouponValidator, createCoupon);

router.post("/apply-coupon", applyCoupon);

router.use(allowedTo("admin"));

router
  .route("/:id")
  .get(couponIdValidator, getCoupon)
  .put(updateCouponValidator, updateCoupon)
  .delete(couponIdValidator, deleteCoupon);

export default router;

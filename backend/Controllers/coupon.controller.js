import Coupon from "../Models/coupon.model.js";
import ApiError from "../Utils/apiError.js";
import asyncHandler from "express-async-handler";

import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "./handlersFactory.js";

export const getCoupons = getAll(Coupon);

export const getCoupon = getOne(Coupon);

export const createCoupon = createOne(Coupon);

export const updateCoupon = updateOne(Coupon);

export const deleteCoupon = deleteOne(Coupon);

export const applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    code: req.body.coupon,
    expiresIn: { $gt: Date.now() },
    isActive: true,
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`, 404));
  }

  // 2) Get logged user cart to get total cart price
  const cart = req.user.cart;

  const { totalAmount } = cart;

  // 3) Calculate price after discount
  const totalAmountAfterDiscount = (
    totalAmount -
    (totalAmount * coupon.discount) / 100
  ).toFixed(2);

  cart.totalAmountAfterDiscount = totalAmountAfterDiscount;
  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    CartItems: req.user.cart.cartItems.length,
    data: req.user.cart,
  });
});

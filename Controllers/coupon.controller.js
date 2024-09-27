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

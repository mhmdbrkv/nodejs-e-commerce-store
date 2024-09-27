import express from "express";

const router = express.Router();

import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItems,
} from "../Controllers/cart.controller.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";

import {
  addToCartValidator,
  updateCartItemValidator,
  removeCartItemValidator,
} from "./../Validators/cart.validator.js";

router.use(guard, allowedTo("customer"));

router
  .route("/")
  .get(getCartItems)
  .post(addToCartValidator, addToCart)
  .put(updateCartItemValidator, updateCartItem)
  .delete(removeCartItemValidator, removeCartItems);

export default router;

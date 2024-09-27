import asyncHandler from "express-async-handler";
import ApiError from "../Utils/apiError.js";

const calcCartTotalPrice = async (user) => {
  if (user.cart.cartItems.length > 0) {
    await user.populate("cart.cartItems.product");

    let totalPrice = 0;

    user.cart.cartItems.forEach((item) => {
      totalPrice += +item.product.price * +item.quantity;
    });

    user.cart.totalAmount = +totalPrice.toFixed(2);
  } else {
    user.cart.totalAmount = 0;
  }
  return;
};

export const getCartItems = asyncHandler(async (req, res, next) => {
  const user = await req.user.populate("cart.cartItems.product");

  res.status(200).json({
    status: "success",
    results: user.cart.cartItems.length,
    data: user.cart,
  });
});

export const addToCart = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // check if product exists in user card
  let existingItem = user.cart.cartItems.find(
    (item) => item.product.toString() === req.body.product
  );

  if (existingItem) {
    existingItem.quantity += +req.body.quantity;
  } else {
    user.cart.cartItems.push(req.body);
  }

  // update cart total price
  await calcCartTotalPrice(user);

  await user.save();

  res.status(201).json({
    status: "success",
    results: user.cart.cartItems.length,
    message: "Item added successfully",
    data: user.cart,
  });
});

export const updateCartItem = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { quantity } = req.body;

  let existingItem = user.cart.cartItems.find(
    (item) => req.body.product === item.product.toString()
  );

  existingItem.quantity = +quantity;

  // update cart total price
  await calcCartTotalPrice(user);

  await user.save();

  res.status(200).json({
    status: "success",
    results: user.cart.cartItems.length,
    data: user.cart.cartItems,
  });
});

export const removeCartItems = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { product } = req.body;

  if (product) {
    user.cart.cartItems = user.cart.cartItems.filter(
      (item) => item.product.toString() !== req.body.product.toString()
    );
    await calcCartTotalPrice(user);
  } else {
    user.cart.cartItems = [];
    user.cart.totalAmount = 0;
    user.cart.totalAmountAfterDiscount = undefined;
  }
  await user.save();

  res.status(204).send();
});

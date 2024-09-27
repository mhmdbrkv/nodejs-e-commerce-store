import asyncHandler from "express-async-handler";
import { stripe } from "../Utils/stripe.js";
import Coupon from "./../Models/coupon.model.js";
import Order from "../Models/order.model.js";
import Product from "../Models/product.model.js";
import User from "../Models/user.model.js";
import ApiError from "./../Utils/apiError.js";
import sendEmail from "../Utils/sendEmail.js";

export const createCheckoutSession = asyncHandler(async (req, res, next) => {
  const user = await req.user.populate("cart.cartItems.product");
  let { cartItems, totalAmount } = user.cart;
  let { couponCode } = req.body;

  // check if cart is not empty
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return next(new ApiError("Cart is empty", 400));
  }

  // check for products quantity availablity
  for (const item of cartItems) {
    if (item.quantity > item.product.quantity) {
      return next(
        new ApiError(
          `Only ${item.product.quantity} quantity in stock for product: ${item.product.name}`,
          404
        )
      );
    }
  }

  // check if coupon exists, then apply it
  let coupon = null;
  if (couponCode && typeof couponCode === "string") {
    coupon = await Coupon.findOne({
      code: couponCode,
      expiresIn: { $gt: Date.now() },
      isActive: true,
    });

    if (coupon) {
      totalAmount -= Math.round((totalAmount * coupon.discount) / 100);
    } else if (!coupon) {
      return next(new ApiError(`Coupon is invalid or expired`, 404));
    }
  }

  // this is a stripe format of products
  const line_items = cartItems.map((item) => {
    const amount = Math.round(item.product.price) * 100;
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: [item.product.image.url],
        },
        unit_amount: amount,
      },
      quantity: item.quantity,
    };
  });

  let products = cartItems.map((item) => ({
    product: item.product._id,
    price: item.product.price,
    quantity: item.quantity,
  }));

  // create stripe session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/purchase-cancel?session_id={CHECKOUT_SESSION_ID}`,
    discounts: coupon
      ? [
          {
            coupon: await createStripeCoupon(coupon.discount),
          },
        ]
      : [],

    customer_email: req.user.email,
    metadata: {
      user_id: req.user.id,
      couponCode: couponCode || "",
      products: JSON.stringify(products),
    },
  });

  res.status(200).json({
    status: "success",
    amount: totalAmount,
    session_id: session.id,
    session_url: session.url,
  });
});

export const checkoutSuccess = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.body;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    if (session.metadata.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: session.metadata.couponCode },
        {
          isActive: false,
        }
      );
    }

    // create new order
    const products = JSON.parse(session.metadata.products);
    const newOrder = await Order.create({
      user: session.metadata.user_id,
      products: products,
      totalAmount: session.amount_total / 100,
      isPaid: true,
      stripeSessionId: session.id,
    });

    if (!newOrder) {
      return next(new ApiError("Error with creating order", 500));
    }

    // update user cart
    const user = await User.findOneAndUpdate(
      { _id: session.metadata.user_id },
      {
        $pull: {
          "cart.cartItems": {
            product: {
              $in: products.map((p) => p.product),
            },
          },
        },
        $set: { "cart.totalAmount": 0 },
      },

      {
        new: true,
      }
    );

    if (!user || !user.cart) {
      return next(new ApiError("Error with updating user cart", 500));
    }

    // Email Options
    const options = {
      email: session.customer_email,
      subject: `Purchase Success`,
      message: `Hi ${
        user.firstName
      },\nWe sent this email to confirm you that your order has been succeed and you have paid ${
        session.amount_total / 100
      } with card.\n\nThe Baraka E-Commerce-Store family`,
    };

    // Sending Email
    try {
      await sendEmail(options);
    } catch (err) {
      return next(new ApiError(err, 500));
    }

    // update sold products
    newOrder.products.forEach(async (item) => {
      const product = await Product.findOne({ _id: item.product });
      if (product.quantity <= 0) {
        return next(
          new ApiError(
            "Error with updating product prperity: 'quantity' and 'sold'",
            500
          )
        );
      }

      product.quantity -= +item.quantity;
      product.sold += +item.quantity;
      await product.save();
    });

    // update sold products
    // newOrder.products.forEach(async (item) => {
    //   await Product.findOneAndUpdate(
    //     { _id: item.product },
    //     {
    //       $inc: { sold: +item.quantity, quantity: -item.quantity },
    //     }
    //   );
    // });

    res.status(201).json({
      status: "success",
      message: "Payment success, order created and coupon handled",
      order: newOrder,
    });
  } else return next(new ApiError("Purchase Falid", 400));
});

const createStripeCoupon = asyncHandler(async (discount) => {
  const coupon = await stripe.coupons.create({
    percent_off: discount,
    duration: "once",
  });
  return coupon.id;
});

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must be belong to user"],
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product id is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
        price: {
          type: Number,
          required: [true, "Quantity is required"],
        },
      },
    ],

    totalAmount: {
      type: Number,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    stripeSessionId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

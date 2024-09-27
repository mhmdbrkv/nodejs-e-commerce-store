import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "coupon code required"],
      unique: [true, "coupon code must be unique"],
      trim: true,
    },

    discount: {
      type: Number,
      required: [true, "discount required"],
      min: 0,
      max: 100,
    },

    expiresIn: {
      type: Date,
      required: [true, "coupon expiresIn date required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;

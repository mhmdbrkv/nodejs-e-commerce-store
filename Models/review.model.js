import mongoose from "mongoose";
import Product from "./product.model.js";

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      minLength: [4, "Content must be at least 4 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product id is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
  },
  { timestamps: true }
);

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { productId: productId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {
      $group: {
        _id: "productId",
        avgRatings: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      avgRatings: result[0].avgRatings,
      ratingsNumber: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      avgRatings: 0,
      ratingsNumber: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.productId);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatingsAndQuantity(doc.productId);
  }
});

reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatingsAndQuantity(doc.productId);
  }
});

export default mongoose.model("Review", reviewSchema);

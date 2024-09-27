import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
      trim: true,
      minLength: [8, "product name length must be more than 8 characters"],
      maxLength: [32, "product name length must be more than 32 character"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      trim: true,
      minLength: [12, "Description length must be more than 12 characters"],
      maxLength: [60, "Description length must be more than 60 character"],
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, "quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
      required: [true, "sold number is required"],
    },
    image: {
      public_id: String,
      url: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category id is required"],
    },
    ratingsNumber: {
      type: Number,
      default: 0,
    },
    avgRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual property for getting the reviews of the product with the response
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "productId",
  localField: "_id",
});

const Product = mongoose.model("Product", productSchema);

export default Product;

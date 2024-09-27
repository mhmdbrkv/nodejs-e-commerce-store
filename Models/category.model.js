import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      unique: [true, "category name already exists"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;

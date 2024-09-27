import asyncHandler from "express-async-handler";
import Product from "../Models/product.model.js";
import ApiError from "../Utils/apiError.js";
import { cloudinaryUploadImage } from "./../Utils/cloudinary.js";

import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "./handlersFactory.js";

export const getAllProducts = getAll(Product, "Product");

export const getOneProduct = getOne(Product, "reviews");

export const createProduct = createOne(Product);

export const updateProduct = updateOne(Product);

export const deleteProduct = deleteOne(Product);

export const setProductImage = asyncHandler(async (req, res, next) => {
  if (!req.file || Object.keys(req.file || {}).length === 0)
    return next(new ApiError("no file found", 404));

  const result = await cloudinaryUploadImage(
    req.file.buffer,
    `product_images/${req.body.name}`
  );

  req.body.image = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  next();
});

export const getRecommendedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.aggregate([
    {
      $sample: { size: 3 },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        price: 1,
        description: 1,
        image: 1,
        avgRatings: 1,
        ratingsNumber: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: products,
  });
});

// Nested route GET specific category products
export const categoriesFilter = (req, res, next) => {
  if (req.params.categoryId) {
    req.filterObj = { category: req.params.categoryId };
  } else req.filterObj = {};
  next();
};

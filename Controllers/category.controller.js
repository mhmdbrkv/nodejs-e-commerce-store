import redis from "../Utils/redis.js";
import Category from "../Models/category.model.js";
import asyncHandler from "express-async-handler";

import { getOne, createOne, updateOne, deleteOne } from "./handlersFactory.js";

export const getAllCategories = asyncHandler(async (req, res) => {
  // get stored categories from redis for quick access
  let categories = await redis.get("categories");

  if (categories) {
    return res
      .status(200)
      .json({ status: "success", data: JSON.parse(categories) });
  }

  categories = await Category.find({}).lean();

  // store in redis for quick access
  await redis.set("categories", JSON.stringify(categories));

  res.status(200).json({ status: "success", data: categories });
});

export const getOneCategory = getOne(Category);

export const createCategory = createOne(Category);

export const updateCategory = updateOne(Category);

export const deleteCategory = deleteOne(Category);

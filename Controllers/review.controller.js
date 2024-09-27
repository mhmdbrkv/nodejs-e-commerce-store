import Review from "../Models/review.model.js";

import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "./handlersFactory.js";

export const getAllReviews = getAll(Review, "Review");

export const getOneReview = getOne(Review, "Review");

export const createReview = createOne(Review, "Review");

export const updateReview = updateOne(Review, "Review");

export const deleteReview = deleteOne(Review, "Review");

// Nested route GET specific product or user reviews
export const reviewsFilter = (req, res, next) => {
  if (req.params.productId) {
    req.filterObj = { productId: req.params.productId };
  } else if (req.params.userId) {
    req.filterObj = { userId: req.params.userId };
  } else req.filterObj = {};
  next();
};

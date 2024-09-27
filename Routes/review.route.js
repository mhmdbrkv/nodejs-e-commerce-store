import express from "express";
const router = express.Router({ mergeParams: true });

import {
  createReviewValidator,
  updateReviewValidator,
  reviewIdValidator,
  getAllReviewsValidator,
} from "../Validators/review.validator.js";

import {
  getAllReviews,
  getOneReview,
  createReview,
  updateReview,
  deleteReview,
  reviewsFilter,
} from "../Controllers/review.controller.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";
router.use(guard, allowedTo("customer"));

router
  .route("/")
  .get(getAllReviewsValidator, reviewsFilter, getAllReviews)
  .post(createReviewValidator, createReview);
router
  .route("/:id")
  .get(reviewIdValidator, getOneReview)
  .put(updateReviewValidator, updateReview)
  .delete(reviewIdValidator, deleteReview);

export default router;

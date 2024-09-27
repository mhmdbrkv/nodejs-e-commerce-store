import express from "express";
import fileUplaod from "express-fileupload";

const router = express.Router();

import {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  setLoggedUserImage,
  removeLoggedUserImage,
  changeLoggedUserPassword,
} from "../Controllers/user.controller.js";

import {
  mongoIdValidator,
  createUserValidator,
  updateUserValidator,
  changeLoggedUserPasswordValidator,
} from "../Validators/user.validator.js";

import { guard, allowedTo } from "../Middleware/auth.middleware.js";
import loggedUserMiddleware from "../Middleware/loggedUser.middleware.js";
import reviewsRoute from "./review.route.js";

router.use(guard);

router
  .route("/")
  .get(allowedTo("admin"), getAllUsers)
  .post(createUserValidator, allowedTo("admin"), createUser);

// Logged User Routes
router
  .route("/profile")
  .get(loggedUserMiddleware, getOneUser)
  .put(loggedUserMiddleware, updateUserValidator, updateUser)
  .delete(loggedUserMiddleware, deleteUser);

router.post(
  "/profile/change-password",
  changeLoggedUserPasswordValidator,
  changeLoggedUserPassword
);
router.post(
  "/profile/set-image",
  fileUplaod({ limits: { fileSize: 50 * 1024 * 1024 } }),
  setLoggedUserImage
);
router.delete("/profile/remove-image", removeLoggedUserImage);

// Nested routes
router.use("/:userId/reviews", reviewsRoute);

router
  .route("/:id")
  .get(mongoIdValidator, getOneUser)
  .put(updateUserValidator, updateUser)
  .delete(mongoIdValidator, deleteUser);

export default router;

import User from "../Models/user.model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import ApiError from "../Utils/apiError.js";
import {
  cloudinaryUploadImage,
  cloudinaryRemoveFile,
} from "./../Utils/cloudinary.js";

import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "./handlersFactory.js";

export const getAllUsers = getAll(User);

export const getOneUser = getOne(User, {
  path: "cart.cartItems.product",
  select: "name description price avgRatings",
});

export const createUser = createOne(User);

export const updateUser = updateOne(User);

export const deleteUser = deleteOne(User);

export const setLoggedUserImage = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files || {}).length === 0)
    return next(new ApiError("no file found", 404));

  const result = await cloudinaryUploadImage(
    req.files.profileImage.data,
    `profile_images/${req.user.firstName}`
  );

  let loggedUser = req.user;

  loggedUser.profileImage = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  loggedUser.save();

  res.status(200).json({
    status: "success",
    message: "User profile image uppdated successfully",
  });
});

export const removeLoggedUserImage = asyncHandler(async (req, res, next) => {
  let loggedUser = req.user;

  await cloudinaryRemoveFile(loggedUser.profileImage.public_id);

  loggedUser.profileImage = {
    public_id: " ",
    url: " ",
  };

  loggedUser.save();

  res.status(200).json({
    status: "success",
    message: "User profile image removed successfully",
  });
});

export const changeLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const newPassword = await bcrypt.hash(req.body.newPassword, 10);

  let loggedUser = req.user;

  loggedUser.password = newPassword;

  loggedUser.save();

  res.status(200).json({
    status: "success",
    message: "Password has been changgged successfully",
  });
});

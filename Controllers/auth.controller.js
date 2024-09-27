import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ApiError from "../Utils/apiError.js";
import User from "../Models/user.model.js";
import sendEmail from "../Utils/sendEmail.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../Utils/jwtToken.js";
import {
  storeRefreshToken,
  removeRefreshToken,
  getRefreshToken,
} from "../Utils/redis.js";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../Utils/setCookie.js";

export const signup = asyncHandler(async (req, res, next) => {
  // find the user by email
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(
      new ApiError(`User with email: ${req.body.email} already exists`, 400)
    );
  }

  // create new user
  const newUser = await User.create(req.body);

  // geerate jwt
  const accessToken = generateAccessToken(newUser._id);
  const refreshToken = generateRefreshToken(newUser._id);

  // store refresh token on redis (upstash)
  await storeRefreshToken(newUser._id, refreshToken);

  // set cookies
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newUser,
    token: accessToken,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  // find the user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.comparePassword(req.body.password))) {
    return next(new ApiError("Incorrect email or password", 404));
  }

  // generate JWT
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // store refresh token on redis (upstash)
  await storeRefreshToken(user._id, refreshToken);

  // set cookies
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: user,
    token: accessToken,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  try {
    // remove refresh token from redis
    if (req.cookies && req.cookies.refreshToken) {
      const decoded = await verifyToken(
        req.cookies.refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY
      );
      await removeRefreshToken(decoded.userId);
    }

    // remove tokens from cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    throw next(new ApiError("Error logging out user", 500));
  }
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new ApiError("No refresh token provided", 404));
    }

    const decoded = await verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    // get RefreshToken from redis
    const storedRefresh = await getRefreshToken(decoded.userId);

    if (!storedRefresh || storedRefresh !== refreshToken) {
      return next(new ApiError("Invalid refresh token", 401));
    }

    // Check if the refresh token is expired
    if (decoded.exp * 1000 < Date.now()) {
      return next(
        new ApiError("Refresh token expired. Please login again", 401)
      );
    }

    // Generate new access token
    const accessToken = generateAccessToken(decoded.userId);

    // Set new access token in cookies
    setAccessTokenCookie(res, accessToken);

    res
      .status(200)
      .json({ status: "success", message: "Token refreshed successfully" });
  } catch (error) {
    return next(new ApiError("Error with refresh token", 500));
  }
});

// forgotPassword
export const forgotPassword = asyncHandler(async (req, res, next) => {
  // Check user
  const user = req.user;

  // generate reset code
  const random = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCode = crypto.createHash("sha256").update(random).digest("hex");

  // 3) Save the reset code in the database
  user.passResetCode = resetCode; // reset code
  user.passResetCodeEat = Date.now() + 10 * 60 * 1000; // reset code expires  in 10 mins
  user.passResetCodeVerified = false; //  set reset code as unverified
  await user.save();

  // Email Options
  const options = {
    email: user.email,
    subject: `Password reset code (valid for 10 mins)`,
    message: `Hi ${user.firstName},\nWe sent the code ${resetCode} to reset your password.\n\nThe Baraka Limited family`,
  };

  // Sending Email
  try {
    await sendEmail(options);
  } catch (err) {
    user.passResetCode = undefined;
    user.passResetCodeEat = undefined;
    user.passResetCodeVerified = undefined;
    await user.save();
    return next(new ApiError(err, 500));
  }

  res.status(200).json({
    status: "success",
    message: `Reset Code was sent successfully to ${user.email}`,
  });
});

// verifyResetCode
export const verifyResetCode = asyncHandler(async (req, res, next) => {
  const code = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passResetCode: code,
    passResetCodeEat: { $gt: Date.now() },
  });

  if (!user) throw new ApiError("Invalid or expired password reset code", 400);

  user.passResetCodeVerified = true;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password reset code is verified" });
});

// resetPassword
export const resetPassword = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user.passResetCodeVerified)
    throw new ApiError(
      "Please verify your password with reset code first.",
      400
    );

  user.password = await bcrypt.hash(req.body.newPassword, 10);
  user.passResetCode = undefined;
  user.passResetCodeEat = undefined;
  user.passResetCodeVerified = undefined;

  await user.save();

  //generate the jwt
  const { accessToken } = generateAccessToken(user._id);

  // set cookie
  setAccessTokenCookie(res, accessToken);

  res.status(200).json({
    status: "success",
    message: "Password has been reseted successfully.",
    token: accessToken,
  });
});

import express from "express";
const router = express.Router();

import {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "../Controllers/auth.controller.js";

import { guard } from "../Middleware/auth.middleware.js";

import {
  signupValidator,
  loginValidator,
  newPasswordValidator,
} from "../Validators/auth.validator.js";

router.get("/signup", signupValidator, signup);
router.get("/login", loginValidator, login);
router.get("/logout", logout);
router.get("/refresh-token", refreshToken);

router.use(guard);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", newPasswordValidator, resetPassword);

export default router;

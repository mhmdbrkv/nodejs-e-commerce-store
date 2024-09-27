import express from "express";
const router = express.Router();

import { guard } from "./../Middleware/auth.middleware.js";
import {
  createCheckoutSession,
  checkoutSuccess,
} from "../Controllers/payment.controller.js";

router.use(guard);

router.post("/create-checkout-session", createCheckoutSession);
router.post("/checkout-success", checkoutSuccess);

export default router;

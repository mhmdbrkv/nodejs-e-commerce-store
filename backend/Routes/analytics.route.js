import express from "express";
const router = express.Router();

import { allowedTo, guard } from "./../Middleware/auth.middleware.js";
import { getAnalytics } from "./../Controllers/analytics.controller.js";

router.get("/", guard, allowedTo("admin"), getAnalytics);

export default router;

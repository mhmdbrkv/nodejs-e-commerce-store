import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import productRoutes from "./product.route.js";
import categoryRoutes from "./category.route.js";
import cartRoutes from "./cart.route.js";
import couponRoutes from "./coupon.route.js";
import reviewRoutes from "./review.route.js";
import paymentRoutes from "./payment.route.js";
import analyticsRoutes from "./analytics.route.js";

export default (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/analytics", analyticsRoutes);
};

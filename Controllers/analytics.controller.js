import asyncHandler from "express-async-handler";
import User from "../Models/user.model.js";
import Product from "../Models/product.model.js";
import Order from "../Models/order.model.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);
  const { totalOrders, totalRevenue } = salesData[0] || {
    totalOrders: 0,
    totalRevenue: 0,
  };

  res.status(200).json({
    status: "succes",
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
  });
});

import asyncHandler from "express-async-handler";

export default asyncHandler(async (req, res, next) => {
  if (req.user) req.params.id = req.user._id;

  next();
});

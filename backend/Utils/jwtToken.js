import JWT from "jsonwebtoken";
import ApiError from "./apiError.js";

export const generateAccessToken = (userId) => {
  try {
    const accessToken = JWT.sign(
      { userId },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
      }
    );

    return accessToken;
  } catch (err) {
    throw new ApiError(`Generate Access Token Error: ${err}`);
  }
};

export const generateRefreshToken = (userId) => {
  try {
    const refreshToken = JWT.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
      }
    );

    return refreshToken;
  } catch (err) {
    throw new ApiError(`Generate Refresh Token Error: ${err}`);
  }
};

export const verifyToken = async (token, secretKey) => {
  try {
    const decoded = await JWT.verify(token, secretKey);
    return decoded;
  } catch (err) {
    throw new ApiError(`Verify Token Error: ${err}`);
  }
};

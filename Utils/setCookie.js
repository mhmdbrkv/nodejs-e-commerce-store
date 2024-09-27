export const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevet XSS attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevet CSRF attacks
    maxAge: 15 * 60 * 1000, // 15 minutes,
  });
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevet XSS attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // prevet CSRF attacks
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days,
  });
};

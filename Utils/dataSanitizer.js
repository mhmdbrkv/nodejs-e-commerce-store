export const userSanitizer = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  email: user.email,
  cart: user.cart,
  profileImage: user.profileImage,
  role: user.role,
});

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "User first name required"],
      trim: true,
      minLength: [3, "User name length must be more than 3 characters"],
      maxLength: [12, "User name length must be more than 12 character"],
    },
    lastName: {
      type: String,
      trim: true,
      minLength: [3, "User name length must be more than 3 characters"],
      maxLength: [12, "User name length must be more than 12 character"],
    },
    email: {
      type: String,
      required: [true, "User email required"],
      trim: true,
      unique: [true, "User email must be unique"],
    },
    password: {
      type: String,
      minLength: [8, "User password length must be more than 8 characters"],
      required: [true, "Password required"],
    },
    profileImage: {
      public_id: {
        type: String,
        required: [true, "public_id required"],
      },
      url: {
        type: String,
        required: [true, "url required"],
      },
    },
    cart: {
      cartItems: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product id is required"],
          },
          quantity: {
            type: Number,
            required: [true, "Quantity is required"],
          },
        },
      ],
      totalAmount: {
        type: Number,
        default: 0,
      },
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    passResetCode: String,
    passResetCodeEat: Date,
    passResetCodeVerified: Boolean,
  },
  { timestamps: true }
);

// pre-save hook to hash password before saving in db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// mongoose method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;

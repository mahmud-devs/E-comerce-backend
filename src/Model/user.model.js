const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name missing!!"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email missing!!"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "mobile missing!!"],
      trim: true,
      max: [11, "max length 11"],
      min: [11, "min length 11"],
    },
    adress1: {
      type: String,
      trim: true,
    },
    adress2: {
      type: String,
      trim: true,
    },
    postCode: {
      type: String,
      trim: true,
    },
    divison: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is missing!!"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "merchent", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    OTP: {
      type: Number,
    },
    resetOTP: {
      type: Number,
    },
    otpExpire: {
      type: Number,
    },
    userVerified: {
      type: Boolean,
      default: false,
    },
    recoveryEmail: {
      type: String,
      default: null,
    },
    cartitem: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
    purchasedCart: [{ type: Schema.Types.ObjectId, ref: "PurchasedCart" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);

const mongoose = require("mongoose");
const { Schema, Types, model } = mongoose;
const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    cartItem: [
      {
        type: Types.ObjectId,
        ref: "Cart",
      },
    ],
    purchasedCart: [
      {
        type: Types.ObjectId,
        ref: "PurchasedCart",
      },
    ],
    customerinfo: {
      address1: {
        type: String,
        required: true,
        trim: true,
      },
      address2: {
        type: String,
        trim: true,
      },
      town: {
        type: String,
        required: true,
        trim: true,
      },

      district: {
        type: String,
        required: true,
        trim: true,
      },
      postalcode: {
        type: Number,
      },
    },

    paymentinfo: {
      payementmethod: {
        type: String,
        required: true,
        trim: true,
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      trim: true,
      default: "pending",
      enum: ["pending", "cancled", "processing", "deliverd"],
    },
    subtotal: {
      type: Number,
    },
    totalitem: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("order", orderSchema);

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const invoiceSchema = new Schema(
  {
    subtotal: {
      type: Number,
    },
    cus_details: Object,
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
    tran_id: {
      type: String,
      unique: true,
    },
    val_id: String,
    delivery_status: {
      type: String,
      enum: ["Pending", "Delivered", "canceled"],
      default: "Pending",
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Canceled"],
      default: "Pending",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);

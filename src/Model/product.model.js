const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      max: 5,
      default: 0,
    },
    discount: {
      type: Number,
      max: 100,
      default: 0,
    },
    review: [
      {
        type: String,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "store",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "subcategory",
      required: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);

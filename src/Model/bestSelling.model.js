const mongoose = require("mongoose");
const { Schema } = mongoose;

const bestSellingSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
});

module.exports = mongoose.model("bestSelling", bestSellingSchema);

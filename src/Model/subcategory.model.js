const mongoose = require("mongoose");
const { Schema } = mongoose;

const subcategorySchema = new Schema({
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
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
});

module.exports = mongoose.model("subcategory", subcategorySchema);

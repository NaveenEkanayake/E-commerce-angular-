const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  Productname: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  ImageUrls: {
    type: [String],
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
  },
});

const product = mongoose.model("product", productSchema);
module.exports = product;

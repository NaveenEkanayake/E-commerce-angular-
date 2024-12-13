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
  ImageUrl: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
});

const product = mongoose.model("product", productSchema);
module.exports = product;

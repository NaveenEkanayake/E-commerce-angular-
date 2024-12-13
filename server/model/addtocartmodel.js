const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      imageUrls: {
        type: String,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model("AddtoCart", cartSchema);
module.exports = Cart;

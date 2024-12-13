const mongoose = require("mongoose");
const ProductModel = require("../model/productmodel");
const AddtoCartModel = require("../model/addtocartmodel");
const UserModel = require("../model/usermodel");
const Cart = require("../model/addtocartmodel");

const AddtoCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const { id: userId } = req;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${product.stockQuantity} items are available.`,
      });
    }

    // Deduct the quantity from stock
    product.stockQuantity -= quantity;
    await product.save();

    const firstImageUrl =
      product.ImageUrls && product.ImageUrls.length > 0
        ? product.ImageUrls[0]
        : null;

    if (!firstImageUrl) {
      return res
        .status(400)
        .json({ message: "Product does not have any images" });
    }

    const cart = await AddtoCartModel.create({
      userId,
      products: [
        {
          productId: product._id,
          quantity,
          imageUrls: firstImageUrl,
        },
      ],
      totalAmount: product.price * quantity,
    });

    res.status(201).json({
      message: "Items have been added to cart successfully!",
      addedItems: cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCartItems = async (req, res) => {
  const userId = req.id;
  try {
    if (!userId) {
      return res
        .status(403)
        .json({ message: "Access denied. Customers only." });
    }

    const allCartItems = await AddtoCartModel.find({ userId });
    if (allCartItems.length === 0) {
      return res.status(404).json({ message: "No Cart Items found!" });
    }

    res.status(200).json({
      message: "Cart Items retrieved successfully!",
      retrievedItems: allCartItems,
    });
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getCartItemById = async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.trim();

  try {
    const user = await UserModel.findById(req.id);
    if (!user) {
      return res.status(403).json({ message: "Access denied. Customer only." });
    }
    const cartItem = await AddtoCartModel.findById(cleanedId);
    if (!cartItem) {
      return res.status(404).json({ message: "No CartItem found!" });
    }

    res.status(200).json({
      message: "CartItem retrieved successfully!",
      retrievedData: cartItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const UpdateCartQuantity = async (req, res) => {
  const { id } = req.params;
  const { productId, newQuantity } = req.body;
  const cleanedId = id.trim();
  if (!mongoose.Types.ObjectId.isValid(cleanedId)) {
    return res.status(400).json({ message: "Invalid cart ID format." });
  }

  try {
    const User = await UserModel.findById(req.id);
    if (!User) {
      return res
        .status(403)
        .json({ message: "Access denied. Customers only." });
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    const cartItem = await Cart.findOne({
      _id: cleanedId,
      "products.productId": productId,
    });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found!" });
    }
    const currentQuantity = cartItem.products.find(
      (p) => p.productId.toString() === productId
    ).quantity;
    const quantityDifference = newQuantity - currentQuantity;
    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cleanedId, "products.productId": productId },
      {
        $set: { "products.$.quantity": newQuantity },
      },
      { new: true }
    );
    if (updatedCart) {
      product.stockQuantity -= quantityDifference;
      await product.save();
      let newTotalAmount = 0;
      for (let item of updatedCart.products) {
        const productDetails = await ProductModel.findById(item.productId);
        if (productDetails) {
          newTotalAmount += productDetails.price * item.quantity;
        }
      }

      updatedCart.totalAmount = newTotalAmount;
      await updatedCart.save();

      res.status(200).json({
        message:
          "Cart updated, stock quantity adjusted, and total amount recalculated!",
        updatedData: updatedCart,
      });
    } else {
      return res.status(404).json({ message: "No Cart item found to update!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const DeleteFromCart = async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.trim();

  try {
    const User = await UserModel.findById(req.id);
    if (!User) {
      return res
        .status(403)
        .json({ message: "Access denied. Customers only." });
    }
    const cartItem = await Cart.findById(cleanedId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart Item not found!" });
    }

    // Get the product ID and quantity from the cart item
    const productId = cartItem.products[0].productId;
    const productQuantity = cartItem.products[0].quantity;
    const deletedCart = await Cart.findByIdAndDelete(cleanedId);
    if (!deletedCart) {
      return res.status(404).json({ message: "Cart Item not found!" });
    }
    const product = await ProductModel.findById(productId);
    if (product) {
      product.stockQuantity += productQuantity;
      await product.save();
    }

    res.status(200).json({
      message: "Cart Item deleted successfully and stock quantity updated!",
      deletedData: deletedCart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  AddtoCart,
  UpdateCartQuantity,
  DeleteFromCart,
  getAllCartItems,
  getCartItemById,
};

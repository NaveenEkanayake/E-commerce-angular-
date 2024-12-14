const Cart = require("../model/addtocartmodel");
const Order = require("../model/ordermodel");
const Product = require("../model/productmodel");
const ADMINModel = require("../model/adminmodel");
const UserModel = require("../model/usermodel");

const buyProductsInCart = async (req, res) => {
  try {
    const { id: userId } = req;
    const { cartId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const cart = await Cart.findOne({ _id: cartId, userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found for the given user",
      });
    }
    let totalAmount = 0;
    const productsWithDetails = [];

    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      totalAmount += product.price * item.quantity;
      productsWithDetails.push({
        productId: product._id,
        quantity: item.quantity,
        imageUrls: item.imageUrls,
        price: product.price,
      });
    }
    const orderData = {
      userId: userId,
      cartId: cartId,
      products: productsWithDetails,
      totalAmount: totalAmount,
      status: "pending",
    };
    const order = await Order.create(orderData);
    return res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error.message);
    return res.status(500).json({
      message: "Order placement unsuccessful",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  const adminId = req.id;
  try {
    if (!adminId) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    const allAllOrders = await Order.findOne({});
    if (allAllOrders.length === 0) {
      return res.status(404).json({ message: "No Cart Items found!" });
    }

    res.status(200).json({
      message: " Orders retrieved successfully!",
      retrievedItems: allAllOrders,
    });
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const getOrdersById = async (req, res) => {
  const { id } = req.params;
  const cleanedId = id.trim();

  try {
    const admin = await ADMINModel.findById(req.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const order = await Order.findById(cleanedId);
    if (!order) {
      return res.status(404).json({ message: "No order found!" });
    }

    res.status(200).json({
      message: "Order retrieved successfully!",
      retrievedData: order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteOrders = async (req, res) => {
  const { id } = req.params;

  try {
    const User = await UserModel.findById(req.id);
    if (!User) {
      return res
        .status(403)
        .json({ message: "Access denied. Customers only." });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found!" });
    }

    res.status(200).json({
      message: "Order deleted successfully!",
      deletedData: deletedOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const admin = await ADMINModel.findById(req.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const updatedStatus = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedStatus) {
      return res.status(404).json({ message: "No Order found!" });
    }

    res.status(200).json({
      message: "Order updated successfully!",
      updatedData: updatedStatus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  buyProductsInCart,
  getAllOrders,
  getOrdersById,
  deleteOrders,
  updateStatus,
};

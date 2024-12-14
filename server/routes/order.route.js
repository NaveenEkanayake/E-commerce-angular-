const express = require("express");
const {
  buyProductsInCart,
  getAllOrders,
  getOrdersById,
  deleteOrders,
  updateStatus,
} = require("../controllers/orderController");
const { verifyUserToken } = require("../controllers/userController");
const { verifyAdminToken } = require("../controllers/adminController");
const router = express.Router();

router.post("/buyproduct", verifyUserToken, buyProductsInCart);
router.get("/getOrders", verifyAdminToken, getAllOrders);
router.get("/getOrder/:id", verifyAdminToken, getOrdersById);
router.delete("/deleteOrder/:id", verifyUserToken, deleteOrders);
router.put("/updateStatus/:id", verifyAdminToken, updateStatus);

module.exports = router;

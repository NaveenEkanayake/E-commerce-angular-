const express = require("express");
const {
  AddtoCart,
  DeleteFromCart,
  UpdateCartQuantity,
  getAllCartItems,
  getCartItemById,
} = require("../controllers/addtocartController");
const { verifyUserToken } = require("../controllers/userController");
const router = express.Router();

router.post("/addtocart", verifyUserToken, AddtoCart);
router.put("/updatecart/:id", verifyUserToken, UpdateCartQuantity);
router.delete("/deletefromcart/:id", verifyUserToken, DeleteFromCart);
router.get("/getCartItem/:id", verifyUserToken, getCartItemById);
router.get("/getAllCartItems", verifyUserToken, getAllCartItems);

module.exports = router;

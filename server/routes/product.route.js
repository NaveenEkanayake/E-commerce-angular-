const express = require("express");
const {
  AddProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateInventory,
  searchProducts,
} = require("../controllers/productController");
const { verifyAdminToken } = require("../controllers/adminController");
const { verifyUserToken } = require("../controllers/userController");
const router = express.Router();

router.post("/addProduct", verifyAdminToken, AddProduct);
router.get("/getAllProduct", verifyAdminToken, getAllProducts);
router.get("/getProduct/:id", verifyAdminToken, getProductById);
router.put("/updateProduct/:id", verifyAdminToken, updateProduct);
router.delete("/deleteProduct/:id", verifyAdminToken, deleteProduct);
router.put("/UpdateInventory/:id", verifyAdminToken, updateInventory);
router.post("/search", verifyUserToken, searchProducts);

module.exports = router;

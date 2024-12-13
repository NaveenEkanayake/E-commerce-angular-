const express = require("express");
const { AddProduct } = require("../controllers/productController");
const { verifyAdminToken } = require("../controllers/adminController");
const router = express.Router();

router.post("/addProduct", verifyAdminToken, AddProduct);
module.exports = router;

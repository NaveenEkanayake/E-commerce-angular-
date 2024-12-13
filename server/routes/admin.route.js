const express = require("express");
const {
  Signup,
  LoginAdmin,
  verifyAdminToken,
  getUser,
  refreshToken,
  logout,
} = require("../controllers/adminController");
const router = express.Router();

router.post("/signup", Signup);
router.post("/loginadmin", LoginAdmin);
router.get("/verifyadmintoken", verifyAdminToken, getUser);
router.get("/refresh", refreshToken, verifyAdminToken, getUser);
router.post("/logoutadmin", verifyAdminToken, logout);
module.exports = router;

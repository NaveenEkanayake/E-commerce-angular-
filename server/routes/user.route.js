const express = require("express");
const {
  Signup,
  LoginUser,
  verifyUserToken,
  getUser,
  refreshToken,
  logout,
  getCustomerCount,
} = require("../controllers/userController");
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", LoginUser);
router.get("/getRegisteredCustomerCount", getCustomerCount);
router.get("/verifyusertoken", verifyUserToken, getUser);
router.get("/refresh", refreshToken, verifyUserToken, getUser);
router.post("/logout", verifyUserToken, logout);
module.exports = router;

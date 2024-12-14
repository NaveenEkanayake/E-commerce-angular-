require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/adminmodel");

//env file
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const Signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists with this email.",
        admin: existingAdmin,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      fullname,
      email,
      password: hashedPassword,
      Role: "Admin",
      isActive: false,
    });

    await admin.save();
    return res.status(201).json({
      message: "Admin created successfully!",
      admin,
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const LoginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin not found. Please sign up." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    existingAdmin.isActive = true;
    await existingAdmin.save();
    const token = jwt.sign(
      {
        id: existingAdmin._id,
        email: existingAdmin.email,
        fullname: existingAdmin.fullname,
        isActive: existingAdmin.isActive,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Login successful!",
      admin: existingAdmin,
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyAdminToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  if (!cookies) {
    return res.status(404).json({ message: "No cookies found" });
  }
  const token = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="));
  if (!token) {
    return res.status(404).json({ message: "No Token Found" });
  }

  const actualToken = token.split("=")[1];
  if (!actualToken) {
    return res.status(404).json({ message: "No Token Found" });
  }

  try {
    const decodedUser = jwt.verify(actualToken, JWT_SECRET_KEY);
    req.id = decodedUser.id;
    req.email = decodedUser.email;
    req.fullname = decodedUser.fullname;
    req.userRole = decodedUser.role;
    req.isActive = decodedUser.isActive;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(400).json({ message: "Invalid Token" });
  }
};

const getUser = async (req, res) => {
  const userId = req.id;
  try {
    const user = await Admin.findById(userId, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Get User error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies
    ? cookies
        .split(";")
        .find((c) => c.trim().startsWith("token="))
        .split("=")[1]
    : null;

  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find the token" });
  }

  jwt.verify(prevToken, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: "2h",
    });
    res.clearCookie("token");
    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
      httpOnly: true,
      sameSite: "lax",
    });

    req.id = user.id;
    next();
  });
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.token) {
    return res.status(400).json({ message: "No cookies or token found" });
  }

  const token = cookies.token;

  try {
    jwt.verify(token, JWT_SECRET_KEY);
    res.clearCookie("token", { httpOnly: true });
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  Signup,
  LoginAdmin,
  verifyAdminToken,
  getUser,
  refreshToken,
  logout,
};

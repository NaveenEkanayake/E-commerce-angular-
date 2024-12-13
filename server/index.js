const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const app = express();

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const UserRoute = require("./routes/user.route");
const ProductRoute = require("./routes/product.route");
const AdminRoute = require("./routes/admin.route");
const AddtoCartRoute = require("./routes/addtocart.route");

app.use("/user", UserRoute);
app.use("/admin", AdminRoute);
app.use("/product", ProductRoute);
app.use("/cart", AddtoCartRoute);
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Successfully connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

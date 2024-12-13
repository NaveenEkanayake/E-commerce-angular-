const mongoose = require("mongoose");
const AdminSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    default: "Admin",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;

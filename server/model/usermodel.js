const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
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
    default: "Customer",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const Users = mongoose.model("Users", UserSchema);
module.exports = Users;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  coupons: [
    { couponID: { type: mongoose.Schema.Types.ObjectId, ref: "Coupons" } },
  ],
  isActive: { type: Boolean, default: false, required: true },
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  couponCode: { type: String, required: true },
  couponExpiry: { type: Date, required: true },
  minAmount: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Coupons", couponSchema);

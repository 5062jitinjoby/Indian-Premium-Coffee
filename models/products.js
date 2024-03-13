const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  Description: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number },
  quantity: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  flavour: { type: mongoose.Schema.Types.ObjectId, ref: "Flavours" },
  image: { type: Array, required: true },
  isActive: { type: Boolean, default: true, required: true },
});

module.exports = mongoose.model("Product", productSchema);

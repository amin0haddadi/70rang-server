const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  images: { type: [String] },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Product", productSchema);

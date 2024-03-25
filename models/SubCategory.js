// models/Subcategory.js
const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      default: null,
    },

    name: String,
    // Other properties as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subcategory", subcategorySchema);

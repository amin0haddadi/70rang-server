const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find().lean();
  if (!Category?.length)
    return res.status(400).json({ message: "BAD REQUEST : No products found" });
  res.status(200).json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ message: "BAD REQUEST : name is required" });

  const duplicate = await Category.findOne({ name }).lean().exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "CONFLICT : This Category already exists!" });

  const category = await Category.create({
    name,
  });

  if (category)
    res
      .status(201)
      .json({ message: `CREATED: category ${name} created successfully!` });
  else
    res
      .status(400)
      .json({ message: "BAD REQUEST : Invalid category data recieved" });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const category = await Category.findById(id).exec();
  if (!category)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : category not found" });

  const duplicate = await Category.findOne({ name }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id)
    return res.status(409).json({ message: "CONFLICT : Duplicate username!" });

  category.name = name;

  const updatedCategory = await category.save();
  res
    .status(201)
    .json({ message: `${updatedCategory.name} updated successfully!` });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : category id required" });

  const category = await Category.findById(id).exec();
  if (!category)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : category not found" });

  const deletedCategory = await Category.deleteOne();
  const reply = `category ${category.name} with ID ${category._id} deleted successfully!`;
  res.status(200).json(reply);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "category ID required" });

  const category = await Category.findById(id).lean().exec();

  if (!category) return res.status(404).json({ message: "category not found" });

  res.json(category);
});

module.exports = {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};

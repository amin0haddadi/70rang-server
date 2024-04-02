const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllCategory = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = search ? { name: { $regex: new RegExp(search, "i") } } : {};

  const categories = await Category.find(query).populate("products").lean();

  if (!categories.length) {
    return res
      .status(400)
      .json({ message: "BAD REQUEST : No categories found" });
  }

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

  await Product.deleteMany({ _id: { $in: category.products } }); // Delete associated products
  await Category.deleteOne({ _id: id }); // Delete the category itself

  res
    .status(200)
    .json({ message: `Category ${category.name} deleted successfully` });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 12 } = req.query;

  if (!id) return res.status(400).json({ message: "category ID required" });

  const category = await Category.findById(id)
    .populate({
      path: "products",
      options: {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
      },
    })
    .lean()
    .exec();

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

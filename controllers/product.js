const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require("express-async-handler");

const getAllProducts = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 12 } = req.query;
  let query = {};
  if (search) {
    query.name = { $regex: new RegExp(search, "i") };
  }
  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .lean();
  if (!Product?.length)
    return res.status(400).json({ message: "BAD REQUEST : No products found" });
  res.status(200).json({ products, totalPages });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, images, price, quantity, description, categoryId } = req.body;

  if (!name || !price || !quantity || !categoryId)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : name,price,quantity are required" });

  const category = await Category.findById(categoryId);
  if (!category) return res.status(404).json({ message: "Category not found" });

  const duplicate = await Product.findOne({ name }).lean().exec();
  if (duplicate)
    return res
      .status(409)
      .json({ message: "CONFLICT : This product already exists!" });

  const product = await Product.create({
    name,
    images,
    price,
    quantity,
    description,
    categoryId,
  });

  category.products.push(product._id);
  await category.save();

  if (product)
    res
      .status(201)
      .json({ message: `CREATED: Product ${name} created successfully!` });
  else
    res
      .status(400)
      .json({ message: "BAD REQUEST : Invalid product data recieved" });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id, name, images, price, quantity, description, categoryId } =
    req.body;

  if (!id || !name || !price || !quantity || !categoryId)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const product = await Product.findById(id).exec();
  if (!product)
    return res.status(400).json({ message: "BAD REQUEST : Product not found" });

  const category = await Category.findById(categoryId);
  if (!category) return res.status(404).json({ message: "Category not found" });

  const duplicate = await Product.findOne({ name }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id)
    return res.status(409).json({ message: "CONFLICT : Duplicate Product!" });

  product.name = name;
  product.images = images;
  product.price = price;
  product.quantity = quantity;
  product.description = description;
  product.categoryId = categoryId;

  const updatedProduct = await product.save();
  res
    .status(201)
    .json({ message: `${updatedProduct.name} updated successfully!` });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : Product  id required" });

  const product = await Product.findById(id).exec();
  if (!product)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : Product  not found" });

  await product.deleteOne();
  res
    .status(200)
    .json({ message: `Product ${product.name} deleted successfully` });
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Product ID required" });

  const product = await Product.findById(id)
    .populate("categoryId", "name")
    .lean()
    .exec();

  if (!product) return res.status(404).json({ message: "product not found" });

  res.json(product);
});

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};

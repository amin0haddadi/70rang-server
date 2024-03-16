const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllProducs = asyncHandler(async (req, res) => {
  const products = await Product.find().lean();
  if (!Product?.length)
    return res.status(400).json({ message: "BAD REQUEST : No products found" });
  res.status(200).json(products);
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, images, price, quantity, description } = req.body;

  if (!name || !price || !quantity)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : name,price,quantity are required" });

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
  });

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
  const { id, name, images, price, quantity, description } = req.body;

  if (!id || !name || !price || !quantity)
    return res
      .status(400)
      .json({ message: "BAD REQUEST : All fields are required" });

  const product = await Product.findById(id).exec();
  if (!product)
    return res.status(400).json({ message: "BAD REQUEST : Product not found" });

  const duplicate = await Product.findOne({ name }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id)
    return res.status(409).json({ message: "CONFLICT : Duplicate username!" });

  product.name = name;
  product.images = images;
  product.price = price;
  product.quantity = quantity;
  product.description = description;

  const updatedProduct = await product.save();
  res
    .status(201)
    .json({ message: `${updatedProduct.name} updated successfully!` });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ message: "BAD REQUEST : User id required" });

  const product = await Product.findById(id).exec();
  if (!product)
    return res.status(400).json({ message: "BAD REQUEST : User not found" });

  const deletedProduct = await product.deleteOne();
  const reply = `Username ${product.name} with ID ${product._id} deleted successfully!`;
  res.status(200).json(reply);
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Product ID required" });

  const product = await Product.findById(id).lean().exec();

  if (!product) return res.status(404).json({ message: "product not found" });

  res.json(product);
});

module.exports = {
  getAllProducs,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};

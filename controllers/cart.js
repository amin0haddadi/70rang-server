const Cart = require("../models/Cart");
const asyncHandler = require("express-async-handler");

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  try {
    // Find the user's cart in the database
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      // If the user's cart doesn't exist, return an empty cart
      return res.status(200).json({ products: [] });
    }

    // If the user's cart exists, return the cart with its products
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching user's cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Check if the product is already in the cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // If the cart doesn't exist for the user, create a new one
      cart = await Cart.create({ userId, products: [] });
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId === productId
    );

    if (existingProductIndex !== -1) {
      // If the product already exists in the cart, update its quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // If the product doesn't exist in the cart, add it
      cart.products.push({ productId, quantity });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  getCart,
  addToCart,
};

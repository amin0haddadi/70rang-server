// controllers/subcategoryController.js
const Subcategory = require("../models/SubCategory");
const asyncHandler = require("express-async-handler");

const getAllSubcategories = asyncHandler(async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const subcategories = await Subcategory.find({
      categoryId,
      parentId: null,
    }); // Only top-level subcategories
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getSubcategoryById = asyncHandler(async (req, res) => {
  try {
    const subcategoryId = req.params.subcategoryId;
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAllSubSubcategories = asyncHandler(async (req, res) => {
  try {
    const subcategoryId = req.params.subcategoryId;
    const subSubcategories = await Subcategory.find({
      parentId: subcategoryId,
    });
    res.json(subSubcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const createSubcategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;

    const newSubcategory = new Subcategory({ categoryId, name });
    const savedSubcategory = await newSubcategory.save();

    res.status(201).json(savedSubcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const createSubSubcategory = asyncHandler(async (req, res) => {
  try {
    const parentId = req.params.subcategoryId;
    const { name } = req.body;

    const newSubcategory = new Subcategory({ parentId, name });
    const savedSubcategory = await newSubcategory.save();

    res.status(201).json(savedSubcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const updateSubcategory = asyncHandler(async (req, res) => {
  try {
    const subcategoryId = req.params.subcategoryId;
    const updates = req.body;

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      subcategoryId,
      updates,
      { new: true }
    );
    if (!updatedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json(updatedSubcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteSubcategory = asyncHandler(async (req, res) => {
  try {
    const subcategoryId = req.params.subcategoryId;
    const deletedSubcategory = await Subcategory.findByIdAndDelete(
      subcategoryId
    );
    if (!deletedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getAllSubSubcategories,
  createSubSubcategory,
};

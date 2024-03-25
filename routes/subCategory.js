// routes/subcategoryRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const subcategoryController = require("../controllers/subCategory");

router.get(
  "/:categoryId/subcategories",
  subcategoryController.getAllSubcategories
);
router.get(
  "/:categoryId/subcategories/:subcategoryId",
  subcategoryController.getSubcategoryById
);
router.post(
  "/:categoryId/subcategories",
  subcategoryController.createSubcategory
);
router.put(
  "/:categoryId/subcategories/:subcategoryId",
  subcategoryController.updateSubcategory
);
router.delete(
  "/:categoryId/subcategories/:subcategoryId",
  subcategoryController.deleteSubcategory
);

module.exports = router;

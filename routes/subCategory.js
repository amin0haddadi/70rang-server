// routes/subcategoryRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const subcategoryController = require("../controllers/subCategory");

router.get(
  "/:categoryId/subcategories",
  subcategoryController.getAllSubcategories
);
router.get("/:subcategoryId", subcategoryController.getSubcategoryById);
router.get(
  "/:subcategoryId/subcategories",
  subcategoryController.getAllSubSubcategories
);
router.post(
  "/:categoryId/subcategories",
  subcategoryController.createSubcategory
);
router.post(
  "/:subcategoryId/subcategories",
  subcategoryController.createSubSubcategory
);
router.put("/:subcategoryId", subcategoryController.updateSubcategory);
router.delete("/:subcategoryId", subcategoryController.deleteSubcategory);

module.exports = router;

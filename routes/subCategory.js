// routes/subcategoryRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const subcategoryController = require("../controllers/subCategory");

router.get(
  "/:categoryId/subcategories",
  subcategoryController.getAllSubcategories
);
router.get("/subcategory/:subcategoryId", subcategoryController.getSubcategoryById);
router.get(
  "/:subcategoryId/subsubcategories",
  subcategoryController.getAllSubSubcategories
);
router.post(
  "/:categoryId/subcategories",
  subcategoryController.createSubcategory
);
router.post(
  "/:subcategoryId/subsubcategories",
  subcategoryController.createSubSubcategory
);
router.put("/subcategory/:subcategoryId", subcategoryController.updateSubcategory);
router.delete("/subcategory/:subcategoryId", subcategoryController.deleteSubcategory);

module.exports = router;

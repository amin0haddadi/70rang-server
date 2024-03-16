const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/category");

router
  .route("/")
  .get(categoriesController.getAllCategory)
  .post(categoriesController.createCategory)
  .patch(categoriesController.updateCategory)
  .delete(categoriesController.deleteCategory);

router.route("/:id").get(categoriesController.getCategoryById);

module.exports = router;

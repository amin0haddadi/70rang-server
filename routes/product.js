const express = require("express");
const router = express.Router();
const productsController = require("../controllers/product");

router
  .route("/")
  .get(productsController.getAllProducs)
  .post(productsController.createProduct)
  .patch(productsController.updateProduct)
  .delete(productsController.deleteProduct);

module.exports = router;

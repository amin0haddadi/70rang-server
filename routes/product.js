const express = require("express");
const router = express.Router();
const productsController = require("../controllers/product");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.array("images", 5), productsController.createProduct);

router
  .route("/")
  .get(productsController.getAllProducts)
  .patch(upload.array("images", 5), productsController.updateProduct)
  .delete(productsController.deleteProduct);

router.route("/:id").get(productsController.getProductById);

module.exports = router;

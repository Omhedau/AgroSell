const express = require("express");
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const validateToken  = require("../middleware/validateTokenHandler.js");

const router = express.Router();

// ✅ Apply Authentication Middleware
router.use(validateToken); // All routes below require authentication

// ✅ Product Routes (Now accessible only to authenticated sellers)
router.post("/", addProduct); // Add Product
router.get("/", getProducts); // Get All Products
router.get("/:id", getProductById); // Get Single Product
router.put("/:id", updateProduct); // Update Product
router.delete("/:id", deleteProduct); // Delete Product

module.exports = router;

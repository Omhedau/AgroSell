const Product = require("../models/product");
const asyncHandler = require("express-async-handler");

// ✅ Add a New Product (Only for Authenticated Sellers)
const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, category, subCategory, brand, images, price, stock, specifications, variants, tags, shipping, returnPolicy } = req.body;

    const product = new Product({
      sellerId: req.seller.id, // Get sellerId from token
      name,
      description,
      category,
      subCategory,
      brand,
      images,
      price,
      stock,
      specifications,
      variants,
      tags,
      shipping,
      returnPolicy,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error adding product",
      error: error.message,
    });
  }
});

// ✅ Get All Products (Authenticated Sellers See Only Their Own Products)
const getProducts = asyncHandler(async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, sortBy, page = 1, limit = 10 } = req.query;

    const filter = { sellerId: req.seller.id }; // Filter products by seller

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter["price.sellingPrice"] = {};
      if (minPrice) filter["price.sellingPrice"].$gte = parseFloat(minPrice);
      if (maxPrice) filter["price.sellingPrice"].$lte = parseFloat(maxPrice);
    }

    const sortOptions = {};
    if (sortBy) {
      const [field, order] = sortBy.split(":");
      sortOptions[field] = order === "desc" ? -1 : 1;
    }

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
});

// ✅ Get a Single Product by ID (Only If Belongs to Authenticated Seller)
const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.seller.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
});

// ✅ Update a Product (Only If Belongs to Authenticated Seller)
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.seller.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
});

// ✅ Delete a Product (Only If Belongs to Authenticated Seller)
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, sellerId: req.seller.id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
});

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

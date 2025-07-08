const Product = require("../models/product_model");

exports.getProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive
    }

    if (category) {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).skip(skip).limit(Number(limit));

    res.status(200).json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products", detail: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;

    // Basic validation
    if (!name || !category || price == null || stock == null) {
      return res.status(400).json({ error: "All fields (name, category, price, stock) are required" });
    }

    const product = new Product({ name, category, price, stock });
    await product.save();

    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ error: "Failed to create product", detail: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product", detail: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product", detail: err.message });
  }
};

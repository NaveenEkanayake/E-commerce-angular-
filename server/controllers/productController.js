const Admin = require("../model/adminmodel");
const Products = require("../model/productmodel");

const AddProduct = async (req, res) => {
  const adminId = req.id;
  const {
    Productname,
    description,
    price,
    ImageUrls,
    Category,
    stockQuantity,
  } = req.body;

  try {
    if (!adminId) {
      return res.status(400).json({ message: "Admin not found" });
    }
    if (!Array.isArray(ImageUrls) || ImageUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one image URL" });
    }

    const product = await Products.create({
      Productname,
      description,
      price,
      ImageUrls,
      Category,
      stockQuantity,
      adminId,
    });

    res.status(201).json({ message: "Product Created Successfully", product });
  } catch (error) {
    console.error("AddProduct Error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const admin = await Admin.findById(req.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const allProducts = await Products.find({});
    if (allProducts.length === 0) {
      return res.status(400).json({ message: "No Products found!" });
    }

    res.status(200).json({
      message: "Product Items Retrieved Successfully!",
      retrieveditems: allProducts,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(req.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const Product = await Products.findById(id);
    if (!Product) {
      return res.status(404).json({ message: "No Product exists!" });
    }

    res.status(200).json({
      message: "Product retrieved successfully!",
      retrievedData: Product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  delete updateData.imagepath;

  try {
    const admin = await Admin.findById(req.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const updatedProduct = await Products.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "No Updated Product exist!" });
    }

    res.status(200).json({
      message: "Product updated successfully!",
      updatedData: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(req.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const deletedProduct = await Products.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({
      message: "Product deleted successfully!",
      deletedData: deletedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;

    console.log("Product ID:", productId);
    console.log("Quantity to update:", quantity);

    const parsedQuantity = parseInt(quantity, 10);
    console.log("Parsed quantity:", parsedQuantity);

    const product = await Products.findById(productId);
    console.log("Current stock quantity:", product.stockQuantity);
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      { $set: { stockQuantity: parsedQuantity } },
      { new: true }
    );

    console.log("Updated product:", updatedProduct);

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update inventory" });
  }
};

const filterByName = async (name) => {
  if (!name) return [];
  try {
    console.log(`Filtering by name: ${name}`);
    const result = await Products.find({
      Productname: { $regex: name, $options: "i" },
    });
    console.log(`Products found by name: ${result.length}`);
    return result;
  } catch (error) {
    console.error("Error filtering by name:", error);
    throw new Error("Failed to filter by name");
  }
};
const filterByCategory = async (category) => {
  if (!category) return [];
  try {
    console.log(`Filtering by category: ${category}`);
    const result = await Products.find({
      Category: { $regex: category, $options: "i" },
    });
    console.log(`Products found by category: ${result.length}`);
    return result;
  } catch (error) {
    console.error("Error filtering by category:", error);
    throw new Error("Failed to filter by category");
  }
};

const searchProducts = async (req, res) => {
  const { name, category } = req.body;

  console.log("Search parameters:", { name, category });

  try {
    let products = [];
    if (name) {
      products = await filterByName(name);
    } else if (category) {
      products = await filterByCategory(category);
    }

    console.log("Filtered products:", products);
    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Failed to search products" });
  }
};

module.exports = {
  AddProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateInventory,
  searchProducts,
};

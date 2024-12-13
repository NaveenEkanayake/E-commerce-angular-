const Products = require("../model/productmodel");

const AddProduct = async (req, res) => {
  const { adminId } = req.id;
  const { Productname, description, price, ImageUrl, Category } = req.body;

  try {
    if (!adminId) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const product = await Products.create({
      Productname,
      description,
      price,
      ImageUrl,
      Category,
      adminId,
    });

    res.status(201).json({ message: "Product Created Successfully", product });
  } catch (error) {
    console.error("AddProduct Error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = { AddProduct };

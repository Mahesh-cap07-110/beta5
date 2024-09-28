const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    const category = await Category.findOne({ name: req.body.category });
    if (category) {
      category.products.push(product._id);
      await category.save();
    }
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.listProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.categoryName }).populate('products');
    const products = category ? category.products : [];
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.productName });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const category = await Category.findOne({ products: product._id });
    res.json({ ...product.toObject(), categoryName: category ? category.name : 'Uncategorized' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.productName });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (req.body.price !== undefined && req.body.price <= 0) {
      return res.status(400).json({ message: 'Price must be positive' });
    }
    
    if (req.body.category !== undefined && req.body.category !== product.category) {
      await Category.updateOne(
        { name: product.category },
        { $pull: { products: product._id } }
      );
      
      const newCategory = await Category.findOne({ name: req.body.category });
      if (newCategory) {
        newCategory.products.push(product._id);
        await newCategory.save();
      }
    }
    
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ name: req.params.productName });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Category.updateMany(
      { products: product._id },
      { $pull: { products: product._id } }
    );
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.purchaseProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.productName });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const quantity = parseInt(req.body.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    product.stock -= quantity;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.addProductToCategory = async (req, res) => {
    try {
      const { productName, categoryName } = req.params;
      const product = await Product.findOne({ name: productName });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      if (!category.products.includes(product._id)) {
        category.products.push(product._id);
        await category.save();
      }
      
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/', categoryController.addCategory);
router.put('/:categoryName', categoryController.updateCategoryDescription);
router.delete('/:categoryName', categoryController.deleteCategory);
router.post('/:categoryName/products/:productName', categoryController.addProductToCategory);

module.exports = router;
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.addProduct);
router.get('/category/:categoryName', productController.listProductsByCategory);
router.get('/:productName', productController.getProductDetails);
router.put('/:productName', productController.updateProduct);
router.delete('/:productName', productController.deleteProduct);
router.post('/:productName/purchase', productController.purchaseProduct);

module.exports = router;
const express = require('express');
const cartController = require('../controllers/cartController');
var router = express.Router();

router.get('/loadcart', cartController.load_cart_page);
router.post('/add-product-into-cart/id=:id', cartController.add_product_into_cart);
router.post('/product-cart-delete=:id', cartController.product_cart_delete);
router.post('/product-cart-update=:id', cartController.product_cart_update);

module.exports = router;
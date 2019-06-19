const express = require('express');
const productCotroller = require('../controllers/productController')
const router = express.Router();

router.get('/product-all/:category/viewpage=:page', productCotroller.load_list_page);
router.get('/product-detail=:id', productCotroller.load_detail_page);

module.exports = router;
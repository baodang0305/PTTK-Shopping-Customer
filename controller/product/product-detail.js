var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/product-detail', function (req, res, next) {
    res.render('product-detail', { title: 'Product detail' });
});

module.exports = router;

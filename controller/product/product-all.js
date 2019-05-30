var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/product-all', function (req, res, next) {
    res.render('product-all', { title: 'New product' });
});

module.exports = router;

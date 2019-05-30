var express = require('express');
var router = express.Router();

router.get('/cart', function (req, res, next) {
    res.render('cart', { title: 'Cart' });
});

router.get('/checkout', function (req, res, next) {
    res.render('checkout', { title: 'Checkout' });
});

module.exports = router;
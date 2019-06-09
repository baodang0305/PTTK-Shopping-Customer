var express = require('express');
var router = express.Router();

router.get('/product-all', function (req, res, next) {
    res.render('product-all', { title: 'All Product' });
});

module.exports = router;

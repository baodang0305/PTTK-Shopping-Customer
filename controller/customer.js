var express = require('express');
var router = express.Router();

router.get('/register', function (req, res, next) {
    res.render('register', { title: 'Register' });
});

router.get('/contact', function (req, res, next) {
    res.render('contact', { title: 'Contact' });
});

module.exports = router;
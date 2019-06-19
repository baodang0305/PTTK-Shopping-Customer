const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

router.get('/checkout', orderController.load_checkout_page);
router.post('/addcheckout', orderController.add_checkout);

module.exports = router;

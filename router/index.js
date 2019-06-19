const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const { forwardAuthenticated } = require('../config/auth');
router.get('/' ,indexController.load_home_page);
router.get('/search', indexController.search_product);

module.exports = router;
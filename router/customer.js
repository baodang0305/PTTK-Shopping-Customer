const express = require('express');
const customerController = require('../controllers/customerController');
const router = express.Router();
const { forwardAuthenticated } = require('../config/auth');
const passport = require('passport');

router.get('/login', customerController.load_login_page);

router.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/customer/login', 
    successRedirect: '/',
    failureFlash: true
}));

router.get('/logout', customerController.logout);

router.get('/register', customerController.load_register_page);

router.post('/register', customerController.register);

router.get('/forgot-password', customerController.forgot_password);

router.post('/checkUser', customerController.checkUser);
  
router.post('/sendEmail', customerController.sentEmail);

router.post('/confirmCode', customerController.confirmCode);

router.post('/checkChanges', customerController.checkChanges);

router.post('/add-review', customerController.add_comment);

module.exports = router;
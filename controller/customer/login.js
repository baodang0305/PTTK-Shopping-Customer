const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', function(req, res, next){
    let temp = req.flash('mess');
    res.render('login', {title: 'Login', 'err': temp.length > 0, 'mess': temp});
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/login'}),
  function(req, res){
    res.render('index', {title: 'Home', 'mess': req.user.Username});
  },
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
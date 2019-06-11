const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const localStrategy = require('passport-local').Strategy;
const passport = require('passport');
const session = require('express-session');
const validator = require('express-validator');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const indexRouter = require('./controller/index');
const productAllRouter = require('./controller/product/product-all');
const productDetailRouter = require('./controller/product/product-detail');
const loginRouter = require('./controller/customer/login');
const registerRouter = require('./controller/customer/register');
const customer = require('./models/customer');
const app = express();

const uri = "mongodb+srv://BaoDang:baodang@cluster0-ek6kq.mongodb.net/pttkshoppingdb"; 
mongoose.Promise = global.Promise;
mongoose.connect(uri, {useNewUrlParser: true}).then(
  ()=>{console.log('connect is success')},
  err=>{console.log(err);}
);

passport.use(new localStrategy({
  usernameField: 'Username',
  passwordField: 'Password',
  passReqToCallback: true //cho phép req.flash()
  },function(req, Username, Password, done){
    process.nextTick(function(){
      customer.findOne({'Username': Username}).exec((err, user)=>{
        if(err) return done(err);
        else if(!user){
          return done(null, false, req.flash('mess', 'Incorrect Username and Password'));
        }
        else{
          if(!bcrypt.compareSync(Password, user.Password)){
            return done(null, false, req.flash('mess', 'Incorrect Username and Password'));
          }
          else{
            return done(null, user)
          }
        }
      })
    })
}));

passport.serializeUser(function(user, done){
  done(null, user.Username);
});

passport.deserializeUser(function(Username, done){
  customer.findOne({Username: Username}, function(err, user){
    if(err) return done(err);
    return done(err, user);
  })
});

app.set('views', [path.join(__dirname, 'views'),
                  path.join(__dirname, 'views/product'),
                  path.join(__dirname, 'views/customer')
                 ]);
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "mysecret", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/javascripts')));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

app.use('/', indexRouter);
app.use('/', productAllRouter);
app.use('/', productDetailRouter);
app.use('/', loginRouter);
app.use('/', registerRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const validator = require('express-validator');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const hbs = require('hbs');

const indexRouter = require('./router/index');
const productRouter = require('./router/product');
const customerRouter = require('./router/customer');
const cartRouter = require('./router/cart');
const orderRouter = require('./router/order');

require('./config/passport')(passport);
const app = express();

/*
const uri = "mongodb+srv://BaoDang:baodang@cluster0-ek6kq.mongodb.net/pttkshoppingdb"; 
mongoose.Promise = global.Promise;
mongoose.connect(uri, {useNewUrlParser: true}).then(
  ()=>{console.log('connect is success')},
  err=>{console.log(err);}
);*/


mongoose.Promise = Promise;
const option = {
  useNewUrlParser: true,
  autoReconnect: true,
  reconnectTries: 1000000,
  reconnectInterval: 3000
};
const run = async () => {
  await mongoose.connect('mongodb+srv://BaoDang:baodang@cluster0-ek6kq.mongodb.net/pttkshoppingdb', option);
}
run().catch(error => console.error(error));

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
      case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});

app.set('views', [path.join(__dirname, 'views'),
                  path.join(__dirname, 'views/product'),
                  path.join(__dirname, 'views/customer'),
                  path.join(__dirname, 'views/cart')
                 ]);
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: "mysecret", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

app.use('/', indexRouter);
app.use('/customer', customerRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);

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

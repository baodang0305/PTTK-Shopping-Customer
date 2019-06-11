const express = require('express');
const product = require('../models/product');
const router = express.Router();

router.get('/', function(req, res, next) {
  //const feature2_product;
  let Async_Await = async() =>{
    let feature1 = await product.find({Product_Group: 'feature'}).limit(4).skip(0);
    let feature2 = await product.find({Product_Group: 'feature'}).limit(4).skip(4);
    let new1 = await product.find({Product_Group: 'new'}).limit(4).skip(0);
    let new2 = await product.find({Product_Group: 'new'}).limit(4).skip(4);
    let popular1 = await product.find({Product_Group: 'popular'}).limit(4).skip(0);
    let popular2 = await product.find({Product_Group: 'popular'}).limit(4).skip(4);
    res.render('index', {title: 'Home', 'feature1': feature1, 'feature2': feature2, 'new1': new1, 'new2': new2, 'popular1':popular1, 'popular2':popular2});
  }
  Async_Await();
});

module.exports = router;

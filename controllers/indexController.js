const productModel = require('../models/product');

exports.load_home_page = function(req, res) {
  let Async_Await = async() =>{
    let feature1 = await productModel.find({Product_Group: 'feature'}).limit(4).skip(0);
    let feature2 = await productModel.find({Product_Group: 'feature'}).limit(4).skip(4);
    let new1 = await productModel.find({Product_Group: 'new'}).limit(4).skip(0);
    let new2 = await productModel.find({Product_Group: 'new'}).limit(4).skip(4);
    let popular1 = await productModel.find({Product_Group: 'popular'}).limit(4).skip(0);
    let popular2 = await productModel.find({Product_Group: 'popular'}).limit(4).skip(4);
    res.render('index', {title: 'Home', 'user': req.user, 'feature1': feature1, 'feature2': feature2, 'new1': new1, 'new2': new2, 'popular1':popular1, 'popular2':popular2});
  }
  Async_Await();
}

exports.search_product = function(req, res){
  if(req.query.strSearch){
    var noMatch = null;
    const page = 1;
    const count = 8;
    const regex = new RegExp(escape(req.query.strSearch), 'gi');
    const Async_Await = async()=>{
      let all = await productModel.find({Category: regex}).limit(8).skip(0);
      if(all.length < 1){
        noMatch = "No result that you want to search!";
      }
      res.render('product-all', {title: 'All Product', 'mess': noMatch, 'all': all, 'user': req.user, page, count, 'category': req.query.strSearch});
    }
    Async_Await();
  }
  else{
    res.redirect('/');
  }
}

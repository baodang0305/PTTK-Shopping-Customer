const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();

const uri = "mongodb+srv://BaoDang:baodang@cluster0-ek6kq.mongodb.net/test?retryWrites=true&w=majority";

router.get('/', function(req, res, next) {
  MongoClient.connect(uri, {useNewUrlParser: true}, function(err, dbRef){
    if(err) return console.log(err);
    else{
      const productCollection = dbRef.db('pttkshoppingdb').collection('Product');
      let Async_Await = async()=>{
        const feature_product = await productCollection.find({}).toArray();
        const latest_product = await productCollection.find({}).toArray();
        const popular_product = await productCollection.find({}).toArray();

        res.render('index', {title: 'Home', 'feature_product': feature_product, 'popular_product': popular_product, 'latest_product': latest_product});
      }
      Async_Await();
    }
  })
  res.render('index', { title: 'Home' });
});

module.exports = router;

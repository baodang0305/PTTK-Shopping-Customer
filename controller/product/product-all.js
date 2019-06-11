const express = require('express');
const product = require('../../models/product');
const router = express.Router();

router.get('/product-all-:id', function (req, res, next) {
    let id = req.params.id;
    console.log(id);
    let all;
    let Async_Await = async()=>{
        switch(id){
            case "m":  { all = await product.find({Gender: 'boy'}); break; }
            case "ms": { all = await product.find({Category: 'shirt', Gender: 'boy'}); break; }
            case "mt": { all = await product.find({Category: 'tshirt', Gender: 'boy'}); break; }
            case "mj": { all = await product.find({Category: 'jean', Gender: 'boy'}); break; }
            case "w":  { all = await product.find({Gender: 'girl'}); break; }
            case "ws": { all = await product.find({Category: 'shirt', Gender: 'girl'}); break; }
            case "wt": { all = await product.find({Category: 'tshirt', Gender: 'girl'}); break; }
            case "wj": { all = await product.find({Category: 'jean', Gender: 'girl'}); break; }
            case "s":  { all = await product.find({Category: 'sport'}); break; }
            default: break;
        }
        console.log(all);
        res.render('product-all', { title: 'All Product', 'all': all});
    }
    Async_Await();
});

module.exports = router;

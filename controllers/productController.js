
const productModel = require('../models/product');
const ObjectId = require('mongodb').ObjectID;
const commentModel = require('../models/comment');

exports.load_list_page = function (req, res) {
    let category = req.params.category;
    let page = req.params.page;
    let LIMIT = 8;
    let offset = (page*LIMIT - LIMIT);
    let count = 0;
    let all;
    let Async_Await = async()=>{
        switch(category){
            case "man":  { all = await productModel.find({Gender:'boy'}).limit(LIMIT).skip(offset); break; }
            case "man-shirt": { all = await productModel.find({Gender:'boy', Category: 'shirt'}).limit(LIMIT).skip(offset); break; }
            case "mant-shirt": { all = await productModel.find({Gender: 'boy', Category: 'tshirt'}).limit(LIMIT).skip(offset); break; }
            case "man-jean": { all = await productModel.find({Gender: 'boy', Category: 'jean'}).limit(LIMIT).skip(offset); break; }
            case "women":  { all = await productModel.find({Gender: 'girl'}).limit(LIMIT).skip(offset); break; }
            case "women-shirt": { all = await productModel.find({Gender: 'girl', Category: 'shirt'}).limit(LIMIT).skip(offset); break; }
            case "woment-shirt": { all = await productModel.find({Gender: 'girl', Category: 'tshirt'}).limit(LIMIT).skip(offset); break; }
            case "women-jean": {all = await productModel.find({Gender: 'girl', Category: 'jean'}).limit(LIMIT).skip(offset); break; }
            case "sport":  { all = await productModel.find({Category: 'sport'}).limit(LIMIT).skip(offset); break; }
            case "shirt": { all = await productModel.find({Category: 'shirt'}).limit(LIMIT).skip(offset); break; }
            case "tshirt": {all = await productModel.find({Category: 'tshirt'}).limit(LIMIT).skip(offset); break; }
            case "jean":  { all = await productModel.find({Category: 'jean'}).limit(LIMIT).skip(offset); break; }
            default: break;
        }
        if(all != undefined){
            all.forEach(element => {
                count += 1;
            });
        }
        res.render('product-all', { title: 'All Product', 'user': req.user, 'all': all, 'page': page, 'category': category, 'count': count });
    }
    Async_Await();
}

exports.load_detail_page = function (req, res) {
    let  id = req.params.id;
    let object_id = new ObjectId(id);
    let Async_Await = async()=>{
        let product_detail = await productModel.findOne({'_id': object_id});
        let product_related1 = await productModel.find({'Category': product_detail.Category, 'Gender': product_detail.Gender}).limit(4).skip(0);
        let product_related2 = await productModel.find({'Category': product_detail.Category, 'Gender': product_detail.Gender}).limit(4).skip(4);
        let related_comment_array = await commentModel.comment.find({ProductId: object_id});
        let alteredCommentArray = []
        for (i = 0; i < related_comment_array.length; i++) {
          let alteredComment = commentModel.changeStarFromIntToStringToEmbeddedToHandlebar(related_comment_array[i])
          alteredCommentArray.push(alteredComment)
        }
        res.render('product-detail', { title: 'Product detail', 
                                       'user': req.user, 
                                       'product_detail': product_detail, 
                                       'related1': product_related1, 
                                       'related2': product_related2,
                                       'user': req.user,
                                        hasComment: Boolean(alteredCommentArray),
                                        related_comment: alteredCommentArray
                                    });
    }
    Async_Await();
}

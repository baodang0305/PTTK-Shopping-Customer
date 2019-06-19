const cartModel = require('../models/cart');
const productModel = require('../models/product');
const ObjectId = require('mongodb').ObjectId;

exports.load_cart_page = async(req, res)=>{
    let totalVat = 0;
    let totalNoVat = 0;
    let arrProduct = [];
    let cart = await cartModel.findOne({Username: req.user.Username});
    if(!cart){
        res.render('cart', {title: 'Your Cart'});
    }
    else{
        cart.Product.forEach(element => {
            arrProduct.push(element);
        });
        totalNoVat = cart.Total;
        totalVat  = (cart.Total * 10)/100 + cart.Total;
        res.render('cart', {title: 'Your Cart', 'user': req.user, 'list_product': arrProduct, 'totalNoVat': totalNoVat, 'totalVat': totalVat});
    }
}

// router.get('/checkout', function (req, res, next) {
//     res.render('checkout', { title: 'Checkout', 'user': req.user });
// });

exports.add_product_into_cart =  function(req, res){
    let id = req.params.id;
    if(req.isAuthenticated()){
        let quantity = Number(req.body.Quantity);
        if(!quantity){
            quantity = 1;
        }
        let object_id = new ObjectId(id);
        let Async_Await = async()=>{
            let tempProduct = await productModel.findOne({'_id': object_id});
            let tempCartOfUser = await cartModel.findOne({Username: req.user.Username});
            let subtotal = 0 
            if(tempCartOfUser){
                let totalNoVat = tempCartOfUser.Total + quantity*tempProduct.Cost;
                let checkExist = false;
                let tempArr = tempCartOfUser.Product;
                await tempArr.forEach(item => {
                    if(id == item.Id){
                        quantity = quantity + item.Amount;
                        checkExist = true;
                    }
                });
                subtotal = tempProduct.Cost * quantity;
                if(checkExist){
                    cartModel.updateOne({'Username': req.user.Username, 'Product.Id': id}, 
                                    {$set:
                                        {"Product.$.Amount": quantity, "Product.$.SubTotal": subtotal}
                                    },function(err){if(err){console.log(err); return;}}
                               );
                }
                else{
                    const pro = {
                        'Id': tempProduct._id,
                        'Image': tempProduct.Image, 
                        'Name': tempProduct.Name, 
                        'Cost': tempProduct.Cost, 
                        'Amount': quantity, 
                        'SubTotal': subtotal
                    }
                    cartModel.findOneAndUpdate({Username: req.user.Username},
                        {$push: {Product: pro}},
                        {safe: true, upsert: true},
                        function(err) {
                            if(err){
                                console.log(err);
                                return;
                            }else{
                                console.log('add product into cart is success');
                            }
                        }
                    );
                }
                
                cartModel.updateOne({Username: req.user.Username},
                               {$set: {Total: totalNoVat}},
                    function(err){
                        if(err) {
                            console.log(err);
                            return;
                        }
                        else console.log("Update total is success");
                    }
                );
            }
            else{
                subtotal = tempProduct.Cost * quantity;
                const tempCart = new cartModel({
                    Username: req.user.Username,
                    Total: subtotal,
                    Product: [
                                {
                                    'Id': tempProduct._id, 
                                    'Image': tempProduct.Image, 
                                    'Name': tempProduct.Name, 
                                    'Cost': tempProduct.Cost, 
                                    'Amount': quantity, 
                                    'SubTotal': subtotal
                                }
                             ]
                });
                cartModel.create(tempCart, function(err){
                    if(err) return console.log(err);
                    else{ console.log('cart is created');}
                });
            }
            res.redirect('/');
        }
        Async_Await();
    }
    else{    
        res.redirect('/customer/login');
    }
}

exports.product_cart_delete = async(req, res)=>{
    let id = req.params.id;
    let totalCart = 0;
    let cart = await cartModel.findOne({Username: req.user.Username});
    let productDelete = cart.Product;
    await productDelete.forEach(element => {
        if(element.Id == id){
           totalCart = cart.Total - element.SubTotal
        }
    })
    await cartModel.update({Username: req.user.Username}, 
        {$pull: {'Product': {Id: id}}},  
        function(err) {
            if(err){
                console.log(err);
            }else{
                console.log('delete product in cart is success');
            }
        }
    )
    await cartModel.update({Username: req.user.Username},
                     {$set: {Total: totalCart}},
                     function(err){
                        if(err) console.log(err);
                        else{
                             console.log("update total after product in cart");
                        }
                    }
    )
    res.redirect('/cart/loadcart');
}

exports.product_cart_update = async(req, res)=>{
    let numberOfProduct = req.body.Amount;
    let Id = req.params.id;
    let cart = await cartModel.findOne({Username: req.user.Username});
    let total = cart.Total;
    let check = false;
    cart.Product.forEach(element => {
        if(Id == element.Id){
            if(numberOfProduct > element.Amount){
                total = total + (numberOfProduct - element.Amount)*element.Cost;
                let subtotal = numberOfProduct*element.Cost;
                cartModel.updateOne({'Username': req.user.Username, 'Product.Id': Id}, 
                                            {$set:
                                                {"Product.$.Amount": numberOfProduct, "Product.$.SubTotal": subtotal}
                                            },function(err){if(err){console.log(err); return;}}
                    );
                cartModel.updateOne({'Username': req.user.Username},
                                          {$set: {Total: total}}, function(err){
                                              if(err) {
                                                  console.log(err) ;
                                                  return;
                                              }
                                          }
                    )
                check = true;
                res.redirect('/cart/loadcart');
            }
            else if(numberOfProduct < element.Amount && numberOfProduct > 0){
                total = total - (element.Amount - numberOfProduct)*element.Cost;
                let subtotal = numberOfProduct * element.Cost;
                cartModel.updateOne({'Username': req.user.Username, 'Product.Id': Id}, 
                                            {$set:
                                                {"Product.$.Amount": numberOfProduct, "Product.$.SubTotal": subtotal}
                                            },function(err){if(err){console.log(err); return;}}
                    );
                cartModel.updateOne({'Username': req.user.Username},
                                          {$set: {Total: total}}, function(err){
                                              if(err) {
                                                  console.log(err) ;
                                                  return;
                                              }
                                          }
                    )
                check = true;
                res.redirect('/cart/loadcart');
            }
            else if(numberOfProduct == 0){//delete
                    total = total - element.SubTotal
                cartModel.update({Username: req.user.Username}, 
                    {$pull: {'Product': {Id: Id}}},  
                    function(err) {
                        if(err){
                            console.log(err);
                        }else{
                            console.log('delete product in cart is success');
                        }
                    }
                )
                cartModel.update({Username: req.user.Username},
                                {$set: {Total: total}},
                                function(err){
                                    if(err) console.log(err);
                                    else{
                                        console.log("update total after product in cart");
                                    }
                                }
                )
                check = true;
                res.redirect('/cart/loadcart');
            }
            else{
                check = true;
                res.redirect('/cart/loadcart');
            }
        }
    });
    if(check == false){
        res.redirect('/cart/loadcart');
    }
}

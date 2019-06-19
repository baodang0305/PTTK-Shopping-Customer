const orderModel = require('../models/order');
const cartModel = require('../models/cart');

exports.load_checkout_page = async(req, res)=>{
    let cart = await cartModel.findOne({Username: req.user.Username});
    if(cart.Product.length == 0){
        res.render('cart', {title: 'Your Cart', 'mess': 'Your cart is empty'});
    }
    else{
        res.render('checkout', {title: 'Checkout'});
    }
}

exports.add_checkout = async(req, res)=>{
    req.checkBody('Name', 'Receiver name').notEmpty();
    req.checkBody('Address', 'address').notEmpty();
    req.checkBody('Phonenumber', 'phonenumber').isInt().isLength({min: 9, max: 10});
    var errors = req.validationErrors();
    if(errors){
        let strError = "";
        if(strError.length>1){
            for(let i = 0; i<errors.length-1; i++){
                strError = strError + errors[i].msg + ", ";
            }
            strError = strError + errors[errors.length-1].msg + " invalid";
        }
        else{
            strError =  errors[0].msg + " invalid";
        }

        res.render('checkout', {title: "Checkout", 'strError': strError});
    }
    else{
        let cart = await cartModel.findOne({Username: req.user.Username});
        let arrProduct = [];
        await cart.Product.forEach(element => {
            let pro = {
                Id: element._id,
                Name: element.Name,
                Amount: element.Amount,
                Cost: element.Cost,
                SubTotal: element.SubTotal
            }
            arrProduct.push(pro);
        });
        const order = new orderModel({
            Username: req.user.Username,
            ReceiverName: req.body.Name,
            ReceiverAddress: req.body.Address,
            ReceiverPhonenumber: req.body.Phonenumber,
            Sum: cart.Total,
            Product: arrProduct,
            DeliveryStatus: 'Chưa giao',
        })
        orderModel.create(order, function(err){
            if(err) {console.log(err)}
            else{console.log('insert order is success')}
        })
        res.redirect('/cart/loadcart');
    }
}
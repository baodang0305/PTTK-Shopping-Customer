const customer = require('../models/customer');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const commentModel = require('../models/comment');

exports.load_login_page = function(req, res){
    let error = req.flash('loginMessages');
    res.render('login',  {title:'Login', number: error.length, loginMessages: error});
}


exports.logout = function(req, res){
  req.logout();
  res.redirect('/');
}

exports.load_register_page = function (req, res) {
    res.render('register', { title: 'Register' });
}

exports.register = function(req, res){
    req.checkBody('Username', 'username').notEmpty();
    req.checkBody('Password', 'password').isLength({min: 5, max: 20});
    req.checkBody('ConfirmPassword', 'confirm password').isLength({min: 5, max: 20});
    req.checkBody('Email', 'email').isEmail();
    req.checkBody('Name', 'full name').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        let strErr = "";
        for(let i=0;i<errors.length-1; i++){
            strErr = strErr + errors[i].msg + ", ";
        }
        strErr = strErr + errors[errors.length-1].msg + " invalid!";
        res.render('register', {title: 'Register', 'mess': strErr});
    }
    else{
        customer.findOne({Username: req.body.Username}).exec((err, cus)=>{
            if(err){
                console.log(err);
                return;
            }
            else if(cus){
                res.render('register', {title: 'Register', 'mess': "Username is already exist"});
            }
            else{
                if(req.body.Password == req.body.ConfirmPassword){
                    req.body.Password = bcrypt.hashSync(req.body.Password, 10);
                    const newCus = new customer(req.body);
                    customer.create(newCus, function(err, res){
                        if(err){
                            return console.log(err);
                        }
                        else{
                            console.log("insert is success");
                        }
                    });
                    req.login(newCus, function(err){
                        if(err){
                            return console.log(err);
                        }
                        return res.redirect('/'); 
                    })
                }
                else{
                    res.render('register', {title: 'Register', 'mess': "Password and ConfirmPassword is not equal"});
                }
            }
        })
    }
}

exports.forgot_password =  function(req, res, next){
    res.render('forgot-password', { title: 'Forgot Password', 'checkUser': true });
}

exports.checkUser = function(req, res, next){
    req.checkBody('Username', 'username').notEmpty();
    let error = req.validationErrors();
    if(error){
      let strErr = error[0].msg + " is empty";
      res.render('forgot-password', { title: 'Forgot Password', 'checkUser': true, 'mess': strErr });
    }
    else{
        customer.findOne({Username: req.body.Username}, function(err, cus){
            if(err) return next(null, false, {mess: "Error of data"});
            else if(cus){
                res.render('forgot-password', {title: 'Forgot Password', 'sentEmail': true})
            }
            else{
                res.render('forgot-password', {title:'Forgot Password', 'checkUser': true, 'mess': 'Username is not alreadly exist'});
            }
        });
    }
}

exports.sentEmail = function(req, res){
    req.checkBody('Email', 'email').isEmail();
    let error = req.validationErrors();
    if(error){
        let strErr = error[0].msg + " is invalid";
        res.render('forgot-password', {title: 'Forgot Password', 'sentEmail': true, 'mess': strErr});
    }
    else{
        const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'baodang3597@gmail.com',
            pass: 'baodang0305'
        }
        });
        const mailOptions = {
        from: 'Bao Dang',
        to: req.body.Email,
        subject: 'Confirm changes password',
        html: '<b>Your code to confirm changes password is 123</b>'
        }
        transporter.sendMail(mailOptions, function(err, info){
        if(err){
            return console.log(err);
        }
        res.render('forgot-password', {title: 'Forgot Password', 'confirmCode': true});
        });
    }
}

exports.confirmCode = function(req, res, next){
    if(req.body.Code != '123'){
        res.render('forgot-password', {title: 'Forgot Password', 'confirmCode': true, 'mess': 'Confirm code is invalid!'});
    }
    else{
        res.render('forgot-password', {title: 'Forgot Password', 'checkChanges': true});
    }
}

exports.checkChanges = function(req, res, next){
    req.checkBody('Username', 'username').notEmpty();
    req.checkBody('Password', 'password').notEmpty();
    req.checkBody('Passconfirm', 'confirm password').notEmpty();
    let errors = req.validationErrors();
    if(errors){
        let strErr ="";
        for(let i=0; i < errors.length; i++){
            if(i < errors.length - 1){ 
                strErr = strErr + errors[i].msg + ', ';
            }
            else{
                strErr = strErr + errors[i].msg;
            }
        }
        strErr = strErr + ' are empty';
        res.render('forgot-password', {title: 'Forgot Password', 'checkChanges': true, 'mess': strErr});
    }
    else{
        customer.findOne({Username: req.body.Username}, function(err, cus){
            if(err) return next(null, false, {mess: 'Error find data'});
            else if(cus){
                if(req.body.Password == req.body.Passconfirm){
                    req.body.Password = bcrypt.hashSync(req.body.Password, 10);
                    (async()=>{
                        await customer.updateOne({Username: cus.Username}, {$set: {'Password': req.body.Password}});
                        let user = await customer.findOne({Username: req.body.Username});
                        req.login(user, function(err) {
                            if (err) {console.log(err); return next(err); }
                            return res.redirect('/');
                        });
                    })();
                }
                else{
                    return res.render('forgot-password', {title: 'Forgot Password', 'checkChanges': true, 'mess': 'Password and confirm password are not equal'});
                }
            }
            else{
                return res.render('forgot-password', {title: 'Forgot Password', 'checkChanges': true, 'mess': 'Username is not alreadly exist'});
            }
        });
    }
}

exports.add_comment = function(req, res, next){
    let newComment = commentModel.createNewComment(req);
    commentModel.comment.create(newComment, function(err, comment) {
        if (err) {
        console.log(err)
        }
        else {
            res.redirect('/product/product-detail=' + req.body.ProductId)
        }
    })
}
  
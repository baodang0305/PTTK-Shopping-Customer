const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
const customer = require('../models/customer');

module.exports = function(passport){
    passport.use('local-login' ,new localStrategy({usernameField: 'Username', passwordField: 'Password', passReqToCallback: true},
        async(req, Username, Password, done) => {
            try{
                let user = await customer.findOne({'Username': Username});
                if(!user) return done(null, false, req.flash('loginMessages', "Incorrect username or password"));
                else{
                    if(!bcrypt.compareSync(Password, user.Password)){
                        return done(null, false, req.flash('loginMessages', 'Incorrect username or password'));
                    }
                    else{
                        console.log('login is success');
                        return done(null, user)
                    }
                }
            }
            catch(e){
                console.log(e);
                return e;
            }
            
        }
    ))
      
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}

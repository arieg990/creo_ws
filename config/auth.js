const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const passport = require('passport');
var response = require('./constant').response;
const model = require('../models') 
var crypto = require('crypto');
const env = process.env.NODE_ENV || 'development';
const config = require('./config.json')[env];
var jwt = require('jsonwebtoken');
var cryptoLocal = require('./randomString');

function google(passport) {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(new GoogleStrategy({
    clientID: '1047118110301-q8j20ugbqj0rq5p877oq2ae22u9uf4hq.apps.googleusercontent.com',
    clientSecret: 'RqlCBQCQQ0mvgOB-qM2L_IYh',
    callbackURL: 'http://127.0.0.1:3000/auth/google/callback'
  },
  async (token, refreshToken, profile, done) => {
    var data = {
      name: profile.displayName,
      picture: profile.photos[0].value,
      provider: profile.provider,
      google_id:profile.id
    }
    var user = await model.users.findOrCreate({
      raw: true,
      where: {
        google_id:profile.id
      },
      defaults: data
    })
    user = user[0]
    delete user.password
    user.token = token

    return done(null, user);
  }));
}

function local(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    model.users.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback:true
  },
  (req,username, password, done) => {
    if (req.body.type == "customer") {
      model.Customer.findOne({
        where: { email: username }
      }).then((user) => {
        if (!user) {
          return done(null, false,  {
            "message": "Incorrect email.",
            "path": "email",
            "value": username
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { "message": "Incorrect password.",
            "path": "password",
            "value": password });
        }
        delete user.dataValues.password
        user.dataValues.userType = "customer"

        var tokenSave = {
          token: jwt.sign(user.dataValues, config.secret),
          customerId: user.dataValues.id
        }

        model.Token.findOne({
          where: {
            customerId:user.dataValues.id
          },
        }).then((oldToken) => {
          if (oldToken) {

            model.Token.destroy({
              where: {
                customerId:user.dataValues.id
              }
            }).then((del) => {
              if (del) {
                model.Token.create(tokenSave).then((tkn) => {
                  if (!tkn) {
                    return done(null, false, { "message": "Failed save token.",
                      "path": "token",
                      "value": jwt.sign(user.dataValues, config.secret) });
                  }

                  var array = {
                    user:user,
                    token:tkn.token
                  }

                  return done(null, array)
                })
              }
            })
          } else {
            model.Token.create(tokenSave).then((tkn) => {
              if (!tkn) {
                return done(null, false, { "message": "Failed save token.",
                  "path": "token",
                  "value": tokenSave.token });
              }

              var array = {
                user:user,
                token:tkn.token
              }

              return done(null, array)
            })
          }
        })
      });
    } else if(req.body.type == "vendor") {
      model.VendorUser.findOne({
        where: { email: username },
        include: [
        {model:model.Role, as:'role'}
        ]
      }).then((user) => {
        if (!user) {
          return done(null, false,  {
            "message": "Incorrect email.",
            "path": "email",
            "value": username
          });
        }

        if (!user.validPassword(password)) {
          return done(null, false, { "message": "Incorrect password.",
            "path": "password",
            "value": password });
        }

        delete user.dataValues.password
        user.dataValues.userType = "vendor"

        var tokenSave = {
          token: jwt.sign(user.dataValues, config.secret),
          vendorUserId: user.dataValues.id
        }

        model.Token.findOne({
          where: {
            vendorUserId:user.dataValues.id
          },
        }).then((oldToken) => {
          if (oldToken) {
            model.Token.destroy({
              where: {
                vendorUserId:user.dataValues.id
              }
            }).then((del) => {
              if (del) {
                model.Token.create(tokenSave).then((tkn) => {
                  if (!tkn) {
                    return done(null, false, { "message": "Failed save token.",
                      "path": "token",
                      "value": tokenSave.token });
                  }

                  var array = {
                    user:user,
                    token:tkn.token
                  }

                  return done(null, array)
                })
              }
            })
          } else {
            model.Token.create(tokenSave).then((tkn) => {
              if (!tkn) {
                return done(null, false, { "message": "Failed save token.",
                  "path": "token",
                  "value": tokenSave.token });
              }

              var array = {
                user:user,
                token:tkn.token
              }

              return done(null, array)
            })
          }
        })
      });
    } else if(req.body.type == "user") {
      model.User.findOne({
        where: { email: username },
        include: [
        {model:model.Role, as:"role"}
        ]
      }).then((user) => {
        if (!user) {
          return done(null, false,  {
            "message": "Incorrect email.",
            "path": "email",
            "value": username
          });
        }

        if (!user.validPassword(password)) {
          return done(null, false, { "message": "Incorrect password.",
            "path": "password",
            "value": password });
        }

        delete user.dataValues.password
        user.dataValues.userType = "user"

        var tokenSave = {
          token: jwt.sign(user.dataValues, config.secret),
          userId: user.dataValues.id
        }

        model.Token.findOne({
          where: {
            userId:user.dataValues.id
          },
        }).then((oldToken) => {
          if (oldToken) {
            model.Token.destroy({
              where: {
                userId:user.dataValues.id
              }
            }).then((del) => {
              if (del) {
                model.Token.create(tokenSave).then((tkn) => {
                  if (!tkn) {
                    return done(null, false, { "message": "Failed save token.",
                      "path": "token",
                      "value": tokenSave.token });
                  }

                  var array = {
                    user:user,
                    token:tkn.token
                  }

                  return done(null, array)
                })
              }
            })
          } else {
            model.Token.create(tokenSave).then((tkn) => {
              if (!tkn) {
                return done(null, false, { "message": "Failed save token.",
                  "path": "token",
                  "value": tokenSave.token });
              }

              var array = {
                user:user,
                token:tkn.token
              }

              return done(null, array)
            })
          }
        })
      });
    } else {
      return done(null, false, { "message": "Incorrect type (customer, vendor, user).",
        "path": "type",
        "value": req.body.type });
    }
  }
  ));
}

function bearer(passport) {
  passport.use(new BearerStrategy(
    function(token, done) {

      var verify = jwt.verify(token,config.secret)
      var where =  {}

      if (!verify) {
         return done(null, false, { "message": "Token not found.",
              "path": "authorization",
              "value": token });
      }

      if (verify.userType == "customer") {
        where = {
          customerId: verify.id
        }
      } else if (verify.userType == "vendor") {
        where = {
          vendorUserId: verify.id
        }
      } if (verify.userType == "user") {
        where = {
          userId: verify.id
        }
      }

      model.Token.findOne({
        where: where
      }).then((tkn) => {
        if(!tkn)
          return done(true, false,{})

        if(tkn.isExpired(tkn)) {
          model.Token.destroy({
            where: where
          }).then((deleted) => {
            return done(null, false, { "message": "Token expired.",
              "path": "authorization",
              "value": token });
          }).catch((err) => {
            console.log("2 "+err)
          })
        } else {
          if (tkn.customerId != null) {
            model.Customer.findByPk(tkn.customerId).then((user) => {
              if (!user) 
               return done(null, false, { "message": "User not found",
                "path": "authorization",
                "value": token })

             user.dataValues.userType = "customer"
             return done(null, user)

           }).catch((err) => {
            console.log("3 "+err)
          })
         } else if(tkn.vendorUserId != null) {
          model.VendorUser.findByPk(tkn.vendorUserId).then((user) => {
            if (!user) 
             return done(null, false, { "message": "User not found",
              "path": "authorization",
              "value": token })

           user.dataValues.userType = "vendor"
           return done(null, user)

         }).catch((err) => {
          console.log("4 "+err)
        })
       } else {
        model.User.findByPk(tkn.userId).then((user) => {
          if (!user) 
           return done(null, false, { "message": "User not found",
            "path": "authorization",
            "value": token })

         user.dataValues.userType = "user"
         console.log("masuk")
         return done(null, user)

       }).catch((err) => {
        console.log("5 "+err)
      })
     }
   }
 }).catch((err) => {
  console.log("1 "+err)
})
}
));
}

function isLoggedIn(req, res, next) {

  passport.authenticate('bearer', {session: false} , function(err, user, info) {
    if (err) { return res.status(200).json(response(401,"unauthorized",null)); }
    if (!user) { return res.status(200).json(response(401,"unauthorized",null)); }

    req.user = user

    return next();
  })(req, res, next)

}

function isVendor(req, res, next) {
  if (req.user.dataValues.userType == "vendor") {
    return next();
  } else {
    res.status(200).json(response(400,"restricted",null));
  }
}

function isUser(req, res, next) {
  if (req.user.dataValues.userType == "user") {
    return next();
  } else {
    res.status(200).json(response(400,"restricted",null));
  }
}

function isUserOrVendor(req, res, next) {
  if (req.user.dataValues.userType == "user") {
    return next();
  } if (req.user.dataValues.userType == "vendor") {
    return next();
  } else {
    res.status(200).json(response(400,"restricted",null));
  }
}

module.exports = {google,local,bearer,isLoggedIn,isVendor, isUser, isUserOrVendor};
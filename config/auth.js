const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
var response = require('./constant').response;
const model = require('../models') 
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
  },
    (username, password, done) => {
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
      user.dataValues.type = "customer"
      return done(null, user);
    });
  }
));
}

function bearer(passport) {
  passport.use(new BearerStrategy(
  function(token, done) {
    model.Customer.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
    });
  }
));
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();

    res.status(200).json(response(401,"unauthorized",null));
}

function isVendor(req, res, next) {
  if (req.user.type == "vendor") {
      return next();
    } else {
      res.status(200).json(response(400,"restricted",null));
    }
}

module.exports = {google,local,bearer,isLoggedIn,isVendor};
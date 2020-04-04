var express = require('express');
var router = express.Router();
var model = require('../models');
const passport = require('passport');
var response = require('../config/constant').response;

// Redirect the user to the OAuth provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
router.get('/google', passport.authenticate('google',{scope: ['https://www.googleapis.com/auth/plus.login']}));

// The OAuth provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect("/")
    });

router.post('/login',function(req, res, next) {
  /* look at the 2nd parameter to the below call */
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(200).json(response(401,"login",[info])) }

    if (user.token) {return res.status(200).json(response(200,"user",user.user, null,user.token))}

      return res.status(200).json(response(200,"user",user));
  })(req, res, next);
});

router.get('/logout', function(req,res,next) {
	req.logout();
	res.redirect('/');
});

module.exports = router;

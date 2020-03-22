var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var auth = require('./config/auth');
var flash = require('connect-flash');

//passport
const passport = require('passport');
const cookieSession = require('cookie-session');

//router
var indexRouter = require('./routes/index');
var addressesRouter = require('./routes/addresses');
var authRouter = require('./routes/auth');
var customersRouter = require('./routes/customers');
var categoriesRouter = require('./routes/categories');
var citiesRouter = require('./routes/cities');
var packagesRouter = require('./routes/packages');
var postalCodesRouter = require('./routes/postal_codes');
var provincesRouter = require('./routes/provinces');
var servicesRouter = require('./routes/services');
var subDistrictsRouter = require('./routes/sub_district');
var typesRouter = require('./routes/types');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookieSession config
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys: ['aa07d12df26158b37513430e4f92fb4ac752cbb184f4a3bf1696f07c9e7dac76']
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

auth.google(passport);
auth.local(passport);
auth.bearer(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/addresses',auth.isLoggedIn, addressesRouter);
app.use('/customer', customersRouter);
// app.use('/roles', auth.isLoggedIn,rolesRouter);
app.use('/category',auth.isLoggedIn,categoriesRouter);
app.use('/city',auth.isLoggedIn,citiesRouter);
app.use('/packages',auth.isLoggedIn,packagesRouter);
app.use('/postal_code',auth.isLoggedIn,postalCodesRouter);
app.use('/province',auth.isLoggedIn,provincesRouter);
app.use('/services',auth.isLoggedIn,servicesRouter);
app.use('/sub_district',auth.isLoggedIn,subDistrictsRouter);
app.use('/type',auth.isLoggedIn,typesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

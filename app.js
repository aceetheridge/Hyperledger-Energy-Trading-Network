var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const winston = require('./src/config/winston').getLogger(module);
var indexRouter = require('./routes/index');
let fabricRouter = require('./routes/fabric');
let userRouter = require('./routes/user');
let tradeRouter = require('./routes/trade');
let produceRouter = require('./routes/produce');
let consumeRouter = require('./routes/consume');
let assetsRouter = require('./routes/assets');
let createUserRouter = require('./routes/createUser');
let createAssetRouter = require('./routes/createAsset')

var app = express();

// view engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan(':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', { stream: winston.stream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/fabric', fabricRouter);
app.use('/trade', tradeRouter);
app.use('/produce', produceRouter);
app.use('/consume', consumeRouter);
app.use('/assets', assetsRouter);
app.use('/createUser', createUserRouter);
app.use('/createAsset', createAssetRouter);



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
app.use('*', cors());


module.exports = app;

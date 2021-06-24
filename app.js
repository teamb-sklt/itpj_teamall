var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var te_thismonthRouter = require('./routes/te_thismonth');
var te_lastmonthRouter = require('./routes/te_lastmonth');
var ex_thismonthRouter = require('./routes/ex_thismonth');
var ex_lastmonthRouter = require('./routes/ex_lastmonth');
var te_newrecordRouter = require('./routes/te_newrecord');
var ex_newrecordRouter = require('./routes/ex_newrecord');
var resultRouter = require('./routes/result');
var ex_shinseiRouter = require('./routes/ex_shinsei');
var te_shinseiRouter = require('./routes/te_shinsei');
var ex_detailRouter = require('./routes/ex_detail');
var te_detailRouter = require('./routes/te_detail');
var te_jobsearchRouter = require('./routes/te_jobsearch');
var ex_jobsearchRouter = require('./routes/ex_jobsearch');
var loginRouter = require('./routes/login');
var usersRouter = require('./routes/users');
<<<<<<< HEAD
var remindexRouter = require('./routes/remind_ex');
var remindtrRouter = require('./routes/remind_tr');
var approveexRouter = require('./routes/approve_ex');
var approvetrRouter = require('./routes/approve_tr');
var login2Router = require('./routes/login2');
var jmkotsuhiRouter = require('./routes/jmkotsuhi');
var jmkehiRouter = require('./routes/jmkehi');
var jmloginRouter = require('./routes/jmlogin');

=======
>>>>>>> 67011951e390a8359557068cffd977f83d4bb6d8

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/')); // フロントでjQueryを使用するため。

app.use('/',indexRouter);
app.use('/te_thismonth', te_thismonthRouter);
app.use('/te_lastmonth', te_lastmonthRouter);
app.use('/ex_thismonth', ex_thismonthRouter);
app.use('/ex_lastmonth', ex_lastmonthRouter);
app.use('/te_newrecord',te_newrecordRouter);
app.use('/ex_newrecord',ex_newrecordRouter);
app.use('/ex_detail',ex_detailRouter);
app.use('/te_detail',te_detailRouter);
app.use('/result', resultRouter);
app.use('/te_jobsearch',te_jobsearchRouter);
app.use('/ex_jobsearch',ex_jobsearchRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/ex_shinsei',ex_shinseiRouter);
app.use('/te_shinsei',te_shinseiRouter);
<<<<<<< HEAD
app.use('/remind_ex', remindexRouter);
app.use('/remind_tr', remindtrRouter);
app.use('/approve_ex', approveexRouter);
app.use('/approve_tr', approvetrRouter);
app.use('/login2', login2Router);
app.use('/jmkotsuhi', jmkotsuhiRouter);
app.use('/jmkehi', jmkehiRouter);
app.use('/jmlogin', jmloginRouter);


=======
>>>>>>> 67011951e390a8359557068cffd977f83d4bb6d8

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
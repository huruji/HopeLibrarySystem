const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mysql = require("mysql");
const session = require('express-session');

const config = require("./config");

const routerPublic = require('./routes/public');
const routerUser = require("./routes/user");
const routerBook = require("./routes/book");
const routerEquip = require("./routes/equip");
const routerAdmin = require("./routes/admin");
const routerAdminBook = require("./routes/admin-book");
const routerAdminEquip = require("./routes/admin-equip");
const routerAdminSuper = require("./routes/admin-super");
const routerApi = require('./routes/api');
const emailSchedule = require("./routes/email-schedule");
const setSession = require('./utils/set-session');

const app = express();


app.use(session({secret:'hope',cookie:{maxAge:1000*60*60*24*30},resave: false, saveUninitialized: true,}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routerPublic);
app.use("/user",routerUser);
app.use("/book",routerBook);
app.use("/equip",routerEquip);
/*app.use("/user", checkLogin(req, res, next, ['adminSign'], '/admin/login'));*/
app.use("/admin",routerAdmin,routerAdminSuper,routerAdminBook,routerAdminEquip);
app.use("/api", routerApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
emailSchedule();

module.exports = app;

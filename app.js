const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const session = require('express-session');
const cookieParser = require("cookie-parser");
const config = require("./config");

const routerPublic = require('./router/public');
const routerUser = require("./router/user");
const routerBook = require("./router/book");
const routerEquip = require("./router/equip");
const routerAdmin = require("./router/admin");
const routerAdminBook = require("./router/admin-book");
const routerAdminEquip = require("./router/admin-equip");
const routerAdminSuper = require("./router/admin-super");
const routerApi = require('./router/api');
const emailSchedule = require("./router/email-schedule");
const setSession = require('./utils/set-session');

const app = express();

app.use(session({secret:'hope',cookie:{maxAge:600000},resave: false, saveUninitialized: true,}));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(bodyParser.urlencoded({extended:false}));

app.use(cookieParser());

app.use('/', routerPublic);
app.use("/user",routerUser);
app.use("/book",routerBook);
app.use("/equip",routerEquip);
/*app.use("/user", checkLogin(req, res, next, ['adminSign'], '/admin/login'));*/
app.use("/admin",routerAdmin,routerAdminSuper,routerAdminBook,routerAdminEquip);
app.use("/api", routerApi);

emailSchedule();
app.listen(config.server.port,function(){
	console.log("listening port 3000");
});







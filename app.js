const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const session = require('express-session');
const cookieParser = require("cookie-parser");
const config = require("./config");

const routerUser = require("./router/user");
const routerBook = require("./router/book");
const routerEquip = require("./router/equip");
const routerAdmin = require("./router/admin");
const routerAdminBook = require("./router/admin-book");
const routerAdminEquip = require("./router/admin-equip");
const emailSchedule = require("./router/email-schedule");

const checkLogin = require('./utils/check-login');

const app = express();

app.use(session({secret:'hope',cookie:{maxAge:600000},resave: false, saveUninitialized: true,}));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(bodyParser.urlencoded({extended:false}));

app.use(cookieParser());

/*app.use(function(req, res, next) {
    var url = req.originalUrl;
    console.log('url' + url);
    if(url !=='/user/login' || url !== '/admin/user'){
        if(!req.session.sign) {
            res.redirect('/user/login');
            return;
        } else {
            res.session.sign = true;
            next();
        }
    }else{
        next();
    }
});*/
/*app.use("/user", checkLogin(req, res, next, ['userSign'], '/user/login'));*/
app.use("/user",routerUser);
app.use("/book",routerBook);
app.use("/equip",routerEquip);
/*app.use("/user", checkLogin(req, res, next, ['adminSign'], '/admin/login'));*/
app.use("/admin",routerAdmin,routerAdminBook,routerAdminEquip);

app.get("/",function(req,res){
	res.render("public/front/index")
})
emailSchedule();
app.listen(config.server.port,function(){
	console.log("listening port 3000");
})







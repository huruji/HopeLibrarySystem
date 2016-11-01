const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const config = require("./config");

const routerUser = require("./router/user");
const routerBook = require("./router/book");
const routerEquip = require("./router/equip");
const routerAdmin = require("./router/admin");
const routerAdminBook = require("./router/admin-book");
const routerAdminEquip = require("./router/admin-equip");
const emailSchedule = require("./router/email-schedule");

const app = express();


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/user",routerUser);
app.use("/book",routerBook);
app.use("/equip",routerEquip);
app.use("/admin",routerAdmin,routerAdminBook,routerAdminEquip);

emailSchedule();
app.listen(config.server.port,function(){
	console.log("listening port 3000");
})







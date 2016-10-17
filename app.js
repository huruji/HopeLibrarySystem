const express=require("express");
const bodyParser=require("body-parser");
const path=require("path");
const mysql=require("mysql");
const cookieParser=require("cookie-parser");
const config=require("./config");

const routerUser=require("./router/user");
const routerBook=require("./router/book");
const routerAdmin=require("./router/admin");

const app=express();


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/user",routerUser);
app.use("/book",routerBook);
app.use("/admin",routerAdmin);


app.listen(config.server.port,function(){
	console.log("listening port 3000");
})







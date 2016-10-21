const express=require("express");
const mysql_util=require("./mysql_util");
const bodyParser=require("body-parser");
const crypto=require("crypto");
const router=express.Router();

router.route("/login").post(function(req,res){
	console.log("hhhh");
	var sha=crypto.createHash("md5");
	sha.update(req.body.password);
	var password_md5=sha.digest("hex");
	mysql_util.DBConnection.query("SELECT readerID,readerName,readerPassword FROM hopeReader WHERE readerName=? AND readerPassword=?",[req.body.username,password_md5],function(err,rows,fields){
		if(err){
			var error={
				code:3,
				message:"服务端异常，请稍后再试或者联系管理员"
			};
			res.send(error)
		}else{
			if(rows.length==0){
				var error={
					code:2,
					message:"用户名或密码错误"
				};
				res.send(error)
			}else{
				/*var sha=crypto.createHash("md5");
				sha.update(rows[0].readerID.toString());
				var userId=sha.digest("hex");*/
				console.log(rows[0].readerID);
				res.cookie("userId",rows[0].readerID,{
					maxAge: 30 * 60 * 1000,
                    path: '/',
                    httpOnly: true
				});
				var success={
					code:0,
					message:"成功",
					userId:rows[0].readerID
				}
				res.send(success);
			}
		}
	})

}).get(function(req,res){
	res.render("login");
})

/*router.get("/user/login",function(req,res){
	console.log("login");
	res.render("login");
})*/
router.route("/reset").post(function(req,res){
	var sha=crypto.createHash("md5");
	sha.update(req.body.password);
	var password_md5=sha.digest("hex");
	console.log(req.headers.cookie);
	/*var userId=parseInt(cookieToJson(req.headers.cookie)[userId]);*/
	var userId=req.cookies.userId;
	console.log(userId);
	console.log("cccc");
	mysql_util.DBConnection.query("UPDATE hopeReader SET readerPassword=? WHERE readerID=?;",[password_md5,userId],function(err,rows,fields){
		if(err){
			var error={
				code:3,
				message:"服务端异常，请稍后再试或者联系管理员"
			};
			res.send(error)
		}else{
			var success={
				code:0,
				message:"修改成功",
				userId:userId
			}
			res.send(success);
		}
	})
}).get(function(req,res){
	if(!req.cookies.userId){
		console.log("bbb");
		res.redirect("/user/login");
	}else{
		mysql_util.DBConnection.query("SELECT userImgSrc,readerName FROM hopeReader WHERE readerID=?",req.cookies.userId,function(err,rows,fields){
			if(err){
				console.log(err)
			}else{
				var userImg=rows[0].userImgSrc;
				var userName=rows[0].readerName;
	            res.render("user/reset1",{userImg:userImg,userName:userName});
            }
		})
	}
});

router.route("/borrow").post(function(req,res){
	console.log("post");
	console.log(!req.headers.cookie);
	if(!req.headers.cookie){
		var err={
			code:10
		};
		res.send(err);
	}
})



router.route("/").get(function(req,res){
	if(!req.cookies.userId){
		res.redirect("/user/login");
	}else{
		var userId=req.cookies.userId;
		mysql_util.DBConnection.query("SELECT userImgSrc,readerName FROM hopeReader WHERE readerID=?",userId,function(err,rows,fields){
			if(err){
				console.log(err)
			}else{
				var userImg=rows[0].userImgSrc;
				var userName=rows[0].readerName;
				mysql_util.DBConnection.query("SELECT bookName,bookID,borrowID,returnBefore FROM hopeBook,hopeReader,bookBorrow WHERE hopeBook.bookID=bookBorrow.borrowBookID AND hopeReader.readerID=bookBorrow.borrowUserID AND returnWhe=0 AND readerID=?;",req.cookies.userId,function(err,rows,fields){
			if(err){
				console.log(err);
			}else{
				for(var i=0,max=rows.length;i<max;i++){
					rows[i].returnBefore=rows[i].returnBefore.getFullYear()+"-"+(parseInt(rows[i].returnBefore.getMonth())+1)+"-"+rows[i].returnBefore.getDate();
				}
				res.render("user/index1",{book:rows,userImg:userImg,userName:userName});
			}
		})
			}
		})
		
	}
}).post(function(req,res){
	if(!req.cookies.userId){
		res.redirect("/user/login");
	}else{
		var bookID=req.body.bookID,
		    borrowID=req.body.borrowID;
		mysql_util.DBConnection.query("UPDATE hopeBook SET bookLeft=bookLeft+1 WHERE bookID=?;UPDATE bookBorrow SET returnWhe=1 WHERE borrowID=?",[bookID,borrowID],function(err,rows,fields){
			if(err){
				console.log(err);
			}else{
				var success={
					message:"归还成功"
				};
				res.send(success);
			}
		})
	}
})

router.route("/modify").get(function(req,res){
	if(!req.cookies.userId){
		res.redirect("/user/login");
	}else{
		mysql_util.DBConnection.query("SELECT * FROM hopeReader WHERE readerID=?",req.cookies.userId,function(err,rows,fields){
			if(err){
				console.log(err)
			}else{
				var hopeGroup=["网管组","编程组","设计组","前端组","数码组"];
				var userName=rows[0].readerName;
				var userImg=rows[0].userImgSrc;
				res.render("user/usermodify1",{userName:userName,userImg:userImg,user:rows[0],hopeGroup:hopeGroup});
			}
		})
	}
}).post(function(req,res){
	console.log("post modify");
	mysql_util.DBConnection.query("UPDATE hopeReader SET readerSex=?,studentNumber=?,readerMajor=?,readerPhone=?,readerEmail=?,readerGroup=? WHERE readerID=?",[req.body.sex,req.body.studentNumber,req.body.readerMajor,req.body.readerPhone,req.body.readerEmail,req.body.readerGroup,req.cookies.userId],function(err,rows,fields){
		if(err){
			console.log(err);
		}else{
			var success={
				message:"保存成功"
			};
			res.send(success);
		}
	})
})

function cookieToJson(cookieValue){
	var cookieEqu=cookieValue.split(";");
	var cookieJson={};
	for (var i=0;i<cookieEqu.length;i++){
		var keyValue=cookieEqu[i].split("=");
		cookieJson[keyValue[0]]=keyValue[1];
	}
	return cookieJson
}

module.exports=router;
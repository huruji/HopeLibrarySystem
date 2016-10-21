const express=require("express");
const mysql_util=require("./mysql_util");
const bodyParser=require("body-parser");
const crypto=require("crypto");
const router=express.Router();

router.route("/login").post(function(req,res){
	var sha=crypto.createHash("md5");
	sha.update(req.body.password);
	var password_md5=sha.digest("hex");
	mysql_util.DBConnection.query("SELECT adminID,adminName,adminPassword FROM hopeAdmin WHERE adminName=? AND adminPassword=?",[req.body.username,password_md5],function(err,rows,fields){
		if(err){
			var error={
				code:3,
				message:"服务端异常，请稍后再试或者联系管理员"
			};
			console.log(err);
			res.send(error)
		}else{
			if(rows.length==0){
				var error={
					code:2,
					message:"用户名或密码错误"
				};
				res.send(error)
			}else{
				res.cookie("adminId",rows[0].adminID,{
					maxAge: 30 * 60 * 1000,
                    path: '/',
                    httpOnly: true
				});
				var success={
					code:0,
					message:"成功",
					userId:rows[0].adminID
				}
				res.send(success);
			}
		}
	})
}).get(function(req,res){
	res.render("login");
})
router.route("/").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("admin/login");
		console.log("no cookie");
	}else{
		var adminId=req.cookies.adminId;
		console.log("have cookie")
		/*console.log(adminId);*/
		mysql_util.DBConnection.query("SELECT * FROM hopeAdmin WHERE adminID=?",adminId,function(err,rows,fields){
			var admin=rows[0];
			if(rows[0].adminPermissions=="super"){
				mysql_util.DBConnection.query("SELECT * FROM hopeReader",function(err,rows,fields){
					if(err){
						console.log(err);
					}else{
						res.render("admin/index",{admin:admin,user:rows});
					}
				});
			}else if(rows[0].adminPermissions=="camera"){
				mysql_util.DBConnection.query("SELECT * FROM hopeEquip",function(err,rows,fields){
					if(err){
						console.log(err);
					}else{
						res.render("admin-equip",{admin:admin,equip:rows});
					}
				});
			}else{
				mysql_util.DBConnection.query("SELECT * FROM hopeBook ORDER BY bookID DESC",function(err,rows,fields){
					if(err){
						console.log(err);
					}else{
						var book=rows;
						mysql_util.DBConnection.query("SELECT readerName,borrowBookID FROM hopeReader,bookBorrow WHERE borrowUserID=readerID AND returnWhe=0",function(err,rows,fields){
							if(err){
								console.log(err);
							}else{
								var borrower=[];
								for(var i=0,max=book.length;i<max;i++){
									borrower[i]=0;
									for(var j=0,max1=rows.length;j<max1;j++){
										if(rows[j].borrowBookID==book[i].bookID){
											borrower[i]=rows[j].readerName;
										}
									}
									 console.log("i="+i)
								}
								/*console.log(borrower);
								console.log(book.length);*/
								res.render("admin-book/index",{admin:admin,book:book,borrower:borrower});
							}
						})
						
					}
				});
			}
		})
	}
})


router.route("/userModify/:userID").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login")
	}else{
		var userID=req.params.userID;
		mysql_util.DBConnection.query("SELECT * FROM hopeReader WHERE readerID=?",userID,function(err,rows,fields){
			if(err){
				console.log(err);
			}else{
				var hopeGroup=["网管组","编程组","设计组","前端组","数码组"];
				res.render("admin/adminModifyuser",{user:rows[0],hopeGroup:hopeGroup});
			}
		})
	}
}).post(function(req,res){
	var name=req.body.readerName,
	    sex=req.body.sex,
	    number=req.body.studentNumber,
	    major=req.body.readerMajor,
	    phone=req.body.readerPhone,
	    email=req.body.readerEmail,
	    group=req.body.readerGroup,
	    userID=parseInt(req.params.userID);
	var DBParams=[name,sex,group,number,major,phone,email,userID];
	console.log(DBParams);
	mysql_util.DBConnection.query("UPDATE hopeReader SET readerName=?,readerSex=?,readerGroup=?,studentNumber=?,readerMajor=?,readerPhone=?,readerEmail=? WHERE readerID=?",DBParams,function(err,rows,fields){
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

router.route("/drop").post(function(req,res){
	var dropData=req.body.dropData.trim();
	var dropID=parseInt(dropData.match(/\d+/g)[0]);
	var dropType=dropData.replace(/\d+/g,"").trim();
	if(dropType="user"){
		mysql_util.DBConnection.query("DELETE FROM hopeReader WHERE readerID=?",dropID,function(err,rows,fields){
			if(err){
				console.log(err);
			}else{
				var success={
					message:"删除用户成功",
				};
				res.send(success);
			}
		});
	}else if(dropType="admin"){
		mysql_util.DBConnection.query("DELETE FROM hopeAdmin WHERE adminID=?",dropID,function(err,rows,fields){
			if(err){
				console.log(err);
			}else{
				var success={
					message:"删除管理员成功",
				};
				res.send(success);
			}
		});
	}
})


router.route("/bookModify/:bookID").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login")
	}else{
		var bookID=req.params.bookID;
		mysql_util.DBConnection.query("SELECT * FROM hopeBook WHERE bookID=?",bookID,function(err,rows,fields){
			if(err){
				console.log(err);
			}else{
				var bookCate=["编程类","设计类","摄影类","其他"];
				res.render("admin-book/bookModify",{book:rows[0],bookGroup:bookCate});
			}
		})
	}
}).post(function(req,res){
	console.log("aaaaa");
	var bookNum=parseInt(req.body.bookNum);
	var DBParam=[req.body.bookName,req.body.hopeID,req.body.bookAuthor,req.body.bookISBN,req.body.bookPress,req.body.bookGroup,req.body.bookID];
	console.log(DBParam);
	mysql_util.DBConnection.query("UPDATE hopeBook SET bookName=?,bookHopeID=?,bookAuthor=?,bookISBN=?,bookPress=?,bookCate=? WHERE bookID=?",DBParam,function(err,rows,fields){
		if(err){
			console.log(err);
		}else{
			var success={
				message:"修改成功"
			}
			res.send(success);
		}
	})
})


router.route("/bookAdd").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login")
	}else{
		res.render("admin-book/bookAdd");
	}
}).post(function(req,res){
	var DBParam=[req.body.bookName,req.body.hopeID,req.body.bookAuthor,req.body.bookISBN,req.body.bookPress,req.body.bookGroup];
	console.log(DBParam);
	mysql_util.DBConnection.query("INSERT hopeBook(bookName,bookHopeID,bookAuthor,bookISBN,bookPress,bookCate) VALUES(?,?,?,?,?,?)",DBParam,function(err,rows,fields){
		if(err){
			console.log(err);
		}else{
			var success={
				message:"增加成功"
			}
			res.send(success);
		}
	})
});


router.route("/userAdd").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login")
	}else{
		res.render("admin/userAdd");
	}
}).post(function(req,res){
	var sha=crypto.createHash("md5");
	sha.update(req.body.readerPassword);
	var password_md5=sha.digest("hex");
	var name=req.body.readerName,
	    sex=req.body.sex,
	    number=req.body.studentNumber,
	    major=req.body.readerMajor,
	    phone=req.body.readerPhone,
	    email=req.body.readerEmail,
	    group=req.body.readerGroup;
	var DBParams=[name,password_md5,sex,group,number,major,phone,email];
	mysql_util.DBConnection.query("INSERT hopeReader(readerName,readerPassword,readerSex,readerGroup,studentNumber,readerMajor,readerPhone,readerEmail) VALUES(?,?,?,?,?,?,?,?)",DBParams,function(err,rows,fields){
		if(err){
			console.log(err);
		}else{
			var success={
				message:"增加成功"
			};
			res.send(success);
		}
	})

})


router.route("/booklook/:bookID").get(function(req,res){

})

module.exports=router;
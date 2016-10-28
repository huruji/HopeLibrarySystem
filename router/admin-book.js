const express=require("express");
const mysql_util=require("./mysql_util");
const bodyParser=require("body-parser");
const crypto=require("crypto");
const url=require("url");
const router=express.Router();
//管理员修改图书信息
router.route("/bookmodify/:bookID").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login");
		return;
	}
	var bookID=req.params.bookID;
	mysql_util.DBConnection.query("SELECT * FROM hopeBook,hopeAdmin WHERE bookID=? AND adminID=?",[bookID,req.cookies.adminId],function(err,rows,fields){
		if(err){
			console.log(err);
            return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;
		var bookCate=["编程类","设计类","摄影类","其他"];
		res.render("admin-book/bookModify1",{book:rows[0],bookCate:bookCate,userName:userName,userImg:userImg,userPermission:userPermission});
	});
}).post(function(req,res){
	console.log("aaaaa");
	var bookID=req.params.bookID;
	var DBParam=[req.body.bookName,req.body.hopeID,req.body.bookAuthor,req.body.bookISBN,req.body.bookPress,req.body.bookGroup,bookID];
	console.log(DBParam);
	mysql_util.DBConnection.query("UPDATE hopeBook SET bookName=?,bookHopeID=?,bookAuthor=?,bookISBN=?,bookPress=?,bookCate=? WHERE bookID=?",DBParam,function(err,rows,fields){
		if(err){
			console.log(err);
		}
		var success={
			message:"修改成功"
		}
		res.send(success);
	});
});


router.route("/bookadd").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login")
		return;
	}
	mysql_util.DBConnection.query("SELECT adminName,adminImgSrc FROM hopeAdmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;
		mysql_util.DBConnection.query("SELECT DISTINCT bookCate FROM hopeBook",function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			var bookCate=[];
			for(var i=0,max=rows.length;i<max;i++){
				bookCate.push(rows[i].bookCate);
			}
			res.render("admin-book/bookAdd1",{userName:userName,userImg:userImg,userPermission:userPermission,bookCate:bookCate});
		});
	});
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
/*图书管理员图书分页*/
router.route("/admin-book").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login");
		return;
	}
	var pageNum=req.query.pageTab;
	if(!pageNum){
		pageNum=1;
	}
	mysql_util.DBConnection.query("SELECT * FROM hopeAdmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermisssions;
		var bookStart=(pageNum-1)*10;
		var bookEnd=pageNum*10;
		mysql_util.DBConnection.query("SELECT * FROM hopeBook ORDER BY bookLeft LIMIT ?,?",[bookStart,bookEnd],function(err,rows,fields){
		    if(err){
		    	console.log(err);
		    	return;
		    }
            var book=rows;
			mysql_util.DBConnection.query("SELECT COUNT(*) AS bookNum FROM hopeBook",function(err,rows,fields){
				if(err){
					console.log(err);
					return;
				}
				var bookNum=Math.ceil(rows[0].bookNum/10);
				console.log("bookNum:"+bookNum)
				mysql_util.DBConnection.query("SELECT readerName,borrowBookID FROM hopeReader,bookBorrow WHERE borrowUserID=readerID AND returnWhe=0",function(err,rows,fields){
					if(err){
						console.log(err);
						return;
					}
					var borrower=[];
					for(var i=0,max=book.length;i<max;i++){
						borrower[i]=0;
						for(var j=0,max1=rows.length;j<max1;j++){
							if(rows[j].borrowBookID==book[i].bookID){
									borrower[i]=rows[j].readerName;
							}
						}
					}
					res.render("admin-book/index1",{userName:userName,userImg:userImg,userPermission:userPermission,book:book,borrower:borrower,bookNum:bookNum,bookPage:pageNum});
		 		});
			});
    	});
	});
});

module.exports=router;
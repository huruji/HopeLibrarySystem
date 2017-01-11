const express=require("express");
const mysql_util=require("./mysql_util");
const bodyParser=require("body-parser");
const crypto=require("crypto");
const path = require("path");
const fs = require("fs");

const formidable = require("formidable");
const url=require("url");
const router=express.Router();
//管理员修改图书信息
router.route("/bookmodify-img/:bookID").post(function(req,res){
	var bookID=req.params.bookID;
	var form = new formidable.IncomingForm();
	form.encoding = "utf-8";
	form.uploadDir =path.join("./","public/img/book");
	form.keepExtensions=true;
	form.maxFieldsSize=2*1024*1024;
	console.log("kkkk");
	form.parse(req,function(err,fields,files){
		console.log(files);
		var extension = files.img.path.substring(files.img.path.lastIndexOf("."));
		var newName="/book"+bookID+Date.now()+extension;
		var newPath=form.uploadDir+newName;
		fs.renameSync(files.img.path,newPath);
		var DBImgSrc="/img/book"+newName;
		var mysqlQuery="UPDATE hopebook SET bookImgSrc=? WHERE bookID=?";
		console.log(mysqlQuery);
		mysql_util.DBConnection.query(mysqlQuery,[DBImgSrc,bookID],function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			var success={
				code:1
			}
			res.send(success);
		})
	});
})
router.route("/bookmodify/:bookID").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login");
		return;
	}
	var bookID=req.params.bookID;
	console.log(bookID,req.cookies.adminId);
	mysql_util.DBConnection.query("SELECT * FROM hopebook,hopeadmin WHERE bookID=? AND adminID=?",[bookID,req.cookies.adminId],function(err,rows,fields){
		if(err){
			console.log(err);
            return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;
		var bookCate=["编程类","设计类","摄影类","网管类","人文类","软件教程类","博雅教育类","其他"];
		res.render("admin-book/bookModify1",{book:rows[0],bookCate:bookCate,userName:userName,userImg:userImg,userPermission:userPermission});
	});
}).post(function(req,res){
	console.log("aaaaa");
	var bookID=req.params.bookID;
	var DBParam=[req.body.bookName,req.body.hopeID,req.body.bookAuthor,req.body.bookISBN,req.body.bookPress,req.body.bookGroup,bookID];
	console.log(DBParam);
	mysql_util.DBConnection.query("UPDATE hopebook SET bookName=?,bookHopeID=?,bookAuthor=?,bookISBN=?,bookPress=?,bookCate=? WHERE bookID=?",DBParam,function(err,rows,fields){
		if(err){
			console.log(err);
		}
		var success={
			message:"修改成功"
		}
		res.send(success);
	});
});

router.route("/bookadd-img").post(function(req,res){
	var form = new formidable.IncomingForm();
	form.encoding = "utf-8";
	form.uploadDir =path.join("./","public/img/book");
	form.keepExtensions=true;
	form.maxFieldsSize=2*1024*1024;
	var imgSrc;
	form.parse(req,function(err,fields,files){
		console.log(files);
		var extension = files.img.path.substring(files.img.path.lastIndexOf("."));
		var newName="/book"+req.cookies.adminId+Date.now()+extension;
		var newPath=form.uploadDir+newName;
		fs.renameSync(files.img.path,newPath);
		var DBImgSrc="/img/book"+newName;
		return imgSrc=DBImgSrc;
		
	});
	form.on("end",function(){
		res.send({
			src:imgSrc
		})
	})
})
router.route("/bookadd").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login")
		return;
	}
	mysql_util.DBConnection.query("SELECT adminName,adminImgSrc,adminPermissions FROM hopeadmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;

		mysql_util.DBConnection.query("SHOW COLUMNS FROM hopebook LIKE 'bookCate'",function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			var bookCate=rows[0].Type.replace(/enum\(|\'|\)/g,"").split(",");
			
			console.log("userPermis:"+userPermission);
			console.log("fasfkalsdf")
			res.render("admin-book/admin-book-add",{userName:userName,userImg:userImg,userPermission:userPermission,bookCate:bookCate,firstPath:'book',secondPath:'add'});
		});
	});
}).post(function(req,res){
	if(!req.body.bookImgSrc || req.body.booImgSrc.length<1){
		var DBParam=[req.body.bookName,req.body.hopeID,req.body.bookAuthor,req.body.bookISBN,req.body.bookPress,req.body.bookGroup];
		var mysqlQuery="INSERT hopebook(bookName,bookHopeID,bookAuthor,bookISBN,bookPress,bookCate) VALUES(?,?,?,?,?,?)"
	}else{
		var DBParam=[req.body.bookName,req.body.hopeID,req.body.bookAuthor,req.body.bookISBN,req.body.bookPress,req.body.bookGroup,req.body.bookImgSrc];
		var mysqlQuery="INSERT hopebook(bookName,bookHopeID,bookAuthor,bookISBN,bookPress,bookCate,bookImgSrc) VALUES(?,?,?,?,?,?,?)";
	}
	console.log(DBParam);
	mysql_util.DBConnection.query(mysqlQuery,DBParam,function(err,rows,fields){
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
	mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;
		console.log("userPermis:"+userPermission);
		var bookStart=(pageNum-1)*10;
		var bookEnd=pageNum*10;
		mysql_util.DBConnection.query("SELECT * FROM hopebook ORDER BY bookLeft LIMIT ?,?",[bookStart,bookEnd],function(err,rows,fields){
		    if(err){
		    	console.log(err);
		    	return;
		    }
            var book=rows;
			mysql_util.DBConnection.query("SELECT COUNT(*) AS bookNum FROM hopebook",function(err,rows,fields){
				if(err){
					console.log(err);
					return;
				}
				var bookNum=Math.ceil(rows[0].bookNum/10);
				console.log("bookNum:"+bookNum)
				mysql_util.DBConnection.query("SELECT readerName,borrowBookID FROM hopereader,bookborrow WHERE borrowUserID=readerID AND returnWhe=0",function(err,rows,fields){
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
					res.render("admin-book/index",{userName:userName,userImg:userImg,userPermission:userPermission,book:book,borrower:borrower,bookNum:bookNum,bookPage:pageNum,firstPath:'book',secondPath:'modify'});
		 		});
			});
    	});
	});
});

module.exports=router;
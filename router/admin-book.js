const express=require("express");
const mysql_util=require("./mysql_util");
const crypto=require("crypto");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const url=require("url");
const router=express.Router();

const setSession = require('./../utils/set-session');
const hopeDB = require('./../utils/hopeDB.js');
const [adminDB, bookDB] = [hopeDB.adminDB, hopeDB.bookDB];
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
});
router.route("/book-modify/:bookID").get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/admin/login");
        return;
    }
	let bookID=req.params.bookID;
	adminDB.selectMessage(req.session.adminID, (rows) => {
        const admin = rows[0];
        const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
        bookDB.selectMessage(bookID, (rows) => {
            const book = rows[0];
            let bookCate=["编程类","设计类","摄影类","网管类","人文类","软件教程类","博雅教育类","其他"];
            setSession(req,{adminID:admin.adminID,adminSign: true});
            res.render("admin-book/admin-book-modify",{userName,userImg,userPermission,firstPath:'book',secondPath:'modify',book,bookCate});
        });
    });
}).post(function(req,res){
	const bookID=req.params.bookID;
	console.log(DBParam);
	let setDataJson = {
	    bookName: req.body.bookName,
        bookHopeID: req.body.hopeID,
        bookAuthor: req.body.bookAuthor,
        bookISBN: req.body.bookISBN,
        bookPress: req.body.bookPress,
        bookCate: req.body.bookGroup
    };
    bookDB.updateMessage(bookID, setDataJson, (message) => {
        res.send(message);
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
		var newName="/book"+req.session.adminID+Date.now()+extension;
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
});
router.route("/bookadd").get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/admin/login");
        return;
    }
    adminDB.selectMessage(req.session.adminID, (rows) => {
        const admin = rows[0];
        const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
        bookDB.showColumns('bookCate', (rows) => {
            let bookCate=rows[0].Type.replace(/enum\(|\'|\)/g,"").split(",");
            setSession(req,{adminID:admin.adminID,adminSign: true});
            res.render("admin-book/admin-book-add",{userName,userImg,userPermission,firstPath:'book',secondPath:'add',bookCate});
		});
	});
}).post(function(req,res){
	let setDataJson;
	if(!req.body.bookImgSrc || req.body.booImgSrc.length<1){
		 setDataJson = {
            bookName: req.body.bookName,
            bookHopeID: req.body.hopeID,
            bookAuthor: req.body.bookAuthor,
            bookISBN: req.body.bookISBN,
            bookPress: req.body.bookPress,
            bookCate: req.body.bookGroup
		}
	}else{
         setDataJson = {
            bookName: req.body.bookName,
            bookHopeID: req.body.hopeID,
            bookAuthor: req.body.bookAuthor,
            bookISBN: req.body.bookISBN,
            bookPress: req.body.bookPress,
            bookCate: req.body.bookGroup,
            bookImgSrc: req.body.bookImgSrc
        }
	}
	bookDB.addItem(setDataJson, (message) => {
		res.send(message);
	});
});
/*图书管理员图书分页*/
router.route("/admin-book").get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/admin/login");
        return;
    }
	let pageNum=req.query.pageTab || 1;
    adminDB.selectMessage(req.session.adminID, (rows) => {
        const admin = rows[0];
        const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
        let pageStart=(pageNum-1)*10;
        let pageEnd=pageNum*10;
        bookDB.orderItems('bookLeft', pageStart, pageEnd, (rows) => {
            let book=rows;
            bookDB.countItems('bookNum', (rows) => {
                let bookNum = Math.ceil(rows[0].bookNum/10);
                const query = 'SELECT readerName,borrowBookID'
                              + ' FROM hopereader,bookborrow'
                              + ' WHERE borrowUserID=readerID AND returnWhe=0';
                bookDB.query(query, (rows) => {
                    let borrower=[];
                    for(let i=0,max=book.length;i<max;i++){
                        borrower[i]=0;
                        for(let j=0,max1=rows.length;j<max1;j++){
                            if(rows[j].borrowBookID==book[i].bookID){
                                borrower[i]=rows[j].readerName;
                            }
                        }
                    }
                    setSession(req,{adminID:admin.adminID,adminSign: true});
                    res.render("admin-book/index",{userName,userImg,userPermission,firstPath:'book',secondPath:'modify',book,borrower,bookNum,bookPage:pageNum});
                });
            });
        });
    });
});

module.exports=router;
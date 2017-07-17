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
    let setDataJson;
    const tempImgSrc = req.body.bookImgSrc.toString();
    if(tempImgSrc.includes('temp')) {
        const bookImgSrc = tempImgSrc.replace(/temp/g, 'book');
        const oldPath = path.join('./public', tempImgSrc);
        const newPath = path.join('./public', bookImgSrc);
        fs.renameSync(oldPath, newPath);
        setDataJson = {
            bookName: req.body.bookName,
            bookHopeID: req.body.hopeID,
            bookAuthor: req.body.bookAuthor,
            bookISBN: req.body.bookISBN,
            bookPress: req.body.bookPress,
            bookCate: req.body.bookGroup,
            bookImgSrc
        }
    }else{
        setDataJson = {
            bookName: req.body.bookName,
            bookHopeID: req.body.hopeID,
            bookAuthor: req.body.bookAuthor,
            bookISBN: req.body.bookISBN,
            bookPress: req.body.bookPress,
            bookCate: req.body.bookGroup
        }
    }
    bookDB.updateMessage(bookID, setDataJson, (message) => {
        res.send(message);
    });
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
	const tempImgSrc = req.body.bookImgSrc.toString();
    if(tempImgSrc.includes('temp')) {
        const bookImgSrc = tempImgSrc.replace(/temp/g, 'book');
        const oldPath = path.join('./public', tempImgSrc);
        const newPath = path.join('./public', bookImgSrc);
        fs.renameSync(oldPath, newPath);
        setDataJson = {
            bookName: req.body.bookName,
            bookHopeID: req.body.hopeID,
            bookAuthor: req.body.bookAuthor,
            bookISBN: req.body.bookISBN,
            bookPress: req.body.bookPress,
            bookCate: req.body.bookGroup,
            bookImgSrc
        }
    }else{
        setDataJson = {
            bookName: req.body.bookName,
            bookHopeID: req.body.hopeID,
            bookAuthor: req.body.bookAuthor,
            bookISBN: req.body.bookISBN,
            bookPress: req.body.bookPress,
            bookCate: req.body.bookGroup
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
router.route('/dropbook').post(function(req, res) {
    const bookID = Number.parseInt(req.body.bookID);
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/admin/login");
        return;
    }
    bookDB.delItem(bookID, (message) => {
        res.send(message);
    });
});
router.route('/admin-book-data/userborrow').get(function(req, res) {
  if(!req.session.adminID || !req.session.adminSign){
    res.redirect("/admin/login");
    return;
  }
  adminDB.selectMessage(req.session.adminID, (rows) => {
    const admin = rows[0];
    const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
    res.render('admin-book/admin-book-data-userborrow',{userName,userImg,userPermission,firstPath:'data',secondPath:'userBorrow'});
  });
});
router.route('/admin-book-data/groupborrow').get(function(req, res) {
  if(!req.session.adminID || !req.session.adminSign){
    res.redirect("/admin/login");
    return;
  }
  adminDB.selectMessage(req.session.adminID, (rows) => {
    const admin = rows[0];
    const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
    res.render('admin-book/admin-book-data-groupborrow',{userName,userImg,userPermission,firstPath:'data',secondPath:'groupBorrow'});
  });
});
router.route('/admin-book-data/catecount').get(function(req, res) {
  if(!req.session.adminID || !req.session.adminSign){
    res.redirect("/admin/login");
    return;
  }
  adminDB.selectMessage(req.session.adminID, (rows) => {
    const admin = rows[0];
    const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
    res.render('admin-book/admin-book-data-catecount',{userName,userImg,userPermission,firstPath:'data',secondPath:'cateCount'});
  });
});
router.route('/admin-book-data/cateborrow').get(function(req, res) {
  if(!req.session.adminID || !req.session.adminSign){
    res.redirect("/admin/login");
    return;
  }
  adminDB.selectMessage(req.session.adminID, (rows) => {
    const admin = rows[0];
    const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
    res.render('admin-book/admin-book-data-cateborrow',{userName,userImg,userPermission,firstPath:'data',secondPath:'cateBorrow'});
  });
});
module.exports=router;
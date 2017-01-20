const express=require("express");
const mysql_util=require("./mysql_util");
const router=express.Router();

const setSession = require('./../utils/set-session');
const hopeDB = require('./../utils/hopeDB.js');
const adminDB = hopeDB.adminDB;
const userDB = hopeDB.userDB;
const bookDB = hopeDB.bookDB;

router.route("/").get(function(req,res){
    if(!req.session.userSign) {
        res.redirect("/user/login");
        return;
    }
    let userId = req.session.userID;
    userDB.selectMessage(userId, (rows) => {
        var userImg=rows[0].userImgSrc;
        var userName=rows[0].readerName;
        var userPermission="user";
        userDB.query('SELECT bookCate FROM hopebook GROUP BY bookCate', (rows) => {
            var bookCate = [];
            rows.forEach(function(ele) {
                bookCate.push(ele.bookCate);
            });
            bookDB.orderItems('bookLeft DESC,bookID DESC', 0, 20, (rows) => {
                var book = rows;
                setSession(req,{userSign:true,userID: req.session.userID});
                res.render("user/user-book",{userImg:userImg,userName:userName,userPermission:userPermission,firstPath:'borrow',secondPath:'',book:book,bookCate:bookCate});
            });
        });
    });
}).post(function(req, res) {
    let startNum=parseInt(req.body.bookNum);
    let endNum = startNum+8;
    bookDB.orderItems('bookLeft DESC,bookID DESC', startNum, endNum, (rows) => {
        let book = rows;
        bookDB.countItems('bookNum', (rows) => {
            let bookNum = rows[0].bookNum;
            let message={
                book:book
            }
            if(endNum >= bookNum){
                message.end = true;
            }
            res.send(message);
        });
    });
});
router.route('/borrow').post(function(req,res){
    if(!req.session.userSign) {
        res.redirect("/user/login");
        return;
    }
    var bookID=req.body.borrowID;
    var userID=req.session.userID;
    bookDB.selectMessage(bookID, (rows) => {
        const setDataJson = {
            bookLeft: rows[0].bookLeft-1
        }
        bookDB.updateMessage(bookID, setDataJson, (message) => {
            res.send(message);
        }, '借阅成功')
    });
});

router.route("/cate/:cate").get(function(req, res){
    if(!req.session.userSign) {
        res.redirect("/user/login");
        return;
    }
    let bookCateCurrent = decodeURI(req.params.cate);
    let userId = req.session.userID;
    userDB.selectMessage(userId, (rows) => {
        var userImg = rows[0].userImgSrc;
        var userName = rows[0].readerName;
        var userPermission = "user";
        userDB.query('SELECT bookCate FROM hopebook GROUP BY bookCate', (rows) => {
            let bookCate = [];
            rows.forEach(function (ele) {
                bookCate.push(ele.bookCate);
            });
            let searchDataJson = {
                bookCate: bookCateCurrent
            }
            bookDB.orderSearchItems(searchDataJson, 'bookLeft DESC, bookID DESC', 0, 20, (rows) => {
                let book = rows;
                res.render("user/user-book",{userImg:userImg,userName:userName,userPermission:userPermission,firstPath:'borrow',secondPath:bookCateCurrent,book:book,bookCate:bookCate});
            })
        })
    })
}).post(function(req, res) {
    let startNum = parseInt(req.body.bookNum);
    let endNum = startNum+8;
    let bookCateCurrent = decodeURI(req.params.cate);
    let searchDataJson = {
        bookCate: bookCateCurrent
    };
    bookDB.orderSearchItems(searchDataJson, 'bookLeft DESC, bookID DESC', startNum, endNum, (rows) => {
        let book = rows;
        bookDB.countSearchItems(searchDataJson, 'bookNum', (rows) => {
            let bookNum = rows[0].bookNum;
            let message={
                book:book
            };
            if(endNum >= bookNum){
                message.end = true;
            }
            res.send(message);
        });
    });
});



module.exports=router;
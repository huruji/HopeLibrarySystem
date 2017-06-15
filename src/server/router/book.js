const express=require("express");
const mysql_util=require("./mysql_util");
const router=express.Router();

const setSession = require('./../utils/set-session');
const hopeDB = require('./../utils/hopeDB.js');
const userDB = hopeDB.userDB;
const bookDB = hopeDB.bookDB;
const borrowDB = hopeDB.borrowDB;

router.route("/").get(function(req,res){
    if(!req.session.userID || !req.session.userSign){
        res.redirect("/user/login");
        return;
    }
    const userID = req.session.userID;
    userDB.selectMessage(userID, (rows) => {
        const user = rows[0];
        const [userName, userImg, userPermission] = [user.readerName, user.userImgSrc, 'user'];
        const query = 'SELECT bookCate FROM hopebook GROUP BY bookCate';
        bookDB.query(query, (rows) => {
            const bookCate = [];
            rows.forEach(function(ele) {
                bookCate.push(ele.bookCate);
            });
            bookDB.orderItems('bookLeft DESC,bookID DESC', 0, 20, (rows) => {
                const book = rows;
                setSession(req,{userSign:true,userID: req.session.userID});
                res.render("user/user-book",{userName,userImg,userPermission,firstPath:'borrow',secondPath:'',book,bookCate});
            });
        })
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
            };
            if(endNum >= bookNum){
                message.end = true;
            }
            res.send(message);
        });
    });
});
router.route('/borrow').post(function(req,res){
    const bookID = req.body.borrowID;
    const userID = req.session.userID;
    bookDB.selectMessage(bookID, (rows) => {
        const bookLeft = rows[0].bookLeft - 1;
        const query = 'INSERT bookBorrow SET borrowBookID='
                      + bookID
                      + ',borrowUserID='
                      + userID
                      + ',borrowTime=CURDATE(),returnBefore=ADDDATE(CURDATE(),30)';
        if(bookLeft > 0) {
          borrowDB.query(query, (rows) => {
            const setDataJson = {
              bookLeft: bookLeft
            };
            bookDB.updateMessage(bookID, setDataJson, (message) => {
              res.send(message);
            }, '借阅成功');
          });
        }
    });
});

router.route("/cate/:cate").get(function(req, res){
    if(!req.session.userID || !req.session.userSign){
        res.redirect("/user/login");
        return;
    }
    const bookCateCurrent = decodeURI(req.params.cate);
    const userID = req.session.userID;
    userDB.selectMessage(userID, (rows) => {
        const user = rows[0];
        const [userName, userImg, userPermission] = [user.readerName, user.userImgSrc, 'user'];
        const query = 'SELECT bookCate FROM hopebook GROUP BY bookCate';
        bookDB.query(query, (rows) => {
            const bookCate = [];
            rows.forEach(function(ele) {
                bookCate.push(ele.bookCate);
            });
            const searchDataJson = {
                bookCate: bookCateCurrent
            };
            bookDB.orderSearchItems(searchDataJson, 'bookLeft DESC, bookID DESC', 0, 20, (rows) => {
                const book = rows;
                res.render("user/user-book",{userName,userImg,userPermission,firstPath:'borrow',secondPath:bookCateCurrent,book,bookCate});
            });
        });
    });
}).post(function(req, res) {
    const startNum = parseInt(req.body.bookNum);
    const endNum = startNum+8;
    const bookCateCurrent = decodeURI(req.params.cate);
    const searchDataJson = {
        bookCate: bookCateCurrent
    };
    bookDB.orderSearchItems(searchDataJson, 'bookLeft DESC, bookID DESC', startNum, endNum, (rows) => {
        const book = rows;
        bookDB.countSearchItems(searchDataJson, 'bookNum', (rows) => {
            const bookNum = rows[0].bookNum;
            const message={
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
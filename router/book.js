const express=require("express");
const mysql_util=require("./mysql_util");
const bodyParser=require("body-parser");
const router=express.Router();

const setSession = require('./../utils/set-session');
const md5Pass = require('./../utils/md5-pass');
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
            bookDB.orderItems('bookID DESC', null, null, (rows) => {
                var book = rows;
                setSession(req,{userSign:true,userID: req.session.userID});
                res.render("user/user-book",{userImg:userImg,userName:userName,userPermission:userPermission,firstPath:'borrow',secondPath:'',book:book,bookCate:bookCate});
            });
        });
    });
}).post(function(req,res){
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
            bookDB.orderSearchItems(searchDataJson, 'bookLeft DESC', 0, 20, (rows) => {
                let book = rows;
                res.render("user/user-book",{userImg:userImg,userName:userName,userPermission:userPermission,firstPath:'borrow',secondPath:bookCateCurrent,book:book,bookCate:bookCate});
            })
        })
    })
});
router.route("/cate:cateID").get(function(req,res){
	var groupID=req.params.cateID;
	console.log(groupID)
	mysql_util.DBConnection.query("SELECT  DISTINCT bookCate FROM hopebook ORDER BY bookCate",function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		console.log(rows[0].bookCate);
		var cateArr=rows;
		mysql_util.DBConnection.query("SELECT * FROM hopebook WHERE bookCate=?  ORDER BY bookLeft DESC LIMIT 0,30",cateArr[groupID].bookCate,function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			res.render("book/cate",{book:rows,cate:cateArr[groupID].bookCate});
		})
	})
}).post(function(req,res){
	var groupID=req.params.cateID;
	var startNum=parseInt(req.body.bookNum);
	var endNum = startNum+5;
	console.log(startNum,endNum);
	mysql_util.DBConnection.query("SELECT  DISTINCT bookCate FROM hopebook ORDER BY bookCate",function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var cateArr=rows;
		console.log("cateArr[groupID]" + cateArr[groupID]);
		mysql_util.DBConnection.query("SELECT COUNT(*) AS bookCount FROM hopebook WHERE bookCate=?",cateArr[groupID].bookCate,function(err,rows,fields){
			
			var bookNum = rows[0].bookCount;
			console.log("bookNum:"+bookNum);
			console.log("typeof" + typeof bookNum)
			mysql_util.DBConnection.query("SELECT * FROM hopebook WHERE bookCate=?  ORDER BY bookLeft DESC LIMIT ?,5",[cateArr[groupID].bookCate,startNum],function(err,rows,fields){
				if(err){
					console.log(err);
					return;
				}
				var success={
					book:rows
				}
				console.log(success.book.length);
				console.log("大小:"+ (endNum >= bookNum));
				if(endNum >= bookNum){
					success.end = true;
				}
				res.send(success);
			})
		})
	})
	
})


module.exports=router;
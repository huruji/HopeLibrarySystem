const express=require("express");
const mysql_util=require("./mysql_util");
const crypto=require("crypto");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const router=express.Router();

const setSession = require('./../utils/set-session');
const md5Pass = require('./../utils/md5-pass');
const hopeDB = require('./../utils/hopeDB.js');
const [userDB, bookDB, borrowDB] = [hopeDB.userDB, hopeDB.bookDB, hopeDB.borrowDB];
// 用户登录
router.route("/login").post(function(req,res){
	const password_md5=md5Pass(req.body.password);
	const userName = req.body.username;
	const query = 'SELECT * FROM hopereader'
	              + ' WHERE readerName='
		          + mysql_util.DBConnection.escape(userName)
	              + 'AND readerPassword='
		          + password_md5;
	userDB.query(query, (rows) => {
        const user = rows[0];
        if(rows.length==0){
            const error={
                code:2,
                message:"用户名或密码错误"
            };
            res.send(error)
        }else {
            res.cookie("userId", rows[0].readerID, {
                maxAge: 30 * 60 * 1000,
                path: '/',
            });
            const message = {
                code: 0,
                message: "成功",
                userId: user.readerID
            };
            setSession(req, {userID: user.readerID, userSign: true});
            res.send(message);
        }
	});
}).get(function(req,res){
    if(req.session.userSign) {
        console.log("req.session:" + req.session);
        res.redirect('/user');
        return;
    }
	res.render("public/login");
})
// 用户首页界面
router.route("/").get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/user/login");
        return;
    }
    const userID = req.session.userID;
    userDB.selectMessage(userID, (rows) => {
        const user = rows[0];
        const [userName, userImg, userPermission] = [user.readerName, user.userImgSrc, 'user'];
        const query = "SELECT bookName,borrowTime,bookID,borrowID,returnBefore"
                      + " FROM hopebook,hopereader,bookborrow"
                      + " WHERE hopebook.bookID=bookborrow.borrowBookID"
                      + " AND hopereader.readerID=bookborrow.borrowUserID"
                      + " AND returnWhe=0"
                      + " AND readerID="
                      + userID;
        userDB.query(query, (rows) => {
            const book = rows;
            for(let i=0,max=rows.length;i<max;i++){
                rows[i].returnBefore=rows[i].returnBefore.getFullYear()+"-"+(parseInt(rows[i].returnBefore.getMonth())+1)+"-"+rows[i].returnBefore.getDate();
                rows[i].borrowTime=rows[i].borrowTime.getFullYear()+"-"+(parseInt(rows[i].borrowTime.getMonth())+1)+"-"+rows[i].borrowTime.getDate();
            }
            setSession(req, {userID: user.readerID, userSign: true});
            res.render("user/index",{userName,userImg,userPermission,firstPath:'book',secondPath:'',book});
        })
    });
}).post(function(req,res){
    const [bookID, borrowID] = [req.body.bookID, req.body.borrowID];
    bookDB.selectMessage(bookID, (rows) => {
        const book = rows[0];
        const bookLeft = book.bookLeft + 1;
        const setDataJson = {bookLeft};
        bookDB.updateMessage(bookID, setDataJson, (message) => {
            const setDataJson = {
                returnWhe: 1
            };
            borrowDB.updateMessage(borrowID, setDataJson, (message) => {
                res.send(message);
            }, '归还成功')
        });
    });
});

// 用户重置密码
router.route("/reset").post(function(req,res){
	const password_md5 = md5Pass(req.body.password);
	const userID = req.session.userID;
	userDB.resetPassword(userID, password_md5, (message) => {
	    res.send(message);
    });
}).get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/user/login");
        return;
    }
    const userID = req.session.userID;
    userDB.selectMessage(userID, (rows) => {
        const user = rows[0];
        const [userName, userImg, userPermission] = [user.readerName, user.userImgSrc, 'user'];
        setSession(req, {userID: user.readerID, userSign: true});
        res.render("user/user-reset",{userName,userImg,userPermission,firstPath:'account',secondPath:'reset'});
    });
});


// 用户更换头像
router.route("/modify-img").post(function(req,res){
	var form = new formidable.IncomingForm();
	form.encoding = "utf-8";
	form.uploadDir =path.join("./","public/img/user");
	form.keepExtensions=true;
	form.maxFieldsSize=2*1024*1024;
	console.log("kkkk");
	form.parse(req,function(err,fields,files){
		console.log(files);
		var extension = files.img.path.substring(files.img.path.lastIndexOf("."));
		var newName="/user"+req.cookies.userId+Date.now()+extension;
		var newPath=form.uploadDir+newName;
		fs.renameSync(files.img.path,newPath);
		var DBImgSrc="/img/user"+newName;
		var mysqlQuery="UPDATE hopereader SET userImgSrc=? WHERE readerID=?";
		console.log(mysqlQuery);
		mysql_util.DBConnection.query(mysqlQuery,[DBImgSrc,req.cookies.userId],function(err,rows,fields){
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
//用户更换信息
router.route("/modify").get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/user/login");
        return;
    }
    const userID = req.session.userID;
    userDB.selectMessage(userID, (rows) => {
        const user = rows[0];
        const [userName, userImg, userPermission] = [user.readerName, user.userImgSrc, 'user'];
        const hopeGroup=["网管组","编程组","设计组","前端组","数码组"];
        setSession(req, {userID: user.readerID, userSign: true});
        res.render("user/user-modify",{userName,userImg,userPermission,firstPath:'account',secondPath:'modify',user,hopeGroup});
    });
}).post(function(req,res){
	var mysqlQuery=["UPDATE hopereader SET readerSex=?,",
	                "studentNumber=?,readerMajor=?,",
	                "readerPhone=?,readerEmail=?,readerGroup=?",
	                " WHERE readerID=?"].join("");
	mysql_util.DBConnection.query(mysqlQuery,[req.body.sex,req.body.studentNumber,req.body.readerMajor,req.body.readerPhone,req.body.readerEmail,req.body.readerGroup,req.session.ID],function(err,rows,fields){
		if(err){
			console.log(err);
		}else{
			console.log("chenggon")
			var success={
				message:"保存成功"
			};
			res.send(success);
		}
	})
})


// 用户预约设备界面
router.route("/reservation").get(function(req,res){
	if(!req.session.userSign){
		res.redirect("/user/login");
		return;
	}
	mysql_util.DBConnection.query("SELECT * FROM hopereader WHERE readerID=?",req.cookies.userId,function(err,rows,fields){
		if(err){
			console.log(err)
		}
		var userName=rows[0].readerName;
		var userImg=rows[0].userImgSrc;
		var userPermission="user";
		var mysqlQuery=["SELECT equipName,borrowID,borrowTime,returnBefore,reservation,borrowEquipID",
		                " FROM hopeequip,equipborrow",
		                " WHERE returnWhe=0",
		                " AND hopeequip.equipID=equipborrow.borrowEquipID",
		                " AND borrowUserID=?"].join("")
		mysql_util.DBConnection.query(mysqlQuery,req.cookies.userId,function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			rows.forEach(function(e){
				e.borrowTime = e.borrowTime.getFullYear()+"-"+e.borrowTime.getMonth()+"-"+e.borrowTime.getDate();
				e.returnBefore = e.returnBefore.getFullYear()+"-"+e.returnBefore.getMonth()+"-"+e.returnBefore.getDate();
			});
			setSession(req, {userSign:true})
			res.render("user/reservation",{userName:userName,userImg:userImg,userPermission:userPermission,equip:rows,firstPath:'camera'});
		})
	})
}).post(function(req,res){
	var equipID=parseInt(req.body.equipID),
		borrowID=parseInt(req.body.borrowID);
		console.log(equipID,borrowID);
		mysql_util.DBConnection.query("UPDATE equipborrow SET returnWhe=1 WHERE borrowID=?",borrowID,function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			mysql_util.DBConnection.query("UPDATE hopeequip SET equipLeft=1 WHERE equipID=?",equipID,function(err,rows,fields){
				if(err){
					console.log(err);
					return;
				}
				var success={
					message:"归还成功"
				};
				res.send(success);
			})
				
		})
})
module.exports=router;
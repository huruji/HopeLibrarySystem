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
const [userDB, bookDB, equipDB, borrowDB, reservateDB] = [hopeDB.userDB, hopeDB.bookDB, hopeDB.equipDB, hopeDB.borrowDB, hopeDB.reservateDB];
// 用户登录
router.route("/login").post(function(req,res){
	const password_md5=md5Pass(req.body.password);
	const userName = req.body.username;
	const query = 'SELECT * FROM hopereader'
	              + ' WHERE readerName='
		          + mysql_util.DBConnection.escape(userName)
	              + 'AND readerPassword= "'
		          + password_md5
                  + '"';
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
  console.log('req');
  console.log(req.session);
  console.log(req.cookies);
    if(!req.session.userID || !req.session.userSign){
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
    if(!req.session.userID || !req.session.userSign){
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

//用户更换信息
router.route("/modify").get(function(req,res){
    if(!req.session.userID || !req.session.userSign){
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
    let setDataJson;
    const tempImgSrc = req.body.readerImgSrc.toString();
    if(tempImgSrc.includes('temp')) {
        const readerImgSrc = tempImgSrc.toString().replace(/temp/g, 'user');
        const oldPath = path.join('./public', tempImgSrc);
        const newPath = path.join('./public', readerImgSrc);
        fs.renameSync(oldPath, newPath);
        const [readerSex,studentNumber,readerMajor,readerPhone,readerEmail,readerGroup,userImgSrc] = [req.body.sex,req.body.studentNumber,req.body.readerMajor,req.body.readerPhone,req.body.readerEmail,req.body.readerGroup,readerImgSrc];
        setDataJson = {readerSex,studentNumber,readerMajor,readerPhone,readerEmail,readerGroup,userImgSrc};
    }else{
        const [readerSex,studentNumber,readerMajor,readerPhone,readerEmail,readerGroup] = [req.body.sex,req.body.studentNumber,req.body.readerMajor,req.body.readerPhone,req.body.readerEmail,req.body.readerGroup];
        setDataJson = {readerSex,studentNumber,readerMajor,readerPhone,readerEmail,readerGroup};
    }
	userDB.updateMessage(req.session.userID, setDataJson, (message) => {
	    res.send(message);
    });
});


// 用户预约设备界面
router.route("/reservation").get(function(req,res){
    if(!req.session.userID || !req.session.userSign){
        res.redirect("/user/login");
        return;
    }
    const userID = req.session.userID;
    userDB.selectMessage(userID, (rows) => {
        const user = rows[0];
        const [userName, userImg, userPermission] = [user.readerName, user.userImgSrc, 'user'];
        const query = 'SELECT equipName,borrowID,borrowTime,returnBefore,reservation,borrowEquipID'
                      + ' FROM hopeequip,equipborrow'
                      + ' WHERE returnWhe=0'
                      + ' AND hopeequip.equipID=equipborrow.borrowEquipID'
                      + ' AND borrowUserID='
                      + userID;
        userDB.query(query, (rows) => {
            const equip = rows;
            equip.forEach(function(e){
                e.borrowTime = e.borrowTime.getFullYear()+"-"+e.borrowTime.getMonth()+"-"+e.borrowTime.getDate();
                e.returnBefore = e.returnBefore.getFullYear()+"-"+e.returnBefore.getMonth()+"-"+e.returnBefore.getDate();
            });
            setSession(req, {userID: user.readerID, userSign: true});
            res.render("user/reservation",{userName,userImg,userPermission,firstPath:'camera',secondPath: '',equip});
        })
    });
}).post(function(req,res){
    const [equipID, borrowID] = [parseInt(req.body.equipID), parseInt(req.body.borrowID)];
    const setDataJson = {
        returnWhe: 1
    };
    reservateDB.updateMessage(borrowID, setDataJson, (message) => {
        const setDataJson = {
            equipLeft: 1
        };
        equipDB.updateMessage(equipID, setDataJson, (message) => {
            res.send(message);
        }, '归还成功');
    });
});
module.exports=router;
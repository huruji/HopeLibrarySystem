const express=require("express");
const mysql_util=require("./mysql_util");
const bodyParser=require("body-parser");
const crypto=require("crypto");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const router=express.Router();
const jsonParser=bodyParser.json();

const setSession = require('./../utils/set-session');
const md5Pass = require('./../utils/md5-pass');

// 用户登录
router.route("/login").post(function(req,res){
	var password_md5=md5Pass(req.body.password);
	mysql_util.DBConnection.query("SELECT readerID,readerName,readerPassword FROM hopereader WHERE readerName=? AND readerPassword=?",[req.body.username,password_md5],function(err,rows,fields){
		if(err){
			var error={
				code:3,
				message:"服务端异常，请稍后再试或者联系管理员"
			};
			res.send(error)
		}else{
			if(rows.length==0){
				var error={
					code:2,
					message:"用户名或密码错误"
				};
				res.send(error)
			}else{
				console.log(rows[0].readerID);
				res.cookie("userId",rows[0].readerID,{
					maxAge: 30 * 60 * 1000,
                    path: '/',
                    httpOnly: true
				});
				var success={
					code:0,
					message:"成功",
					userId:rows[0].readerID
				}
                setSession(req,{userID: rows[0].readerID,userSign: true});
				res.send(success);
			}
		}
	})
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
    if(!req.session.userSign){
        res.redirect("/user/login");
    }else{
        var userId=req.session.userID;
        mysql_util.DBConnection.query("SELECT userImgSrc,readerName FROM hopereader WHERE readerID=?",userId,function(err,rows,fields){
            if(err){
                console.log(err)
            }else{
                var userImg=rows[0].userImgSrc;
                var userName=rows[0].readerName;
                var userPermission="user";
                var mysqlQuery=["SELECT bookName,borrowTime,bookID,borrowID,returnBefore",
                    " FROM hopebook,hopereader,bookborrow",
                    " WHERE hopebook.bookID=bookborrow.borrowBookID",
                    " AND hopereader.readerID=bookborrow.borrowUserID",
                    " AND returnWhe=0",
                    " AND readerID=?"].join("");
                mysql_util.DBConnection.query(mysqlQuery,req.cookies.userId,function(err,rows,fields){
                    if(err){
                        console.log(err);
                        return;
                    }
                    for(var i=0,max=rows.length;i<max;i++){
                        rows[i].returnBefore=rows[i].returnBefore.getFullYear()+"-"+(parseInt(rows[i].returnBefore.getMonth())+1)+"-"+rows[i].returnBefore.getDate();
                        rows[i].borrowTime=rows[i].borrowTime.getFullYear()+"-"+(parseInt(rows[i].borrowTime.getMonth())+1)+"-"+rows[i].borrowTime.getDate();
                    }
                    setSession(req,{userSign:true});
                    res.render("user/index",{book:rows,userImg:userImg,userName:userName,userPermission:userPermission,firstPath:'book'});
                })
            }
        })

    }
}).post(function(req,res){
    if(!req.session.userSign){
        res.redirect("/user/login");
    }else{
        var bookID=req.body.bookID,
            borrowID=req.body.borrowID;
        mysql_util.DBConnection.query("UPDATE hopebook SET bookLeft=bookLeft+1 WHERE bookID=?;UPDATE bookborrow SET returnWhe=1 WHERE borrowID=?",[bookID,borrowID],function(err,rows,fields){
            if(err){
                console.log(err);
                return;
            }
            var success={
                message:"归还成功"
            };
            res.send(success);
        })
    }
})

// 用户重置密码
router.route("/reset").post(function(req,res){
	var password_md5 = md5Pass(req.body.password);
	var userId=req.session.userID;
	mysql_util.DBConnection.query("UPDATE hopereader SET readerPassword=? WHERE readerID=?;",[password_md5,userId],function(err,rows,fields){
		if(err){
			var error={
				code:3,
				message:"服务端异常，请稍后再试或者联系管理员"
			};
			res.send(error)
		}else{
			var success={
				code:0,
				message:"修改成功",
				userId:userId
			}
			res.send(success);
		}
	})
}).get(function(req,res){
	if(!req.session.userSign){
		res.redirect("/user/login");
	}else{
		mysql_util.DBConnection.query("SELECT userImgSrc,readerName FROM hopereader WHERE readerID=?",req.session.userID,function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
				var userImg=rows[0].userImgSrc;
				var userName=rows[0].readerName;
				var userPermission="user";
                setSession(req,{userSign: true});
	            res.render("user/user-reset",{userImg:userImg,userName:userName,userPermission:userPermission,firstPath:'account',secondPath:'reset'});
		})
	}
});

router.route("/borrow").post(function(req,res){
	console.log("post");
	console.log(!req.headers.cookie);
	if(!req.headers.cookie){
		var err={
			code:10
		};
		res.send(err);
	}
})





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
	if(!req.session.sign){
		res.redirect("/user/login");
	}else{
		mysql_util.DBConnection.query("SELECT * FROM hopereader WHERE readerID=?",req.cookies.userId,function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
				var hopeGroup=["网管组","编程组","设计组","前端组","数码组"];
				var userName=rows[0].readerName;
				var userImg=rows[0].userImgSrc;
				var userPermission="user";
				res.setSession(req, {userSign: true});
				res.render("user/user-modify",{userName:userName,userImg:userImg,userPermission:userPermission,user:rows[0],hopeGroup:hopeGroup,firstPath:'account',secondPath:'modify'});
		})
	}
}).post(function(req,res){
    if(!req.session.userSign) {
        res.redirect('/user/login');
        return;
    }
	console.log("post modify");
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
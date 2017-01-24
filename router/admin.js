const express=require("express");
const mysql_util=require("./mysql_util");
const crypto=require("crypto");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const url=require("url");
const router=express.Router();

const setSession = require('./../utils/set-session');
const md5Pass = require('./../utils/md5-pass');
const hopeDB = require('./../utils/hopeDB.js');
const [adminDB, userDB, bookDB, equipDB] = [hopeDB.adminDB, hopeDB.userDB, hopeDB.bookDB, hopeDB.equipDB];

// 管理员登录页面
router.route("/login").post(function(req,res){
	const password_md5=md5Pass(req.body.password);
	const userName = req.body.username;
	const query = 'SELECT * FROM hopeadmin'
                  + ' WHERE adminName='
                  + mysql_util.DBConnection.escape(userName)
                  + ' AND adminPassword="'
                  + password_md5
                  + '"';
	adminDB.query(query,(rows) => {
	    const admin = rows[0];
        if(rows.length==0){
            const error={
                code:2,
                message:"用户名或密码错误"
            };
            res.send(error)
        }else{
            res.cookie("adminId",rows[0].adminID,{
                maxAge: 30 * 60 * 1000,
                path: '/',
            });
            const message ={
                code:0,
                message:"成功",
                userId:rows[0].adminID
            };
            setSession(req,{adminID:admin.adminID,adminSign: true});
            res.send(message);
        }
    });
}).get(function(req,res){
    if(req.session.adminSign){
        res.redirect('/admin');
        return;
    }
	res.render("public/login");
});
//管理员首页
router.route("/").get(function(req,res){
	if(!req.session.adminID || !req.session.adminSign){
		res.redirect("/admin/login");
		return;
	}
    const adminID = req.session.adminID;
	adminDB.selectMessage(adminID, (rows) => {
        const admin=rows[0];
        if(admin.adminPermissions=="super"){
            userDB.selectAll((rows) => {
                let reader=rows;
                adminDB.selectAll((rows) => {
                    let adminUser=rows;
                    let userPageNum=Math.ceil((adminUser.length+reader.length)/10);
                    let user=adminUser.concat(reader);
                    const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
                    setSession(req,{adminID:admin.adminID,adminSign: true});
                    res.render("admin-super/index",{userName,userImg,userPermission,firstPath:"user",secondPath:'',user,userPageNum,userPage:1});
                })
            })
        }else if(admin.adminPermissions=="camera"){
            const query = 'SELECT equipName,equipID,adminName FROM'
                          + ' hopeequip,hopeadmin WHERE'
                          + ' hopeequip.equipAdminID=hopeadmin.adminID ORDER BY equipLeft';
            equipDB.query(query, (rows) => {
                const equip=rows;
                equipDB.countItems('equipNum', (rows) => {
                    const equipNum=Math.ceil(rows[0].equipNum/10);
                    const query = 'SELECT readerName,borrowEquipID FROM'
                                  + ' hopereader,equipborrow WHERE'
                                  + ' borrowUserID=readerID AND returnWhe=0';
                    equipDB.query(query, (rows) => {
                        let borrower=[];
                        for(let i=0,max=equip.length;i<max;i++){
                            borrower[i]=0;
                            for(let j=0,max1=rows.length;j<max1;j++){
                                if(rows[j].borrowEquipID==equip[i].equipD){
                                    borrower[i]=rows[j].readerName;
                                }
                            }
                        }
                        const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
                        setSession(req,{adminID:admin.adminID,adminSign: true});
                        res.render("admin-equip/index",{userName,userImg,userPermission,firstPath:'camera',secondPath:'',equip:equip,borrower:borrower,equipNum:equipNum,equipPage:1});
                    });
                });
            });
        }else if(admin.adminPermissions=="book"){
            bookDB.orderItems('bookLeft', null, null, (rows) => {
                const book = rows;
                bookDB.countItems('bookNum', (rows) => {
                    const bookNum = Math.ceil(rows[0].bookNum/10);
                    const query = 'SELECT readerName,borrowBookID FROM'
                                  + ' hopereader,bookborrow WHERE'
                                  + ' borrowUserID=readerID AND returnWhe=0';
                    bookDB.query(query, (rows) => {
                        let borrower=[];
                        for(let i=0, max=book.length; i<max; i++){
                            borrower[i]=0;
                            for(let j=0,max1=rows.length;j<max1;j++){
                                if(rows[j].borrowBookID==book[i].bookID){
                                    borrower[i]=rows[j].readerName;
                                }
                            }
                        }
                        const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
                        setSession(req,{adminID:admin.adminID,adminSign: true});
                        res.render("admin-book/index",{userName,userImg,userPermission,firstPath:'book',secondPath:'',book:book,borrower:borrower,bookNum:bookNum,bookPage:1});
                    });
                });
            });
        }
    });
});


// 管理员修改密码界面
router.route("/reset").get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
		res.redirect("/admin/login");
		return;
	}
	adminDB.selectMessage(req.session.adminID, (rows) => {
	    const admin = rows[0];
	    const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
        setSession(req,{adminID:admin.adminID,adminSign: true});
        res.render("admin/admin-reset",{userName,userImg,userPermission,firstPath:'account',secondPath:'reset'});
	})
}).post(function(req,res){
	const password_md5 = md5Pass(req.body.password);
		adminDB.resetPassword(req.session.adminID,password_md5,(message) => {
		    res.send(message);
        });
});
//管理员修改头像页面
router.route("/modify-img").post(function(req,res){
	console.log(req.session.adminID);
	var form = new formidable.IncomingForm();
	form.encoding = "utf-8";
	form.uploadDir =path.join("./","public/img/admin");
	form.keepExtensions=true;
	form.maxFieldsSize=2*1024*1024;
	console.log("kkkk");
	form.parse(req,function(err,fields,files){
		console.log(files);
		var extension = files.img.path.substring(files.img.path.lastIndexOf("."));
		var newName="/admin"+req.cookies.userId+Date.now()+extension;
		var newPath=form.uploadDir+newName;
		fs.renameSync(files.img.path,newPath);
		var DBImgSrc="/img/admin"+newName;
		var mysqlQuery="UPDATE hopeadmin SET adminImgSrc=? WHERE adminID=?";
		console.log(mysqlQuery);
		mysql_util.DBConnection.query(mysqlQuery,[DBImgSrc,req.cookies.adminId],function(err,rows,fields){
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
//管理员修改信息
router.route("/modify").get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
		res.redirect("/admin/login");
		return;
	}
    adminDB.selectMessage(req.session.adminID, (rows) => {
        const admin = rows[0];
        const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
        setSession(req,{adminID:rows[0].adminID,adminSign: true});
		res.render("admin/admin-modify",{userName,userImg,userPermission,firstPath:'account',secondPath:'modify',user:admin});
	})
}).post(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/admin/login");
        return;
    }
    adminDB.updateMessage(req.session.adminID, {adminEmail:req.body.readerEmail}, (message) => {
        res.send(message);
    });
});


module.exports=router;
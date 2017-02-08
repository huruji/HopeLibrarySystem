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
const [adminDB, userDB, equipDB] = [hopeDB.adminDB, hopeDB.userDB, hopeDB.equipDB];

// 超级管理员增加用户界面
router.route("/useradd").get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/admin/login");
        return;
    }
    adminDB.selectMessage(req.session.adminID, (rows) => {
        const admin = rows[0];
        const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
        setSession(req,{adminID:admin.adminID,adminSign: true});
        res.render("admin-super/admin-super-add-user",{userName,userImg,userPermission,firstPath:'user',secondPath:'add'});
    });
}).post(function(req,res){
    const password_md5=md5Pass(req.body.password);
    if(req.body.permission=="user"){
        let setDataJson = {
            readerName:req.body.readerName,
            readerEmail:req.body.readerEmail,
            readerPassword:password_md5,
            readerGroup:req.body.hopeGroup
        };
        userDB.addItem(setDataJson, (message) => {
            res.send(message);
        })
    }else{
        let permission;
        if(req.body.permission.includes("super")){
            permission="super";
        }else if(req.body.permission.includes("book")){
            permission="book";
        }else if(req.body.permission.includes("camera")){
            permission="camera";
        }
        let setDataJson = {
            adminName: req.body.readerName,
            adminEmail: req.body.readerEmail,
            adminPassword: password_md5,
            adminPermissions: permission
        };
        adminDB.addItem(setDataJson, (message) => {
            res.send(message);
        });
    }
});

/*用户分页*/
router.route("/admin-user").get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/admin/login");
        return;
    }
    let userPage=req.query.pageTab || 1;
    adminDB.selectMessage(req.session.adminID, (rows) => {
        const admin = rows[0];
        const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
        userDB.selectAll((rows) => {
            let reader=rows;
            adminDB.selectExceptID(req.session.adminID, (rows) => {
                let adminUser=rows;
                let userPageNum=Math.ceil((adminUser.length+reader.length)/10);
                let userStart=(userPage-1)*10;
                let userEnd=userPage*10;
                let user=adminUser.concat(reader).splice(userStart,userEnd);
                setSession(req,{adminID:admin.adminID,adminSign: true});
                res.render("admin-super/index",{userName,userImg,userPermission,firstPath:'user',secondPath:'modify',user,userPageNum,userPage});
            });
        });
    });
});

// 超级管理员修改用户信息页面
router.route("/adminmodifyuser/:userID").get(function(req,res){
    if(!req.session.adminID || !req.session.adminSign){
        res.redirect("/admin/login");
    }
    let userType=req.params.userID.replace(/\d/g,""),
        userID=req.params.userID.replace(/\D/g,"");
    adminDB.selectMessage(req.session.adminID, (rows) => {
        const admin = rows[0];
        const [userName, userImg, userPermission] = [admin.adminName, admin.adminImgSrc, admin.adminPermissions];
        if(userType=="user"){
            userDB.selectMessage(userID, (rows) => {
                const user = rows[0];
                const hopeGroup=["网管组","编程组","设计组","前端组","数码组"];
                setSession(req,{adminID:admin.adminID,adminSign: true});
                res.render("admin-super/admin-super-modify-user",{userName,userImg,userPermission,firstPath:"user",secondPath:'',user,hopeGroup});
            });
        } else if(userType == "admin"){
            adminDB.selectMessage(userID, (rows) => {
                setSession(req,{adminID:admin.adminID,adminSign: true});
                res.render("admin-super/admin-super-modify-user",{userName,userImg,userPermission,firstPath:"user",secondPath:'',user:rows[0]});
            })
        }
    })
}).post(function(req,res){
    let userType=req.params.userID.replace(/\d/g,""),
        userID=req.params.userID.replace(/\D/g,"");
    if(userType=="user"){
        const setDataJson = {
            readerName: req.body.readerName,
            readerSex: req.body.sex,
            studentNumber: req.body.studentNumber,
            readerMajor: req.body.readerMajor,
            readerPhone: req.body.readerPhone,
            readerEmail: req.body.readerEmail,
            readerGroup: req.body.readerGroup
        };
        userDB.updateMessage(userID, setDataJson, (message) => {
            res.send(message);
        })
    }else if(userType=="admin"){
        const setDataJson = {
            adminName: req.body.readerName,
            adminEmail:　req.body.readerEmail,
            adminPermissions: req.body.permission
        };
        adminDB.updateMessage(userID, setDataJson, (message) => {
            res.send(message);
        });
    }
});

//管理员删除用户
router.route("/admindropuser").post(function(req,res){
    let userType=req.body.dropData.replace(/\d/g,""),
        userID=req.body.dropData.replace(/\D/g,"");
    if(userType=="user"){
        const query = 'SELECT * FROM bookborrow WHERE returnWhe=0 AND borrowUserID=' + userID;
        userDB.query(query, (rows) => {
           if(rows.length > 0){
               const message = {
                   message:"当前用户还有书未归还，不能删除"
               };
               res.send(message);
           }else{
               const query = 'SELECT * FROM equipborrow WHERE returnWhe=0 AND borrowUserID=' + userID;
               userDB.query(query, (rows) => {
                   if(rows.length > 0) {
                       const message = {
                           message:"当前用户还有设备未归还，不能删除"
                       };
                       res.send(message);
                   }else {
                       userDB.delItem(userID, (message) => {
                           res.send(message);
                       })
                   }
               });
           }
           
        });
    }else if(userType=="admin"){
        const dataJson = {
            equipAdminID: userID
        };
        equipDB.selectItem(dataJson, (rows) => {
            if(rows.length > 0) {
                const message = {
                    message:"当前用户还管理着设备，不能删除"
                };
                res.send(message);
            }else{
                adminDB.delItem(userID, (message) => {
                    res.send(message);
                });
            }
        });
    }
});
module.exports=router;
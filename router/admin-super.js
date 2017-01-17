const express=require("express");
const mysql_util=require("./mysql_util");
const bodyParser=require("body-parser");
const crypto=require("crypto");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const url=require("url");
const router=express.Router();

const setSession = require('./../utils/set-session');
const md5Pass = require('./../utils/md5-pass');
const hopeDB = require('./../utils/hopeDB.js');
const adminDB = hopeDB.adminDB;
const userDB = hopeDB.userDB;

// 超级管理员增加用户界面
router.route("/useradd").get(function(req,res){
    if(!req.session.adminID){
        res.redirect("/admin/login");
        return;
    }
    adminDB.selectMessage(req.session.adminID, (rows) => {
        var userName=rows[0].adminName,
            userImg=rows[0].adminImgSrc,
            userPermission=rows[0].adminPermissions;
        setSession(req,{adminSign: true});
        res.render("admin-super/admin-super-add-user",{userName:userName,userImg:userImg,userPermission:userPermission,firstPath:'user',secondPath:'add'});
    });
}).post(function(req,res){
    var password_md5=md5Pass(req.body.password);
    if(req.body.permission=="user"){
        let setDataJson = {
            readerName:req.body.readerName,
            readerEmail:req.body.readerEmail,
            readerPassword:password_md5,
            readerGroup:req.body.hopeGroup
        }
        userDB.addUser(setDataJson, (message) => {
            res.send(message);
        })
    }else{
        if(req.body.permission.includes("super")){
            var permission="super";
        }else if(req.body.permission.includes("book")){
            var permission="book";
        }else if(req.body.permission.includes("camera")){
            var permission="camera";
        }
        let setDataJson = {
            adminName: req.body.readerName,
            adminEmail: req.body.readerEmail,
            adminPassword: password_md5,
            adminPermissions: permission
        }
        adminDB.addUser(setDataJson, (message) => {
            res.send(message);
        });
    }
});

/*用户分页*/
router.route("/admin-user").get(function(req,res){
    if(!req.session.adminID){
        res.redirect("/admin/login");
        return;
    }
    var userPage=req.query.pageTab;
    if(!userPage){
        userPage=1;
    }
    adminDB.selectMessage(req.session.adminID, (rows) => {
        var userName=rows[0].adminName,
            userImg=rows[0].adminImgSrc,
            userPermission=rows[0].adminPermissions;
        userDB.selectAll((rows) => {
            let reader=rows;
            adminDB.selectExceptID(req.session.adminID, (rows) => {
                let adminUser=rows;
                let userPageNum=Math.ceil((adminUser.length+reader.length)/10);
                let userStart=(userPage-1)*10;
                let userEnd=userPage*10;
                let user=adminUser.concat(reader).splice(userStart,userEnd);
                setSession(req,{adminSign: true});
                res.render("admin-super/index",{userName:admin.adminName,userImg:admin.adminImgSrc,userPermission:admin.adminPermissions,user:user,userPageNum:userPageNum,userPage:userPage,firstPath:'user',secondPath:'modify'});
            });
        });
    });
});




// 超级管理员修改用户信息页面
router.route("/adminmodifyuser/:userID").get(function(req,res){
    if(!req.session.adminID){
        res.redirect("/admin/login");
    }
    var userType=req.params.userID.replace(/\d/g,""),
        userID=req.params.userID.replace(/\D/g,"");
    console.log("uerType="+userType);
    console.log("userID="+userID);
    adminDB.selectMessage(req.session.adminID, (rows) => {
        let userName=rows[0].adminName,
            userImg=rows[0].adminImgSrc,
            userPermission=rows[0].adminPermissions;
        if(userType=="user"){
            userDB.selectMessage(userID, (rows) => {
                const hopeGroup=["网管组","编程组","设计组","前端组","数码组"];
                setSession(req,{adminSign: true});
                res.render("admin-super/admin-super-modify-user",{userName:userName,userImg:userImg,userPermission:userPermission,user:rows[0],hopeGroup:hopeGroup,firstPath:"user",secondPath:''});
            });
        } else if(userType == "admin"){
            adminDB.selectMessage(userID, (rows) => {
                setSession(req,{adminSign: true});
                res.render("admin-super/admin-super-modify-user",{userName:userName,userImg:userImg,userPermission:userPermission,user:rows[0],firstPath:"user",secondPath:''});
            })
        }
    })
}).post(function(req,res){
    var userType=req.params.userID.replace(/\d/g,""),
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
        }
        userDB.updateMessage(userID, setDataJson, (message) => {
            res.send(message);
        })
    }else if(userType="admin"){
        const setDataJson = {
            adminName: req.body.readerName,
            adminEmail:　req.body.readerEmail,
            adminPermissions: req.body.permission
        }
        adminDB.updateMessage(userID, setDataJson, (message) => {
            res.send(message);
        })
    }
});

//管理员删除用户
router.route("/admindropuser").post(function(req,res){
    var userType=req.body.dropData.replace(/\d/g,""),
        userID=req.body.dropData.replace(/\D/g,"");
    if(userType=="user"){
        mysql_util.DBConnection.query("SELECT * FROM bookborrow WHERE returnWhe=0 AND borrowUserID=?",userID,function(err,rows,fields){
            if(err){
                console.log(err);
                return;
            }else if(rows.length>0){
                var success={
                    message:"当前用户还有书未归还，不能删除",
                    code:2,
                }
                res.send(success);
            }else{
                mysql_util.DBConnection.query("SELECT * FROM equipborrow WHERE returnWhe=0 AND borrowUserID=?",userID,function(err,rows,fields){
                    if(err){
                        console.log(err);
                    }else if(rows.length>0){
                        var success={
                            message:"当前用户还有设备未归还，不能删除",
                            code:2
                        }
                        res.send(success);
                    }else{
                        mysql_util.DBConnection.query("DELETE FROM hopereader WHERE readerID=?",userID,function(err,rows,fields){
                            if(err){
                                console.log(err);
                                return;
                            }
                            var success={
                                message:"删除用户成功",
                            };
                            res.send(success);
                        });
                    }
                })
            }
        })
    }else if(userType=="admin"){
        mysql_util.DBConnection.query("SELECT * FROM hopeequip WHERE equipAdminID=?",userID,function(err,rows,fields){
            if(err){
                console.log(err);
                return;
            }else if(rows.length>0){
                var success={
                    message:"当前用户还管理着设备，不能删除",
                    code:2
                }
                res.send(success);
            }else{
                mysql_util.DBConnection.query("DELETE FROM hopeadmin WHERE adminID=?",userID,function(err,rows,fields){
                    if(err){
                        console.log(err);
                        return;
                    }
                    var success={
                        message:"删除用户成功",
                    };
                    res.send(success);
                });
            }
        })

    }
})
module.exports=router;
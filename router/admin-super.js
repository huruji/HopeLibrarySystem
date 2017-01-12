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


// 超级管理员修改用户界面
router.route("/userModify/:userID").get(function(req,res){
    if(!req.session.userID){
        res.redirect("/admin/login")
    }else{
        var userID=req.params.userID;
        mysql_util.DBConnection.query("SELECT * FROM hopereader WHERE readerID=?",userID,function(err,rows,fields){
            if(err){
                console.log(err);
            }else{
                var hopeGroup=["网管组","编程组","设计组","前端组","数码组"];
                setSession(req,{adminSign: true});
                res.render("admin/adminModifyuser",{user:rows[0],hopeGroup:hopeGroup});
            }
        })
    }
}).post(function(req,res){
    var name=req.body.readerName,
        sex=req.body.sex,
        number=req.body.studentNumber,
        major=req.body.readerMajor,
        phone=req.body.readerPhone,
        email=req.body.readerEmail,
        group=req.body.readerGroup,
        userID=parseInt(req.params.userID);
    var DBParams=[name,sex,group,number,major,phone,email,userID];
    console.log(DBParams);
    mysql_util.DBConnection.query("UPDATE hopereader SET readerName=?,readerSex=?,readerGroup=?,studentNumber=?,readerMajor=?,readerPhone=?,readerEmail=? WHERE readerID=?",DBParams,function(err,rows,fields){
        if(err){
            console.log(err);
        }else{
            var success={
                message:"保存成功"
            };
            res.send(success);
        }
    })
})


// 超级管理员增加用户界面
router.route("/useradd").get(function(req,res){
    if(!req.session.adminID){
        res.redirect("/admin/login");
        return;
    }
    mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
        if(err){
            console.log(err);
            return;
        }
        var userName=rows[0].adminName,
            userImg=rows[0].adminImgSrc,
            userPermission=rows[0].adminPermissions;
        setSession(req,{adminSign: true});
        res.render("admin-super/admin-super-add-user",{userName:userName,userImg:userImg,userPermission:userPermission,firstPath:'user',secondPath:'add'});
    })
}).post(function(req,res){
    var password_md5=md5Pass(req.body.password);
    console.log("req.body.permission"+req.body.permission);
    if(req.body.permission=="user"){
        var queryParams=[req.body.readerName,req.body.readerEmail,password_md5,req.body.hopeGroup];
        var mysqlQuery="INSERT hopereader(readerName,readerEmail,readerPassword,readerGroup) VALUES(?,?,?,?)";
    }else{
        if(req.body.permission.indexOf("super")>=0){
            var permission="super";
        }else if(req.body.permission.indexOf("book")>=0){
            var permission="book";
        }else if(req.body.permission.indexOf("camera")>=0){
            var permission="camera";
        }
        var queryParams=[req.body.readerName,req.body.readerEmail,password_md5,permission];
        var mysqlQuery="INSERT hopeadmin(adminName,adminEmail,adminPassword,adminPermissions) VALUES(?,?,?,?)";
    }
    mysql_util.DBConnection.query(mysqlQuery,queryParams,function(err,rows,fields){
        if(err){
            console.log(err);
        }else{
            var success={
                message:"增加成功"
            };
            res.send(success);
        }
    })
})

/*用户分页*/
router.route("/admin-user").get(function(req,res){
    if(!req.cookies.adminId){
        res.redirect("/admin/login");
        return;
    }
    var userPage=req.query.pageTab;
    if(!userPage){
        userPage=1;
    }
    mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
        if(err){
            console.log(err);
            return;
        }
        var admin=rows[0];
        mysql_util.DBConnection.query("SELECT * FROM hopereader",function(err,rows,fields){
            if(err){
                console.log(err);
                return;
            }
            var reader=rows;
            mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID!=?",req.cookies.adminId,function(err,rows,fields){
                if(err){
                    console.log(err);
                    return;
                }
                var adminUser=rows;
                var userPageNum=Math.ceil((adminUser.length+reader.length)/10);
                var userStart=(userPage-1)*10;
                var userEnd=userPage*10;
                var user=adminUser.concat(reader).splice(userStart,userEnd);
                setSession(req,{adminSign: true});
                res.render("admin-super/index",{userName:admin.adminName,userImg:admin.adminImgSrc,userPermission:admin.adminPermissions,user:user,userPageNum:userPageNum,userPage:userPage,firstPath:'user',secondPath:'modify'});
            });
        });
    });
})




// 超级管理员修改用户信息页面
router.route("/adminmodifyuser/:userID").get(function(req,res){
    if(!req.session.adminID){
        res.redirect("/admin/login");
    }
    var userType=req.params.userID.replace(/\d/g,""),
        userID=req.params.userID.replace(/\D/g,"");
    console.log("uerType="+userType);
    console.log("userID="+userID);
    mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
        if(err){
            console.log(err);
            return;
        }
        var userName=rows[0].adminName;
        var userImg=rows[0].adminImgSrc;
        var userPermission=rows[0].adminPermissions;
        if(userType=="user"){
            console.log("user")
            mysql_util.DBConnection.query("SELECT * FROM hopereader WHERE readerID=?",userID,function(err,rows,fields){
                if(err){
                    console.log(err);
                    return;
                }
                var hopeGroup=["网管组","编程组","设计组","前端组","数码组"];
                setSession(req,{adminSign: true});
                res.render("admin-super/admin-super-modify-user",{userName:userName,userImg:userImg,userPermission:userPermission,user:rows[0],hopeGroup:hopeGroup,firstPath:"user",secondPath:''});
            });

        }else if(userType == "admin"){
            console.log("admin")
            mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",userID,function(err,rows,fields){
                if(err){
                    console.log(err);
                    return;
                }
                setSession(req,{adminSign: true});
                res.render("admin-super/admin-super-modify-user",{userName:userName,userImg:userImg,userPermission:userPermission,user:rows[0],firstPath:"user",secondPath:''});
            });
        }
    });
}).post(function(req,res){
    var userType=req.params.userID.replace(/\d/g,""),
        userID=req.params.userID.replace(/\D/g,"");
    if(userType=="user"){
        var mysqlParams=[req.body.readerName,
            req.body.sex,
            req.body.studentNumber,
            req.body.readerMajor,
            req.body.readerPhone,
            req.body.readerEmail,
            req.body.readerGroup,
            userID];
        console.log(mysqlParams)
        var mysqlQuery=["UPDATE hopereader SET readerName=?,",
            "readerSex=?,studentNumber=?,",
            "readerMajor=?,readerPhone=?,",
            "readerEmail=?,readerGroup=?",
            " WHERE readerID=?"].join("")
        mysql_util.DBConnection.query(mysqlQuery,mysqlParams,function(err,rows,fields){
            if(err){
                console.log(err);
                return;
            }
            var success={
                message:"修改成功"
            };
            res.send(success);

        })
    }else if(userType="admin"){
        var mysqlParams=[req.body.readerName,
            req.body.readerEmail,
            req.body.permission,
            userID];
        console.log(mysqlParams);
        mysql_util.DBConnection.query("UPDATE hopeadmin SET adminName=?,adminEmail=?,adminPermissions=? WHERE adminID=?",mysqlParams,function(err,rows,fields){
            if(err){
                console.log(err);
                return;
            }
            var success={
                message:"修改成功"
            };
            res.send(success);
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
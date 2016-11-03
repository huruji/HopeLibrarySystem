const express=require("express");
const mysql_util=require("./mysql_util");
const router=express.Router();
const bodyParser=require("body-parser");
const util = require("util");
const nodemailer = require("nodemailer");
const config=require("./../config");

router.route("/").get(function(req,res){
	mysql_util.DBConnection.query("SELECT * FROM hopeEquip ORDER BY equipLeft DESC LIMIT 0,20",function(err,rows,fields){
		if(err){
			res.send("出错了，请联系管理员");
			return;
		}
		var equip=rows;
		res.render("equip/index",{"equip":equip});
	});
})


router.route("/equipemail").post(function(req,res){
	var equipID=parseInt(req.body.equipID);
	console.log(equipID);
	var mysqlQuery = ["SELECT adminName,equipName",
	                  " FROM hopeAdmin,hopeEquip",
	                  " WHERE hopeAdmin.adminID=hopeEquip.equipAdminID",
	                  " AND hopeEquip.equipID =?"].join("");
	if(!req.cookies.userId){
		var noLogin = {
			noLogin:true,
			code:4
		}
		res.send(noLogin);
		return;
	}
	mysql_util.DBConnection.query("SELECT adminName,equipName FROM hopeAdmin,hopeEquip WHERE hopeAdmin.adminID=hopeEquip.equipAdminID AND hopeEquip.equipID = ?",equipID,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var success = {
			adminName:rows[0].adminName,
			equipName:rows[0].equipName
		}
		res.send(success);
	})
})

router.route("/equipreservation").post(function(req,res){
	var equipID=parseInt(req.body.equipID);
	var info = req.body.info;
	mysql_util.DBConnection.query("UPDATE hopeEquip SET equipLeft=0 WHERE equipID = ?",equipID,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var mysqlQuery = "INSERT equipBorrow Values(DEFAULT,?,?,CURDATE(),DEFAULT,ADDDATE(CURDATE(),3),DEFAULT,?)";
		mysql_util.DBConnection.query(mysqlQuery,[equipID,req.cookies.userId,info],function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			var mysqlQuery = ["SELECT adminName,equipName,adminEmail,readerName",
			                  " FROM hopeAdmin,hopeEquip,hopeReader",
			                  " WHERE hopeAdmin.adminID=hopeEquip.equipAdminID",
			                  " AND hopeEquip.equipID = ?",
			                  " AND hopeReader.readerID=?"].join("");
			mysql_util.DBConnection.query(mysqlQuery,[equipID,req.cookies.userId],function(err,rows,fields){
				if(err){
					console.log(err);
					return;
				}
				var adminEmail = rows[0].adminEmail;
				var readerName = rows[0].readerName;
				var equipName = rows[0].equipName;
				var adminName = rows[0].adminName;
				var transporter = nodemailer.createTransport({
					host:config.email.transportOptions.host,
					port:config.email.transportOptions.port,
					secure:config.email.transportOptions.secure,
					auth:{
						user:config.email.userEmail,
						pass:config.email.userEmailPassWord
					}
				});
				var emailHTML=util.format(config.reservationEmail.emailHTML,adminName,readerName,equipName,info);
				var mailoption = {
					from:config.email.userEmail,
					to:adminEmail,
					subject:config.reservationEmail.emailSubject,
					html:emailHTML
				}
				transporter.sendMail(mailoption,function(err,info){
					if(err){
						console.log(err);
						return;
					}
					console.log(info.response);
				})
            	var success = {
            		message:"预约成功，请等待审核!"
            	};
            	res.send(success);
			})
		})
	})
})
module.exports=router;
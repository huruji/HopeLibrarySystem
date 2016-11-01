const express=require("express");
const mysql_util=require("./mysql_util");
const router=express.Router();
const bodyParser=require("body-parser");


router.route("/").get(function(req,res){
	mysql_util.DBConnection.query("SELECT * FROM hopeEquip ORDER BY equipLeft DESC LIMIT 0,20",function(err,rows,fields){
		if(err){
			res.send("出错了，请联系管理员");
			return;
		}
		var equip=rows;
		res.render("equip/index",{"equip":equip});
	});
}).post(function(req,res){
	console.log("post");
	console.log(!req.headers.cookie);
	console.log(req.cookies);
	if(!req.cookies.userId){
		var err={
			code:10
		};
		res.send(err);
	}else{
		var borrowID=req.body.borrowID;
		var userID=req.cookies.userId;
		console.log(userID,borrowID);
		mysql_util.DBConnection.query("SELECT bookLeft FROM hopeBook WHERE bookID=?",[borrowID],function(err,rows,fields){
			if(err){
				console.log(err);
			}else{
				var left=rows[0].bookLeft-1;
				console.log("left:"+left);
				console.log(req.cookies.userId);
                var userId=parseInt(req.cookies.userId);
				mysql_util.DBConnection.query("UPDATE hopeBook SET bookLeft=? WHERE bookID=?;INSERT bookBorrow VALUES(DEFAULT,?,?,CURDATE(),DEFAULT,ADDDATE(CURDATE(),30));",[left,borrowID,borrowID,userId],function(err,rows,fields){
					if(err){
						console.log(err)
					}else{
						var success={
							message:"借阅成功"
						}
						res.send(success);
					}
				})
			}
		})
	}
})


router.route("/equipemail").post(function(req,res){
	var equipID=parseInt(req.body.equipID);
	console.log(equipID);
	var mysqlQuery = ["SELECT adminName,equipName",
	                  " FROM hopeAdmin,hopeEquip",
	                  " WHERE hopeAdmin.adminID=hopeEquip.equipAdminID",
	                  " AND hopeEquip.equipID =?"].join("");
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

module.exports=router;
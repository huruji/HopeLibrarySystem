const express=require("express");
const mysql_util=require("./mysql_util");
const bodyParser=require("body-parser");
const crypto=require("crypto");
const url=require("url");
const router=express.Router();

/*设备管理员图书分页*/
router.route("/admin-equip").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login");
		return;
	}
	var pageNum=req.query.pageTab;
	if(!pageNum){
		pageNum=1;
	}
	mysql_util.DBConnection.query("SELECT * FROM hopeAdmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;
		var pageStart=(pageNum-1)*10;
		var pageEnd=pageNum*10;
		var mysqlQuery=["SELECT equipName,equipID,adminName",
		                " FROM hopeEquip,hopeAdmin",
		                " WHERE hopeEquip.equipAdminID=hopeAdmin.adminID",
		                " ORDER BY equipLeft LIMIT ?,?"].join("");
		mysql_util.DBConnection.query(mysqlQuery,[pageStart,pageEnd],function(err,rows,fields){
		    if(err){
		    	console.log(err);
		    	return;
		    }
            var equip=rows;
			mysql_util.DBConnection.query("SELECT COUNT(*) AS equipNum FROM hopeEquip",function(err,rows,fields){
				if(err){
					console.log(err);
					return;
				}
				var equipNum=Math.ceil(rows[0].equipNum/10);
				mysql_util.DBConnection.query("SELECT readerName,borrowEquipID FROM hopeReader,equipBorrow WHERE borrowUserID=readerID AND returnWhe=0",function(err,rows,fields){
					if(err){
						console.log(err);
						return;
					}
					var borrower=[];
					for(var i=0,max=equip.length;i<max;i++){
						borrower[i]=0;
						for(var j=0,max1=rows.length;j<max1;j++){
							if(rows[j].borrowEquipID==equip[i].equipD){
								borrower[i]=rows[j].readerName;
							}
						}
					}
					res.render("admin-equip/index",{userName:userName,userImg:userImg,userPermission:userPermission,equip:equip,borrower:borrower,equipNum:equipNum,equipPage:pageNum});
		 		});
			});
    	});
	});
});

//管理员修改设备信息
router.route("/equipmodify/:equipID").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login");
		return;
	}
	var equipID=req.params.equipID;
	mysql_util.DBConnection.query("SELECT * FROM hopeAdmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;
		mysql_util.DBConnection.query("SELECT equipHopeID,equipName,equipImgSrc,adminName FROM hopeEquip,hopeAdmin WHERE hopeEquip.equipAdminID=hopeAdmin.adminID AND equipID=?",equipID,function(err,rows,fields){
			if(err){
				console.log(err);
            	return;
			}
			res.render("admin-equip/equipModify",{equip:rows[0],userName:userName,userImg:userImg,userPermission:userPermission});
		});
	});
}).post(function(req,res){
	console.log("aaaaa");
	var equipID=req.params.equipID;
    mysql_util.DBConnection.query("SELECT * FROM hopeAdmin WHERE adminName=?",req.body.equipAdmin,function(err,rows,fields){
    	if(err){
    		console.log(err);
    		console.log(typeof err);
    		return;
    	}
    	var adminID=rows[0].adminID;
    	var DBParam=[req.body.equipName,
	             	req.body.hopeID,
	             	adminID,
	             	equipID];
    	mysql_util.DBConnection.query("UPDATE hopeEquip SET equipName=?,equipHopeID=?,equipAdminID=? WHERE equipID=?",DBParam,function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			var success={
				message:"修改成功"
			}
			res.send(success);
		});
    });	
});

router.route("/check").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login");
		return;
	}
	mysql_util.DBConnection.query("SELECT * FROM hopeAdmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;
		var mysqlQuery=["SELECT readerName,borrowTime,equipName,reservationText,borrowEquipID,adminName",
		                " FROM hopeReader,equipBorrow,hopeEquip,hopeAdmin",
		                " WHERE equipBorrow.borrowEquipID=hopeEquip.equipID",
		                " AND equipBorrow.reservation=0",
		                " AND equipBorrow.borrowUserID=hopeReader.readerID",
		                " AND hopeEquip.equipAdminID=hopeAdmin.adminID",
		                " AND hopeAdmin.adminID=?"].join("");
		mysql_util.DBConnection.query(mysqlQuery,req.cookies.adminId,function(err,rows,fields){
			if(err){
				console.log(err);
            	return;
			}
			rows.forEach(function(e){
				e.borrowTime = e.borrowTime.getFullYear()+"-"+e.borrowTime.getMonth()+"-"+e.borrowTime.getDate();
			});
			res.render("admin-equip/equipCheck",{equip:rows,userName:userName,userImg:userImg,userPermission:userPermission});
		});
	});
}).post(function(req,res){
	var equipID=req.body.equipID;
	var check=req.body.check;
	console.log(equipID,check);
	if(check==="true"){
		console.log("是");
		mysql_util.DBConnection.query("UPDATE equipBorrow SET reservation=1 WHERE borrowEquipID=?",equipID,function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			var success = {
				message:"操作成功"
			}
			res.send(success)
		})
	}else if(check==="false"){
		console.log("否");
		mysql_util.DBConnection.query("UPDATE  hopeEquip SET equipLeft=1 WHERE equipID=?",equipID,function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			mysql_util.DBConnection.query("DELETE FROM equipBorrow WHERE borrowEquipID=?",equipID,function(err,rows,fields){
				if(err){
					console.log(err);
					return;
				}
				var success = {
					message:"操作成功"
				};
				res.send(success);
			})

		})
	}
		
})

module.exports=router;
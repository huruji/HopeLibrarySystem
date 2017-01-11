const express=require("express");
const mysql_util=require("./mysql_util");
const bodyParser=require("body-parser");
const crypto=require("crypto");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
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
	mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
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
		                " FROM hopeequip,hopeadmin",
		                " WHERE hopeequip.equipAdminID=hopeadmin.adminID",
		                " ORDER BY equipLeft LIMIT ?,?"].join("");
		mysql_util.DBConnection.query(mysqlQuery,[pageStart,pageEnd],function(err,rows,fields){
		    if(err){
		    	console.log(err);
		    	return;
		    }
            var equip=rows;
			mysql_util.DBConnection.query("SELECT COUNT(*) AS equipNum FROM hopeequip",function(err,rows,fields){
				if(err){
					console.log(err);
					return;
				}
				var equipNum=Math.ceil(rows[0].equipNum/10);
				mysql_util.DBConnection.query("SELECT readerName,borrowEquipID FROM hopereader,equipborrow WHERE borrowUserID=readerID AND returnWhe=0",function(err,rows,fields){
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
					res.render("admin-equip/index",{userName:userName,userImg:userImg,userPermission:userPermission,equip:equip,borrower:borrower,equipNum:equipNum,equipPage:pageNum,firstPath:'camera',secondPath:'modify'});
		 		});
			});
    	});
	});
});


//管理员修改设备信息

router.route("/equipmodify-img/:equipID").post(function(req,res){
	var equipID=req.params.equipID;
	var form = new formidable.IncomingForm();
	form.encoding = "utf-8";
	form.uploadDir =path.join("./","public/img/equip");
	form.keepExtensions=true;
	form.maxFieldsSize=2*1024*1024;
	form.parse(req,function(err,fields,files){
		console.log(files);
		var extension = files.img.path.substring(files.img.path.lastIndexOf("."));
		var newName="/equip"+equipID+Date.now()+extension;
		var newPath=form.uploadDir+newName;
		fs.renameSync(files.img.path,newPath);
		var DBImgSrc="/img/equip"+newName;
		var mysqlQuery="UPDATE hopeequip SET equipImgSrc=? WHERE equipID=?";
		console.log(mysqlQuery);
		mysql_util.DBConnection.query(mysqlQuery,[DBImgSrc,equipID],function(err,rows,fields){
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
router.route("/equipmodify/:equipID").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login");
		return;
	}
	var equipID=req.params.equipID;
	mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;
		mysql_util.DBConnection.query("SELECT equipHopeID,equipName,equipImgSrc,adminName FROM hopeequip,hopeadmin WHERE hopeequip.equipAdminID=hopeadmin.adminID AND equipID=?",equipID,function(err,rows,fields){
			if(err){
				console.log(err);
            	return;
			}
			res.render("admin-equip/admin-equip-modify",{equip:rows[0],userName:userName,userImg:userImg,userPermission:userPermission,firstPath:'camera',secondPath:'modify'});
		});
	});
}).post(function(req,res){
	console.log("aaaaa");
	var equipID=req.params.equipID;
    mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminName=?  AND adminPermissions='camera'",req.body.equipAdmin,function(err,rows,fields){
    	if(err){
    		console.log(err);
    		console.log(typeof err);
    		return;
    	}
    	if(rows.length<1){
    		var err={
    			code:2,
    			message:"该管理员不存在"
    		}
    		res.send(err);
    		return;
    	}
    	var adminID=rows[0].adminID;
    	var DBParam=[req.body.equipName,
	             	req.body.hopeID,
	             	adminID,
	             	equipID];
    	mysql_util.DBConnection.query("UPDATE hopeequip SET equipName=?,equipHopeID=?,equipAdminID=? WHERE equipID=?",DBParam,function(err,rows,fields){
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
	mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;
		var mysqlQuery=["SELECT readerName,borrowTime,equipName,reservationText,borrowEquipID,adminName",
		                " FROM hopereader,equipborrow,hopeequip,hopeadmin",
		                " WHERE equipborrow.borrowEquipID=hopeequip.equipID",
		                " AND equipborrow.reservation=0",
		                " AND equipborrow.borrowUserID=hopereader.readerID",
		                " AND hopeequip.equipAdminID=hopeadmin.adminID",
		                " AND hopeadmin.adminID=?"].join("");
		mysql_util.DBConnection.query(mysqlQuery,req.cookies.adminId,function(err,rows,fields){
			if(err){
				console.log(err);
            	return;
			}
			rows.forEach(function(e){
				e.borrowTime = e.borrowTime.getFullYear()+"-"+e.borrowTime.getMonth()+"-"+e.borrowTime.getDate();
			});
			res.render("admin-equip/admin-equip-check",{equip:rows,userName:userName,userImg:userImg,userPermission:userPermission,firstPath:'camera',secondPath:'check'});
		});
	});
}).post(function(req,res){
	var equipID=req.body.equipID;
	var check=req.body.check;
	console.log(equipID,check);
	if(check==="true"){
		console.log("是");
		mysql_util.DBConnection.query("UPDATE equipborrow SET reservation=1 WHERE borrowEquipID=?",equipID,function(err,rows,fields){
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
		mysql_util.DBConnection.query("UPDATE  hopeequip SET equipLeft=1 WHERE equipID=?",equipID,function(err,rows,fields){
			if(err){
				console.log(err);
				return;
			}
			mysql_util.DBConnection.query("DELETE FROM equipborrow WHERE borrowEquipID=?",equipID,function(err,rows,fields){
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
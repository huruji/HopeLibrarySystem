const express=require("express");
const mysql_util=require("./mysql_util");
const bodyParser=require("body-parser");
const crypto=require("crypto");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const url=require("url");
const router=express.Router();

router.route("/login").post(function(req,res){
	var sha=crypto.createHash("md5");
	sha.update(req.body.password);
	var password_md5=sha.digest("hex");
	mysql_util.DBConnection.query("SELECT adminID,adminName,adminPassword FROM hopeadmin WHERE adminName=? AND adminPassword=?",[req.body.username,password_md5],function(err,rows,fields){
		if(err){
			var error={
				code:3,
				message:"服务端异常，请稍后再试或者联系管理员"
			};
			console.log(err);
			res.send(error)
		}else{
			if(rows.length==0){
				var error={
					code:2,
					message:"用户名或密码错误"
				};
				res.send(error)
			}else{
				res.cookie("adminId",rows[0].adminID,{
					maxAge: 30 * 60 * 1000,
                    path: '/',
				});
				var success={
					code:0,
					message:"成功",
					userId:rows[0].adminID
				}
				res.send(success);
			}
		}
	})
}).get(function(req,res){
	res.render("public/login");
})
router.route("/").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login");
		console.log("no cookie");
	}else{
		var adminId=req.cookies.adminId;
		console.log("have cookie:"+req.cookies.adminId);
		mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",adminId,function(err,rows,fields){
			var admin=rows[0];
			if(rows[0].adminPermissions=="super"){
				mysql_util.DBConnection.query("SELECT * FROM hopereader",function(err,rows,fields){
					if(err){
						console.log(err);
						return;
					}
					var reader=rows;
					mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID!=?",adminId,function(err,rows,fields){
						if(err){
							console.log(err);
							return;
						}
						var adminUser=rows;
						var userPageNum=Math.ceil((adminUser.length+reader.length)/10);
						console.log(userPageNum);
						var user=adminUser.concat(reader);
						res.render("admin/index1",{userName:admin.adminName,userImg:admin.adminImgSrc,userPermission:admin.adminPermissions,user:user,userPageNum:userPageNum,userPage:1});
					});
				});
			}else if(rows[0].adminPermissions=="camera"){
				mysql_util.DBConnection.query("SELECT equipName,equipID,adminName FROM hopeequip,hopeadmin WHERE hopeequip.equipAdminID=hopeadmin.adminID ORDER BY equipLeft",req.cookies.adminId,function(err,rows,fields){
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
							res.render("admin-equip/index",{userName:admin.adminName,userImg:admin.adminImgSrc,userPermission:admin.adminPermissions,equip:equip,borrower:borrower,equipNum:equipNum,equipPage:1});
						})
					})
				});
			}else{
				mysql_util.DBConnection.query("SELECT * FROM hopebook ORDER BY bookLeft",function(err,rows,fields){
					if(err){
						console.log(err);
					}else{
						var book=rows;
						mysql_util.DBConnection.query("SELECT COUNT(*) AS bookNum FROM hopebook",function(err,rows,fields){
							if(err){
								console.log(err);
								return;
							}
							var bookNum=Math.ceil(rows[0].bookNum/10);
							console.log("bookNum:"+bookNum)
							mysql_util.DBConnection.query("SELECT readerName,borrowBookID FROM hopereader,bookborrow WHERE borrowUserID=readerID AND returnWhe=0",function(err,rows,fields){
								if(err){
									console.log(err);
								}else{
									var borrower=[];
									for(var i=0,max=book.length;i<max;i++){
										borrower[i]=0;
										for(var j=0,max1=rows.length;j<max1;j++){
											if(rows[j].borrowBookID==book[i].bookID){
												borrower[i]=rows[j].readerName;
											}
									 	}
									}
								res.render("admin-book/index1",{userName:admin.adminName,userImg:admin.adminImgSrc,userPermission:admin.adminPermissions,book:book,borrower:borrower,bookNum:bookNum,bookPage:1});
								}
							})
						})		
					}
				});
			}
		})
	}
})


router.route("/userModify/:userID").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login")
	}else{
		var userID=req.params.userID;
		mysql_util.DBConnection.query("SELECT * FROM hopereader WHERE readerID=?",userID,function(err,rows,fields){
			if(err){
				console.log(err);
			}else{
				var hopeGroup=["网管组","编程组","设计组","前端组","数码组"];
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




/*//管理员修改图书信息
router.route("/bookmodify/:bookID").get(function(req,res){
	if(!req.cookies.adminId){
		res.redirect("/admin/login");
		return;
	}
	var bookID=req.params.bookID;
	mysql_util.DBConnection.query("SELECT * FROM hopebook,hopeadmin WHERE bookID=? AND adminID=?",[bookID,req.cookies.adminId],function(err,rows,fields){
		if(err){
			console.log(err);
            return;
		}
		var userName=rows[0].adminName;
		var userImg=rows[0].adminImgSrc;
		var userPermission=rows[0].adminPermissions;
		var bookCate=["编程类","设计类","摄影类","其他"];
		res.render("admin-book/bookModify1",{book:rows[0],bookCate:bookCate,userName:userName,userImg:userImg,userPermission:userPermission});
	});
}).post(function(req,res){
	console.log("aaaaa");
	var bookID=req.params.bookID;
	var DBParam=[req.body.bookName,req.body.hopeID,req.body.bookAuthor,req.body.bookISBN,req.body.bookPress,req.body.bookGroup,bookID];
	console.log(DBParam);
	mysql_util.DBConnection.query("UPDATE hopebook SET bookName=?,bookHopeID=?,bookAuthor=?,bookISBN=?,bookPress=?,bookCate=? WHERE bookID=?",DBParam,function(err,rows,fields){
		if(err){
			console.log(err);
		}
		var success={
			message:"修改成功"
		}
		res.send(success);
	});
});*/



router.route("/useradd").get(function(req,res){
	if(!req.cookies.adminId){
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
		res.render("admin/userAdd1",{userName:userName,userImg:userImg,userPermission:userPermission});
	})
}).post(function(req,res){
	var sha=crypto.createHash("md5");
	console.log("req.body.password"+req.body.password);
	sha.update(req.body.password);
	var password_md5=sha.digest("hex");
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
				res.render("admin/index1",{userName:admin.adminName,userImg:admin.adminImgSrc,userPermission:admin.adminPermissions,user:user,userPageNum:userPageNum,userPage:userPage});
		});
	});
	});
})


router.route("/reset").get(function(req,res){
	if(!req.cookies.adminId){
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
		res.render("admin-book/reset1",{userName:userName,userImg:userImg,userPermission:userPermission});
	});
}).post(function(req,res){
	var sha=crypto.createHash("md5");
	sha.update(req.body.password);
	var password_md5=sha.digest("hex");
	mysql_util.DBConnection.query("UPDATE hopeadmin SET adminPassword=? WHERE adminID=?",[password_md5,req.cookies.adminId],function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var success={
			message:"修改成功",
		};
		res.send(success);
	});
});
router.route("/modify-img").post(function(req,res){
	console.log(req.cookies.adminId);
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
	if(!req.cookies.adminId){
		res.redirect("/admin/login");
		return;
	}
	mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",req.cookies.adminId,function(err,rows,fields){
		var userName=rows[0].adminName,
		    userImg=rows[0].adminImgSrc,
		    userPermission=rows[0].adminPermissions;
		res.render("admin-book/adminModify",{userName:userName,userImg:userImg,userPermission:userPermission,user:rows[0]});
	})
}).post(function(req,res){
	mysql_util.DBConnection.query("UPDATE hopeadmin SET adminEmail=? WHERE adminID=?",[req.body.readerEmail,req.cookies.adminId],function(err,rows,fields){
		if(err){
			console.log(err)
			return;
		}
		var success={
			message:"修改成功"
		};
		res.send(success);
	});
});

router.route("/adminmodifyuser/:userID").get(function(req,res){
	if(!req.cookies.adminId){
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
				res.render("admin/adminModifyuser1",{userName:userName,userImg:userImg,userPermission:userPermission,user:rows[0],hopeGroup:hopeGroup});
			});

		}else if(userType == "admin"){
			console.log("admin")
			mysql_util.DBConnection.query("SELECT * FROM hopeadmin WHERE adminID=?",userID,function(err,rows,fields){
				if(err){
					console.log(err);
					return;
				}
				res.render("admin/adminModifyuser1",{userName:userName,userImg:userImg,userPermission:userPermission,user:rows[0]});
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
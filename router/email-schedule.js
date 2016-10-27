const schedule=require("node-schedule");
const mysql_util=require("./mysql_util");
const nodemailer=require("nodemailer");
const config=require("./../config");
const util = require("util");

function emailSchedule(){
var j=schedule.scheduleJob("42 36 21 * * *",function(){
	var mysqlQuery=["SELECT borrowBookID,borrowUserID,readerName,readerEmail,bookName,bookHopeID,returnBefore",
	                " FROM bookBorrow,hopeReader,hopeBook",
	                " WHERE bookBorrow.borrowBookID=hopeBook.bookID",
	                " AND bookBorrow.borrowUserID=hopeReader.readerID",
	                " AND bookBorrow.returnWhe=0",
	                " AND DATEDIFF(bookBorrow.returnBefore,CURDATE())=4",
	                " ORDER BY hopeReader.readerID"].join("")
	mysql_util.DBConnection.query(mysqlQuery,function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var readerIDArr=[];
		rows.forEach(function(e){
			readerIDArr.push(e.borrowUserID);
			e.returnBefore=e.returnBefore.getFullYear()+"-"+(e.returnBefore.getMonth()+1)+"-"+e.returnBefore.getDate();
		});
        console.log(readerIDArr);
		var readerIDStr=readerIDArr.join();
		console.log(readerIDStr);
        var readerIDRepArr=[];
		for(var i=0,max = readerIDArr.length;i<max;i++){
			if(readerIDStr.replace(readerIDArr[i],"").indexOf(readerIDArr[i])>-1){
				readerIDRepArr.push(readerIDArr[i]);
				console.log("repeat");
			}else{
				console.log("unique");
				var transporter=nodemailer.createTransport({
					host:config.email.transportOptions.host,
					port:config.email.transportOptions.port,
					secure:config.email.transportOptions.secure,
					auth:{
						user:config.email.userEmail,
						pass:config.email.userEmailPassWord
						}
					});
				console.log(rows[i].bookName);
				var emailHTML = [util.format(config.email.emailHTMLStart,rows[i].readerName),
				                 util.format(config.email.emailHTMLRepeat,rows[i].bookName,rows[i].bookHopeID,rows[i].returnBefore),
				                 config.email.emailHTMLEnd].join("");
				var mailoption={
					from:config.email.userEmail,
					to:rows[i].readerEmail,
					subject:config.email.emailSubject,
					html:emailHTML
				};
				transporter.sendMail(mailoption,function(err,info){
					if(err){
						console.log(err);
						return;
					}
					console.log(info.response);
				});
			}
		}


		function unique(arr){
			var arr1=[];
			for(var i = 0, max = arr.length;i<max;i++){
				if(arr.indexOf(arr[i])==i){
					arr1.push(arr[i]);
				}
			}
			return arr1;
		}

		var noRep=unique(readerIDRepArr);

		noRep.forEach(function(e){
			var mysqlQuery=["SELECT borrowBookID,borrowUserID,readerName,readerEmail,bookName,bookHopeID,returnBefore",
			                " FROM bookBorrow,hopeReader,hopeBook",
			                " WHERE bookBorrow.borrowBookID=hopeBook.bookID",
			                " AND bookBorrow.borrowUserID=hopeReader.readerID",
			                " AND bookBorrow.returnWhe=0",
			                " AND DATEDIFF(bookBorrow.returnBefore,CURDATE())=4",
			                " AND hopeReader.readerID=?"].join("");
			mysql_util.DBConnection.query(mysqlQuery,e,function(err,rows,fields){
				if(err){
					console.log(err);
					return;
				}
				var transporter=nodemailer.createTransport({
					host:config.email.transportOptions.host,
					port:config.email.transportOptions.port,
					secure:config.email.transportOptions.secure,
					auth:{
						user:config.email.userEmail,
						pass:config.email.userEmailPassWord
						}
					});
				var tableHTML="";
				rows.forEach(function(e){
					e.returnBefore = e.returnBefore.getFullYear()+"-"+(e.returnBefore.getMonth()+1)+"-"+e.returnBefore.getDate();
					var table = util.format(config.email.emailHTMLRepeat,e.bookName,e.bookHopeID,e.returnBefore);
				    tableHTML += table;
				});
				console.log(tableHTML);
				var emailHTML = [util.format(config.email.emailHTMLStart,rows[0].readerName),
				                 tableHTML,
				                 config.email.emailHTMLEnd].join("");
			    var mailoption={
					from:config.email.userEmail,
					to:rows[0].readerEmail,
					subject:config.email.emailSubject,
					html:emailHTML
				};
				transporter.sendMail(mailoption,function(err,info){
					if(err){
						console.log(err);
						return;
					}
					console.log(info.response);
				});
			})
		})
		
	})
})
}

module.exports=emailSchedule;
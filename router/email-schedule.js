const schedule=require("node-schedule");
const mysql_util=require("./mysql_util");
const nodemailer=require("nodemailer");
const config=require("./../config");

function emailSchedule(){
var j=schedule.scheduleJob("42 32 0 * * *",function(){
	mysql_util.DBConnection.query("SELECT borrowBookID,borrowUserID,readerName,readerEmail,bookName,bookHopeID,returnBefore FROM bookBorrow,hopeReader,hopeBook WHERE bookBorrow.borrowBookID=hopeBook.bookID AND bookBorrow.borrowUserID=hopeReader.readerID AND bookBorrow.returnWhe=0 AND DATEDIFF(bookBorrow.returnBefore,CURDATE())=4 ORDER BY hopeReader.readerID",function(err,rows,fields){
		if(err){
			console.log(err);
			return;
		}
		var readerIDArr=[];
		rows.forEach(function(e){
			readerIDArr.push(e.readerID);
			e.returnBefore=e.returnBefore.getFullYear()+"-"+(e.returnBefore.getMonth()+1)+"-"+e.returnBefore.getDate();
		});
		for(var i = 0, max = readerIDArr.length;i<max;i++){
			if(readerIDArr.indexOf(readerIDArr[i])==i){
				var transporter=nodemailer.createTransport({
					host:config.email.transportOptions.host,
					port:config.email.transportOptions.port,
					secure:config.email.transportOptions.secure,
					auth:{
						user:config.email.userEmail,
						pass:config.email.userEmailPassWord
						}
					});
				/*rows[i].readerName+ rows[i].bookName+rows[i].bookHopeID+""+rows[i].returnBefore*/
				console.log(rows[i].bookName);
				var emailHTML='<p>'+rows[i].readerName+'<p>以下图书将于5天后过期，请及时归还工作室</p><table style=\" border-collapse: collapse;border-spacing: 0;width:100%\"><thead><tr><th style=\"width:60%;border:1px solid #777;text-align: left;\">图书名</th><th style=\"width:20%;border:1px solid #777;text-align: left;\">厚朴编号</th><th style=\"width:20%;border:1px solid #777;text-align: left;\">应还日期</th></tr></thead><tbody><tr>' + '<td style=\"width:60%;border:1px solid #777;text-align: left;\">'+rows[i].bookName+'</td><td style=\"width:20%;border:1px solid #777;text-align: left;\">'+rows[i].bookHopeID+'</td><td style=\"width:20%;border:1px solid #777;text-align: left;\">'+rows[i].returnBefore+'</td></tr></tbody></table>';
				var mailoption={
					from:config.email.userEmail,
					to:rows[i].readerEmail,
					subject:config.email.emailSubject,
					html:emailHTML
				}
				transporter.sendMail(mailoption,function(err,info){
					if(err){
						console.log(err);
						return;
					}
					console.log(info.response);
				})
			}else{
				console.log("该名同学借了多本书");
			}
		}
		rows.forEach(function(e){
			var transporter=nodemailer.createTransport({
				host:config.email.transportOptions.host,
				port:config.email.transportOptions.port,
				secure:config.email.transportOptions.secure,
				auth:{
					user:config.email.userEmail,
					pass:config.email.userEmailPassWord
				}
			});
			var mailoption={
				from:config.email.userEmail,
				to:e.readerEmail,
				subject:config.email.emailSubject,

			}
		})
	})
})
}

module.exports=emailSchedule;
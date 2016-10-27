const DB={
	host:"localhost",
	port:3306,
	user:"huruji",
	password:"xie138108",
	database:"hopeWechat"
}
const server={
	port:3000
}
const emailSetting={
	userEmail:"xiezhq3@mail2.sysu.edu.cn",
	userEmailPassWord:"showca7seD",
	transportOptions:{
		host:"smtp.exmail.qq.com",
		port:465,
		secure:true
	},
	emailSubject:"厚朴工作室到期图书提醒",
    emailHTMLStart:['<p> %s 同学:</p><p style="text-indent:2em;">',
                    '以下图书将于5天后过期，请及时归还工作室</p>',
                    '<table style=\" border-collapse: collapse;border-spacing: 0;width:100%\">',
                    '<thead><tr><th style=\"width:60%;border:1px solid #777;text-align: left;\">图书名</th>',
                    '<th style=\"width:20%;border:1px solid #777;text-align: left;\">厚朴编号</th>',
                    '<th style=\"width:20%;border:1px solid #777;text-align: left;\">应还日期</th></thead>'].join(""),
    emailHTMLRepeat:['<tbody><tr><td style=\"width:60%;border:1px solid #777;text-align: left;\"> %s </td>',
                     '<td style=\"width:20%;border:1px solid #777;text-align: left;\"> %s </td>',
                     '<td style=\"width:20%;border:1px solid #777;text-align: left;\"> %s </td></tr>'
                    ].join(""),
    emailHTMLEnd:'</tbody></table>'
}
module.exports.DB=DB;
module.exports.server=server;
module.exports.email=emailSetting;

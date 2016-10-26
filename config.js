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
	emailSubject:"厚朴工作室到期图书提醒"

}
module.exports.DB=DB;
module.exports.server=server;
module.exports.email=emailSetting;

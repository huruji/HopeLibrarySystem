const mysql=require("mysql");
const config=require("./../config");

const DBConnection=mysql.createConnection({
	host:config.DB.host,
	user:config.DB.user,
	port:config.DB.port,
	password:config.DB.password,
	database:config.DB.database,
	multipleStatements:true
});
DBConnection.connect();

module.exports.DBConnection=DBConnection;
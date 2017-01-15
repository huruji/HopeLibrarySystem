const dbCommon = require('./db-common');
const mysqlUtil = require('./../router/mysql_util');
const connection = mysqlUtil.DBConnection;

const adminOperate = new dbCommon(connection, 'hopeadmin');
const userOperate = new dbCommon(connection, 'hopereader');

const adminDB = () => {
    this.selectMessage = (adminID,callback) => {
        adminOperate.selectAll((err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    };
    this.updateMessage = (adminID,setDataJson,callback) => {
        const searchDataJson = {
            adminID : adminID
        };
        adminOperate.updateItem(searchDataJson, setDataJson,(err, rows, fields) => {
            const message = queryResult(err, '修改成功')
            callback&&callback(message);
        })
    };
    this.resetPassword = (adminID, newPassword, callback) => {
        let searchDataJson = {
            adminID: amdinID
        };
        let setDataJson = {
            adminPassword: newPassword
        };
        adminOperate.updateItem(searchDataJson, setDataJson, (err, rows, fields) => {
            const message = queryResult(err, '修改成功');
            callback&&callback(message);
        });
    };
    this.addAdmin = (setDadaJson, callback) => {
        adminOperate.insertItem(setDadaJson, (err, rows, fields) => {
            const message = queryResult(err, '增加成功');
            callback&&callback(message);
        });
    };
};



const userDB = () =>{
    this.SelectMessage = (userID, callback) => {
        userOperate.selectAll((err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    };
    this.updateMessage = (userID, setDataJson, callback) => {
        const searchDataJson = {
            userID : userID
        };
        userOperate.updateItem(searchDataJson, setDataJson,(err, rows, fields) => {
            const message = queryResult(err, '修改成功')
            callback&&callback(message);
        });
    };
    this.resetPassword = (userID, newPassword, callback) => {
        let searchDataJson = {
            userID: userID
        };
        let setDataJson = {
            userPassword: newPassword
        };
        userOperate.updateItem(searchDataJson, setDataJson, (err, rows, fields) => {
            const message = queryResult(err, '修改成功');
            callback&&callback(message);
        });
    };
    this.addUser = (setDataJson, callback) => {
        userOperate.insertItem(setDadaJson, (err, rows, fields) => {
            const message = queryResult(err, '增加成功');
            callback&&callback(message);
        });
    };
};
function queryResult(err, message,callback) {
    if(err) {
        console.log(err);
        return;
    }
    let message ={
        message: message
    }
    callback&&callback();
    return message;
};
module.exports = {
    adminDB: adminDB,
    userDB: userDB
};
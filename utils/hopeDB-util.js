const dbCommon = require('./db-common');
const mysqlUtil = require('./../router/mysql_util');
const connection = mysqlUtil.DBConnection;

function hopeDB(operate, uniqueIDName){
    this.operate = operate;
    this.uniqueIDName = uniqueIDName
}
hopeDB.prototype.selectAll = function(callback) {
    this.operate.selectAll((err, rows, fields) => {
        if(err){
            console.log(err);
            return;
        }
        callback&&callback(rows);
    });
};
hopeDB.prototype.selectItem = function(dataJson, callback) {
    this.operate.selectItem(dataJson, (err, rows, fields) => {
        if(err) {
            console.log(err);
            retrun;
        }
        callback&&callback(rows);
    })
};
hopeDB.prototype.selectMessage = function(uniqueID, callback) {
    let uniqueIDName = this.uniqueIDName;
    let dataJson = {
        uniqueIDName: uniqueID
    };
    this.operate.selectItem(dataJson, (err, rows, fields) => {
        if(err) {
            console.log(err);
            return;
        }
        callback&&callback(rows);
    });
};
hopeDB.prototype.selectExceptID = function(uniqueID, callback){
    let uniqueIDName = this.uniqueIDName;
    let dataJson = {
        uniqueIDName: uniqueID
    };
    this.operate.selectExcept(dataJson, (err, rows, fields) => {
        if(err) {
            console.log(err);
            return;
        }
        callback&&callback(rows);
    });
};
hopeDB.prototype.updateMessage = function(uniqueID, setDataJson, callback, message = '修改成功'){
    let uniqueIDName = this.uniqueIDName;
    let dataJson = {
        uniqueIDName: uniqueID
    };
    this.operate.updateItem(searchDataJson, setDataJson,(err, rows, fields) => {
        const message = queryResult(err, message);
        callback&&callback(message);
    });
};


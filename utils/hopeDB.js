const dbCommon = require('./db-common');
const mysqlUtil = require('./../router/mysql_util');
const connection = mysqlUtil.DBConnection;

const adminOperate = new dbCommon.operate(connection, 'hopeadmin');
const userOperate = new dbCommon.operate(connection, 'hopereader');
const bookOperate = new dbCommon.operate(connection, 'hopebook');
const equipOperate = new dbCommon.operate(connection, 'hopeequip');
const borrowOperate = new dbCommon.operate(connection, 'bookBorrow');

const adminDB = {
    selectAll: (callback) => {
        adminOperate.selectAll((err, rows, fields) => {
            if(err){
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    selectItem: (dataJson, callback) => {
        adminOperate.selectItem(dataJson, (err, rows, fields) => {
            if(err) {
                console.log(err);
                retrun;
            }
            callback&&callback(rows);
        })
    },
    selectExceptID: (adminID, callback) => {
        let dataJson = {
            adminID: adminID
        }
        adminOperate.selectExcept(dataJson, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        })
    },
    selectMessage : (adminID,callback) => {
        let dataJson = {
            adminID: adminID
        }
        adminOperate.selectItem(dataJson, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    updateMessage: (adminID,setDataJson,callback) => {
        const searchDataJson = {
            adminID : adminID
        };
        adminOperate.updateItem(searchDataJson, setDataJson,(err, rows, fields) => {
            const message = queryResult(err, '修改成功')
            callback&&callback(message);
        })
    },
    resetPassword: (adminID, newPassword, callback) => {
        const searchDataJson = {
            adminID: adminID
        };
        const setDataJson = {
            adminPassword: newPassword
        };
        console.log('adminID' +adminID)
        adminOperate.updateItem(searchDataJson, setDataJson, (err, rows, fields) => {
            const message = queryResult(err, '修改成功');
            callback&&callback(message);
        });
    },
    addItem: (setDadaJson, callback) => {
        adminOperate.insertItem(setDadaJson, (err, rows, fields) => {
            const message = queryResult(err, '增加成功');
            callback&&callback(message);
        });
    },
    query: (query, callback) => {
        adminOperate.query(query, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    }
};
const userDB = {
    selectAll: (callback) => {
        userOperate.selectAll((err, rows, fields) => {
            if(err){
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    selectMessage: (userID, callback) => {
        let dataJson = {
            readerID : userID
        }
        userOperate.selectItem(dataJson,(err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    updateMessage: (userID, setDataJson, callback) => {
        const searchDataJson = {
            readerID : userID
        };
        userOperate.updateItem(searchDataJson, setDataJson,(err, rows, fields) => {
            const message = queryResult(err, '修改成功');
            callback&&callback(message);
        });
    },
    resetPassword: (userID, newPassword, callback) => {
        let searchDataJson = {
            readerID : userID
        };
        let setDataJson = {
            userPassword: newPassword
        };
        userOperate.updateItem(searchDataJson, setDataJson, (err, rows, fields) => {
            const message = queryResult(err, '修改成功');
            callback&&callback(message);
        });
    },
    addItem: (setDataJson, callback) => {
        userOperate.insertItem(setDataJson, (err, rows, fields) => {
            const message = queryResult(err, '增加成功');
            callback&&callback(message);
        });
    },
    query: (query, callback) => {
        userOperate.query(query, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    }
};
const bookDB ={
    selectAll: (callback) => {
        bookOperate.selectAll((err, rows, fields) => {
            if(err){
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    selectMessage: (bookID, callback) => {
        let dataJson = {
            bookID : bookID
        }
        bookOperate.selectItem(dataJson,(err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    updateMessage: (bookID, setDataJson, callback, message = '修改成功') => {
        const searchDataJson = {
            bookID : bookID
        };
        bookOperate.updateItem(searchDataJson, setDataJson,(err, rows, fields) => {
            message = queryResult(err, message);
            callback&&callback(message);
        });
    },
    addItem: (setDataJson, callback) => {
        bookOperate.insertItem(setDataJson, (err, rows, fields) => {
            const message = queryResult(err, '增加成功');
            callback&&callback(message);
        });
    },
    showColumns: (columnName, callback) => {
        bookOperate.showColumns(columnName, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    orderItems: (columnName, start, end, callback) => {
        bookOperate.orderItems(columnName, start, end, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        })
    },
    orderSearchItems: (searchDataJson, orderColumn, start, end, callback ) => {
        bookOperate.orderSearchItems(searchDataJson, orderColumn, start, end, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    countItems: (columnName, callback) => {
        bookOperate.countItems(columnName, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        })
    },
    countSearchItems: (searchDataJson, columnName, callback) => {
        bookOperate.countSearchItems(searchDataJson, columnName, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        })
    },
    query: (query, callback) => {
        bookOperate.query(query, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    }
};
const equipDB ={
    selectAll: (callback) => {
        equipOperate.selectAll((err, rows, fields) => {
            if(err){
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    selectItem: (dataJson, callback) => {
        equipOperate.selectItem(dataJson, (err, rows, fields) => {
            if(err) {
                console.log(err);
                retrun;
            }
            callback&&callback(rows);
        })
    },
    selectMessage: (equipID, callback) => {
        let dataJson = {
            equipID : equipID
        }
        equipOperate.selectItem(dataJson,(err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    updateMessage: (equipID, setDataJson, callback) => {
        const searchDataJson = {
            equipID : equipID
        };
        equipOperate.updateItem(searchDataJson, setDataJson,(err, rows, fields) => {
            const message = queryResult(err, '修改成功');
            callback&&callback(message);
        });
    },
    addItem: (setDataJson, callback) => {
        equipOperate.insertItem(setDataJson, (err, rows, fields) => {
            const message = queryResult(err, '增加成功');
            callback&&callback(message);
        });
    },
    orderItems: (columnName, start, end, callback) => {
        equipOperate.orderItems(columnName, start, end, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        })
    },
    orderSearchItems: (searchDataJson, orderColumn, start, end, callback ) => {
        equipOperate.orderSearchItems(searchDataJson, orderColumn, start, end, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    },
    query: (query, callback) => {
        equipOperate.query(query, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    }
};
const borrowDB = {
    addItem: (setDadaJson, callback) => {
        borrowOperate.insertItem(setDadaJson, (err, rows, fields) => {
            const message = queryResult(err, '增加成功');
            callback&&callback(message);
        });
    },
    query: (query, callback) => {
        borrowOperate.query(query, (err, rows, fields) => {
            if(err) {
                console.log(err);
                return;
            }
            callback&&callback(rows);
        });
    }
};

function queryResult(err, mes,callback) {
    if(err) {
        console.log(err);
        return;
    }
    const message ={
        message: mes
    };
    callback&&callback();
    return message;
}
module.exports = {
    adminDB: adminDB,
    userDB: userDB,
    bookDB: bookDB,
    equipDB: equipDB,
    borrowDB: borrowDB
};
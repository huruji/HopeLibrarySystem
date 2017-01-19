function operate( connect, table){
	this.table = table;
    this.connection = connect;
}
operate.prototype.createTable = function(callback){
	const action = 'CREATE TABLE IF NOT EXISTS ' + this.table;
    console.log('action:'+action);
	this.connection.query(action, callback);
};
operate.prototype.dropTable = function(callback){
	const action = 'DROP TABLE ' + this.table;
    console.log('action:'+action);
	this.connection.query(action, callback);
};
operate.prototype.insertItem = function(dataJson, callback) {
	const query = 'INSERT ' + this.table + ' SET ';
	let keyArray = [];
	for(let key in dataJson) {
		let keyString = key + '="' + dataJson[key] + '"';
		keyArray.push(keyString);
	}
	const action = query + keyArray.join();
	console.log('action:'+action);
	this.connection.query(action, callback);
};
operate.prototype.delAll = function(callback) {
	const action = 'DELETE FROM ' + this.table;
    console.log('action:'+action);
    this.connection.query(action,callback);
};
operate.prototype.delItem = function(dataJson, callback) {
	const query = 'DELETE FROM ' + this.table + ' WHERE ';
	let keyArray = [];
	for(let key in dataJson) {
		let keyString = key + '="' + dataJson[key] + '"';
		keyArray.push(keyString);
	}
	const action = query + keyArray.join(' AND ');
    console.log('action:'+action);
    this.connection.query(action, callback)
};
operate.prototype.selectAll = function(callback) {
	const action = 'SELECT * ' + 'FROM ' + this.table;
    console.log('action:'+action);
    this.connection.query(action, callback)
};
operate.prototype.selectExcept = function(dataJson, callback) {
	const query = 'SELECT * FROM ' + this.table + ' WHERE ';
    let keyArray = [];
    for(let key in dataJson) {
        let keyString = key + '!="' + dataJson[key] + '"';
        keyArray.push(keyString);
    }
    const action = query + keyArray.join(' AND ');
    console.log('action:'+action);
    this.connection.query(action, callback)
};
operate.prototype.selectItem = function(dataJson, callback) {
	const query = 'SELECT * FROM ' + this.table + ' WHERE ';
	let keyArray = [];
	for(let key in dataJson) {
		let keyString = key + '="' + dataJson[key] + '"';
		keyArray.push(keyString);
	}
	const action = query + keyArray.join(' AND ');
    console.log('action:'+action);
    this.connection.query(action, callback)
};
operate.prototype.updateAll = function(dataJson, callback){
	const query = 'UPDATE ' + this.table + ' SET ';
	let keyArray = [];
	for(let key in dataJson) {
		let keyString = key + '="' + dataJson[key] + '"';
		keyArray.push(keyString);
	}
	const action = query + keyArray.join();
    console.log('action:'+action);
    this.connection.query(action, callback)
};
operate.prototype.updateItem = function(searchDataJson, setDataJson, callback) {
	const query = 'UPDATE ' + this.table + ' SET ';
	let setKeyArray = [];
	let searchKeyArray = [];
	for(let key in setDataJson) {
		let keyString = key + '="' + setDataJson[key] + '"';
		setKeyArray.push(keyString);
	}
	for(let key in searchDataJson) {
		let keyString = key + '="' + searchDataJson[key] + '"';
		searchKeyArray.push(keyString);
	}
	const action = query + setKeyArray.join() + ' WHERE ' + searchKeyArray.join(' AND ');
	console.log('action:' + action);
    this.connection.query(action, callback);
};
operate.prototype.showColumns = function(columnName, callback) {
	let action;
	if(columnName) {
		action = 'SHOW COLUMNS FROM ' + this.table + ' LIKE "' + columnName + '"';
	} else{
		action = 'SHOW COLUMNS FROM ' + this.table;
	}
    console.log('action:'+action);
	this.connection.query(action, callback)
};
operate.prototype.orderItems = function(orderColumn, start, end, callback) {
    let action = 'SELECT * FROM ' + this.table + ' ORDER BY ' + orderColumn;
    if(start !== null && end !== null) {
        action = action + ' LIMIT ' + start + ',' + end;
    }
    console.log('action:'+action);
    this.connection.query(action, callback);
};
operate.prototype.orderSearchItems = function(searchDataJson, orderColumn, start, end, callback) {
    let searchKeyArray = [];
    let action = 'SELECT * FROM ' + this.table;
    if(searchDataJson) {
        for(let key in searchDataJson) {
            let keyString = key + '="' + searchDataJson[key] + '"';
            searchKeyArray.push(keyString);
        }
        action = action + ' WHERE ' + searchKeyArray.join(' AND ');
    }
    action = action + ' ORDER BY ' + orderColumn;
    if(start !== null && end !== null) {
        action = action + ' LIMIT ' + start + ',' + end;
    }
    console.log('action:'+action);
    this.connection.query(action, callback);
};
operate.prototype.countItems =function(columnName, callback) {
    const action = 'SELECT COUNT(*) AS ' + columnName +' FROM ' + this.table;
    console.log('action:'+action);
    this.connection.query(action, callback);
}
operate.prototype.query = function(query, callback) {
	const action = query;
    console.log('action:'+action);
	this.connection.query(action, callback);
}

module.exports.operate = operate;
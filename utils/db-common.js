const operate = (connection, table) => {
	this.createTable = (callback) => {
		const action = 'CREATE TABLE IF NOT EXISTS ' + table;
		connection.query(action, callback);
	};
	this.dropTable = (callback) => {
		const action = 'DROP TABLE ' + table;
		connection.query(action, callback);
	};
	this.insertItem = (dataJson, callback)  => {
		const query = 'INSERT ' + table + ' SET ';
		let keyArray = [];
		for(let key in dataJson) {
			let keyString = key + '=' + dataJson[key];
			keyArray.push(keyString);
		}
		const action = query + keyArray.join();
		connection.query(action, callback);
	};
	this.delAll = (callback) => {
		const action = 'DELETE FROM ' + table;
		connection.query(action,callback);
	}
	this.delItem = (dataJson, callback) => {
		const query = 'DELETE FROM ' + table + ' WHERE ';
		let keyArray = [];
		for(let key in dataJson) {
			let keyString = key + '=' + dataJson[key];
			keyArray.push(keyString);
		}
		const action = query + keyArray.join(' AND ');
		connection.query(action, callback)
	};
	this.selectALL = (callback) => {
		const action = 'SELECT * ' + 'FROM ' + table;
		connection.query(action, callback)
	};
	this.selectItem = (dataJson, callback) => {
		const query = 'SELECT * FROM ' + table + ' WHERE ';
		let keyArray = [];
		for(let key in dataJson) {
			let keyString = key + '=' + dataJson[key];
			keyArray.push(keyString);
		}
		const action = query + keyArray.join(' AND ');
		connection.query(action, callback)
	};
	this.updateAll = (dataJson, callback) => {
		const query = 'UPDATE ' + table + ' SET ';
		let keyArray = [];
		for(let key in dataJson) {
			let keyString = key + '=' + dataJson[key];
			keyArray.push(keyString);
		}
		const action = query + keyArray.join();
		connection.query(action, callback)
	};
	this.updateItem = (searchDataJson, setDataJson, callback) => {
		const query = 'UPDATE ' + table + ' SET ';
		let setKeyArray = [];
		let searchArray = [];
		for(let key in setDataJson) {
			let keyString = key + '=' + dataJson[key];
			setKeyArray.push(keyString);
		}
		for(let key in searchDataJson) {
			let keyString = key + '=' + dataJson[key];
			searchKeyArray.push(keyString);
		}
		const action = query + setKeyArray.join() + ' WHERE ' + searchArray.join();
		connection.query(action, callback);
	}
}

module.exports = operate;
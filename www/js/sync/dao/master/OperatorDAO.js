define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var OperatorDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.OPERATOR;
		this.columns = {
			userid: { type: TYPE.TEXT, notNull: true, pk: true },
			username: { type: TYPE.TEXT },
			name: { type: TYPE.TEXT },
			password: { type: TYPE.TEXT },
			isdelete: { type: TYPE.BOOLEAN },
			uoid: { type: TYPE.TEXT }
		};
	};

	_.extend(OperatorDAO.prototype, {

		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},
		_setId: function(data){
			var dataparse = data,
			userid = data.operatorid;
			_.extend(dataparse, { userid : userid });
			dataparse = _.omit(dataparse, "operatorid");
			return dataparse;
		},
		execOperation: function(tx, operation, data){
			switch(operation){
				case 'ADD':
					this.insertSyncData(tx, data);
					break;
				case 'DELETE':
					this.deleteRow(tx, data);
					break;
				case 'UPDATE':
					this.updateSyncData(tx, data);
					break;
				default:
					break;
			}
		},
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, orderBy: ['name'] }, callbacks);
		},
		find:function (model, callbacks) {
			new sqlUtils().globalFind({ db: this.db, tableName: this.tableName, whereCond: " userid=? ", whereValues: [model.id] }, callbacks);
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		deleteRow: function (tx, data){
			data = this._setId(data);
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "userid=?", whereValues: [data.userid]});
		},
		insertSyncData: function(tx, operator){
			sqlU = new sqlUtils();
			operator = this._setId(operator);

			sqlU.insertOrIgnoreRow(tx, this.tableName, operator);
		},
		updateSyncData: function (tx, operator) {
			operator = this._setId(operator);
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: operator, whereCond: " userid=? ", whereValues: [operator.userid] });
		}
	});
	return OperatorDAO;
});
define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var OperatorTaskDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.OPERATORTASK;
		this.columns = {
			operatortaskid: { type: TYPE.INT, notNull: true, pk: true },
			userid: { type: TYPE.TEXT }, /*, notNull: true, fk: {table: TABLEDB.OPERATOR, columns: 'userid'}},*/
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid' }},
			adddate: { type: TYPE.DATE }
		};
	};

	_.extend(OperatorTaskDAO.prototype, {
	// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},
		_getDataUserId: function(data){
			//rebem id.operatorid -> hem de passar el valor a userid
			var dataparse = data,
			uid= data.id.operatorid;
			_.extend(dataparse, {userid : uid});
			dataparse = _.omit(dataparse, "id");
			return dataparse;
		},
		saveData: function (tx, operatorTask, taskid) {
			sqlU = new sqlUtils();
			// inserir nuevos operarios
			var self = this;
			//netegem el que hi havia abans
			sqlU.deleteRows(tx, {tableName: self.tableName, whereCond: " taskid=? ", whereValues: [taskid] });

            operatorTask.each(function(operator) {
                data = _.omit(operator.toJSON(), "operatortaskid");
                data = self._getDataUserId(data);
                sqlU.insertRow(tx, self.tableName, data);
            });

		},
		findByTask:function (taskid, callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " taskid=? ", whereValues: [taskid] }, callbacks);
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		deleteRowByTask: function(tx, taskID){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [taskID]});
		}
	});
return OperatorTaskDAO;
});
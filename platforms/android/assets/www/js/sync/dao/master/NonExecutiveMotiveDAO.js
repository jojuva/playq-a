define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var NonExecutiveMotiveDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.NONEXECUTIVEMOTIVE;
		this.columns = {
			nonexecutivemotiveid: { type: TYPE.TEXT, notNull: true, pk: true },
			nonexecutivemotivedescription: { type: TYPE.TEXT },
			isdelete: { type: TYPE.BOOLEAN }
		};
	};

	_.extend(NonExecutiveMotiveDAO.prototype, {

		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
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
		deleteRow: function (tx, data){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "nonexecutivemotiveid=?", whereValues: [data.nonexecutivemotiveid]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, nonExecMotive) {
			sqlU = new sqlUtils();
			sqlU.insertOrIgnoreRow(tx, this.tableName, nonExecMotive);
		},
		updateSyncData: function (tx, nonExecMotive) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: nonExecMotive, whereCond: " nonexecutivemotiveid=? ", whereValues: [nonExecMotive.nonexecutivemotiveid] });
		}
	});
	return NonExecutiveMotiveDAO;
});
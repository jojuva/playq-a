define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var FailureTypeDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.FAILURETYPE;
		this.columns = {
			failuretypeid: { type: TYPE.TEXT, pk: true },
			description: { type: TYPE.TEXT }
		};
	};

	_.extend(FailureTypeDAO.prototype, {

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
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, orderBy: ['description'] }, callbacks);
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		deleteRow: function (tx, data){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "failuretypeid=?", whereValues: [data.failuretypeid]});
		},
		insertSyncData: function (tx, gauge) {
			sqlU = new sqlUtils();
			sqlU.insertOrIgnoreRow (tx, this.tableName, gauge);
		},
		updateSyncData: function (tx, gauge) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: gauge, whereCond: " failuretypeid=? ", whereValues: [gauge.failuretypeid] });
		}
	});
	return FailureTypeDAO;
});
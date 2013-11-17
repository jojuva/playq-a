define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TimeSheetHourTypeDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TIMESHEETHOURTYPE;
		this.columns = {
			id: { type: TYPE.INT, notNull: true, pk: true },
			description: { type: TYPE.TEXT },
			productive: { type: TYPE.BOOLEAN },
			normal: { type: TYPE.BOOLEAN }
		};
	};

	_.extend(TimeSheetHourTypeDAO.prototype, {
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
		deleteRow: function (tx, data){
			//new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "=?", whereValues: [data.]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, timesheethourtype) {
			var timesheethourtype_in = _.pick(timesheethourtype, _.keys(this.columns));
			new sqlUtils().insertOrIgnoreRow (tx, this.tableName, timesheethourtype_in);
		},
		updateSyncData: function (tx, timesheethourtype) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: timesheethourtype, whereCond: " id=? ", whereValues: [timesheethourtype.id] });
		}
	});
	return TimeSheetHourTypeDAO;
});
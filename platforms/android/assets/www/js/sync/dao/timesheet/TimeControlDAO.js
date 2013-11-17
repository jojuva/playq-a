define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TimeControlDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TIMECONTROL;
		this.columns = {
			timecontrolid: { type: TYPE.INT, notNull: true, pk: true },
			datetimeinitialworkday: { type: TYPE.DATE },
			technicaloperatorid: { type: TYPE.TEXT },
			normalhours: { type: TYPE.INT },
			extrahours: { type: TYPE.INT },
			guardhours: { type: TYPE.INT },
			retention: { type: TYPE.INT },
			diets: { type: TYPE.INT },
			diet: { type: TYPE.FLOAT },
			fromtime: { type: TYPE.INT },
			untiltime: { type: TYPE.INT }
		};
	};

	_.extend(TimeControlDAO.prototype, {
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
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},
		deleteRow: function (tx, data){
			//new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "=?", whereValues: [data.]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, timecontrol) {
			sqlU = new sqlUtils();
			sqlU.insertOrIgnoreRow (tx, this.tableName, timecontrol);
		},
		updateSyncData: function (tx, timecontrol) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: timecontrol, whereCond: " datetimeinitialworkday=? AND technicaloperatorid =?", whereValues: [timecontrol.datetimeinitialworkday, timecontrol.technicaloperatorid] });
		}
	});
	return TimeControlDAO;
});
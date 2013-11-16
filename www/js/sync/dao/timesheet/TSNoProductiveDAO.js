define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TSNoProductiveDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TIMESHEETNOPRODUCTIVETIME;
		this.columns = {
			tsnoproductiveid: { type: TYPE.INT, notNull: true, pk: true },
			date: { type: TYPE.TEXT },
			technicalOperatorId: { type: TYPE.INT },
			hourTypeForOpUnitId: { type: TYPE.INT },
			startDate: { type: TYPE.TEXT },
			endDate: { type: TYPE.TEXT }
		};
	};

	_.extend(TSNoProductiveDAO.prototype, {
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
		findByTimeSheet: function(timesheet, callbacks){
				var date = timesheet.get('date'),
					user = timesheet.get('technicalOperatorId');

			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " date=? AND technicalOperatorId=?", whereValues: [date, user] }, callbacks);
		},
		deleteRow: function (tx, data){
			//new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "=?", whereValues: [data.]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		updateSyncData: function (tx, tsnoproductive) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: tsnoproductive, whereCond: " userid=? AND timesheetdate=? ", whereValues: [tsnoproductive.userid, tsnoproductive.timesheetdate] });
		},
		insertSyncData: function (tx, noprod) {
			var noprod_in = _.pick(noprod, _.keys(this.columns));
			new sqlUtils().insertOrIgnoreRow (tx, this.tableName, noprod_in);
		},
		deleteData: function(tx, dateTS, userid){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "date=? AND technicalOperatorId=?", whereValues: [dateTS, userid]});
		},
		saveData: function (tx, noprods, dateTS, userid) {
			sqlU = new sqlUtils();
			// update dels contadors
			var self = this,
				data, data_in;
			noprods.each(function(noprod) {
				data = noprod.toJSON();
				data = _.extend(data, { date : dateTS,  technicalOperatorId: userid } );
				data_in = _.pick(_.omit(data,'tsnoproductiveid'), _.keys(self.columns));

				sqlU.insertOrIgnoreRow (tx, self.tableName, data_in);
			});
		}
	});
	return TSNoProductiveDAO;
});
define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TimeSheetDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TIMESHEET;
		this.columns = {
			timesheetid: { type: TYPE.INT, notNull: true, pk: true },
			technicalOperatorId: { type: TYPE.INT },
			date: { type: TYPE.TEXT },
			operatorUnitId: { type: TYPE.INT },
			workDateTypeForOUId: { type: TYPE.INT },
			vehicleRegistration: { type: TYPE.TEXT },
			observation: { type: TYPE.TEXT },
			expenses: { type: TYPE.FLOAT },
			status: { type: TYPE.INT, notNull: false, fk: {table: TABLEDB.TIMESHEETSTATUS, columns: 'tsstatusid' }}
		};
	};

	_.extend(TimeSheetDAO.prototype, {
	// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
			//sqlU.insertOrIgnoreRow (tx, this.tableName, {timesheetid:1, userid:"1", timesheetdate:"20130620", status:1, timesheetworkdatetypeid:4});
			//sqlU.insertOrIgnoreRow (tx, this.tableName, {timesheetid:2, userid:"1", timesheetdate:"20130621", status:0, diet:"576.45", timesheetworkdatetypeid:4});
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
		saveData: function (tx, timesheet) {
			var data = timesheet.toJSON();
			data = _.omit(data, "timesheetid", 'technicalOperatorId', 'date', 'operatorUnitId', 'workDateTypeForOUId', 'vehicleRegistration');
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: data, whereCond: " timesheetid=? ", whereValues: [timesheet.id] });
		},
		find:function (model, callbacks) {
			new sqlUtils().globalFind({ db: this.db, tableName: this.tableName, whereCond: " timesheetid=? ", whereValues: [model.id] }, callbacks);
		},
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},
		findFinalized: function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " status=? ", whereValues: [TIMESHEETSTATUS.FINALIZADO]}, callbacks);
		},
		deleteRow: function (tx, data){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "timesheetid=?", whereValues: [data.get('timesheetid')]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		updateSyncData: function (tx, timesheet) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: timesheet, whereCond: " userid=? AND timesheetdate=? ", whereValues: [timesheet.userid, timesheet.timesheetdate] });
		},
		insertSyncData: function (tx, chargeTM) {
			var timesheet_in,
				date,
				technicalOperatorId;

			sqlU = new sqlUtils();
			timesheet_in = _.pick(chargeTM, _.keys(this.columns));
			if(_.isNull(timesheet_in.status) || _.isUndefined(timesheet_in.status)){
				timesheet_in.status = 0;
			}
			sqlU.insertOrIgnoreRow (tx, this.tableName, timesheet_in);
		}
	});
	return TimeSheetDAO;
});
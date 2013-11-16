define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TSResourceDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TIMESHEETRESOURCE;
		this.columns = {
			tsresourceid: { type: TYPE.INT, notNull: true, pk: true },
			resourceId: { type: TYPE.INT },
			date: { type: TYPE.TEXT },
			technicalOperatorId: { type: TYPE.INT },
			usage: { type: TYPE.INT },
			taskId: { type: TYPE.INT }
		};
	};

	_.extend(TSResourceDAO.prototype, {
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
		/*findByTimeSheet: function(data, callbacks){
			var tsdate = data.get('date'),
				taskid = data.get('taskId');
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " date=? AND taskId = ?", whereValues: [tsdate, taskid] }, callbacks);
		},*/
		findByTask: function(taskId, date, callbacks){
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " date=? AND taskId=?", whereValues: [date, taskId] }, callbacks);
		},
		deleteRow: function (tx, data){
			//new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "=?", whereValues: [data.]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		updateSyncData: function (tx, tsresource) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: tsresource, whereCond: " taskId=? AND date=? ", whereValues: [tsresource.taskId, tsresource.date] });
		},
		insertSyncData: function (tx, resource) {
			var resource_in = _.pick(resource, _.keys(this.columns));
			new sqlUtils().insertOrIgnoreRow (tx, this.tableName, resource_in);
		},
		deleteData: function(tx, dateTS, taskid, userid){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "date=? AND taskId=? AND technicalOperatorId=?", whereValues: [dateTS, taskid, userid]});
		},
		saveData: function (tx, resources, dateTS, userid) {
			sqlU = new sqlUtils();
			// update dels contadors
			var self = this,
				data, data_in;
			resources.each(function(resou) {
				data = resou.toJSON();
				data = _.extend(data, { date : dateTS, technicalOperatorId: userid } );
				data_in = _.pick(_.omit(data,'tsresourceid'), _.keys(self.columns));

				sqlU.insertOrIgnoreRow (tx, self.tableName, data_in);
			});
		}
	});
	return TSResourceDAO;
});
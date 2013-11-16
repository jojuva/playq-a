define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TSProductiveDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TIMESHEETPRODUCTIVETIME;
		this.columns = {
			tsproductiveid: { type: TYPE.INT, notNull: true, pk: true },
			taskId: { type: TYPE.INT },
			date: { type: TYPE.TEXT },
			hourTypeForOpUnitId: { type: TYPE.INT },
			technicalOperatorId: { type: TYPE.INT },
			startDate: { type: TYPE.TEXT },
			endDate: { type: TYPE.TEXT }
		};
	};

	_.extend(TSProductiveDAO.prototype, {
	// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
			//TODO borrar quan es rebi per syncro
			//sqlU.insertOrIgnoreRow (tx, this.tableName, {tsproductiveid:1, userid:"1", timesheetdate:"20130620", productivetimetype:4, init:"20130620090000", end:"20130620120000"});
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
			var tsdate = data.get('timesheetdate'),
				userid = data.get('userid');
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " timesheetdate=? AND userid=?", whereValues: [tsdate, userid] }, callbacks);
		},*/
		findByTask: function(taskId, date, callbacks){
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " date=? AND taskId=?", whereValues: [date, taskId] }, callbacks);
		},
		findByHour: function(hourId, date, userId,  callbacks){
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " date=? AND technicalOperatorId=? AND hourTypeForOpUnitId=?", whereValues: [date, userId, hourId] }, callbacks);
		},
		deleteRow: function (tx, data){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "tsproductiveid=?", whereValues: [data.tsproductiveid]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		updateSyncData: function (tx, tsproductive) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: tsproductive, whereCond: " taskId=? AND date=? ", whereValues: [tsproductive.taskId, tsproductive.date] });
		},
		insertSyncData: function (tx, presence) {
			var presence_in = _.pick(presence, _.keys(this.columns));
			new sqlUtils().insertOrIgnoreRow (tx, this.tableName, presence_in);
		},
		deleteData: function(tx, dateTS, taskid, userid){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "date=? AND taskId=? AND technicalOperatorId=?", whereValues: [dateTS, taskid, userid]});
		},
		saveData: function (tx, prods, dateTS, userid) {
			sqlU = new sqlUtils();
			// update dels contadors
			var self = this,
				data, data_in;
			prods.each(function(prod) {
				data = prod.toJSON();
				data = _.extend(data, { date : dateTS,  technicalOperatorId: userid } );
				data_in = _.pick(_.omit(data,'tsproductiveid'), _.keys(self.columns));

				sqlU.insertOrIgnoreRow (tx, self.tableName, data_in);
			});
		}
	});
	return TSProductiveDAO;
});
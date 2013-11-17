define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TSTaskDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TIMESHEETTASK;
		this.columns = {
			tstaskid: { type: TYPE.INT, notNull: true, pk: true },
			taskDescription: { type: TYPE.TEXT },
			technicalOperatorId: { type: TYPE.INT },
			date: { type: TYPE.TEXT },
			taskId: { type: TYPE.INT },
			accountCode: { type: TYPE.TEXT },
			realAddress: { type: TYPE.TEXT },
			asbestosCuts: { type: TYPE.INT },
			asbestosDuration: { type: TYPE.INT },
			asbestosExposition: { type: TYPE.INT },
			confinedSpaces: { type: TYPE.BOOLEAN }
		};
	};

	_.extend(TSTaskDAO.prototype, {
	// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
			//TODO borrar quan es rebi per syncro
			//sqlU.insertOrIgnoreRow (tx, this.tableName, {tstaskid:1, userid:"1", timesheetdate:"20130620", descriptiontask: "Averia_2", taskid:"4", failures:0, failurestime:"20130620000000", expositiontime: "20130620000000", confinedspace:false, accountcode:"20130", realaddress:"Llacuna 67"});
			//sqlU.insertOrIgnoreRow (tx, this.tableName, {tstaskid:2, userid:"1", timesheetdate:"20130620", descriptiontask: "Averia_3", taskid:"5", failures:0, failurestime:"20130620000000", expositiontime: "20130620000000", confinedspace:false, accountcode:"20140", realaddress: "Pere IV 34"});
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
		findByTimeSheet: function(data, callbacks){
			var tsdate = data.get('date'),
				userid = data.get('technicalOperatorId');
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " date=? AND technicalOperatorId=?", whereValues: [tsdate, userid] }, callbacks);
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
		updateSyncData: function (tx, tstask) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: tstask, whereCond: " technicalOperatorId=? AND date=? ", whereValues: [tstask.userid, tstask.timesheetdate] });
		},
		insertSyncData: function (tx,  tstask) {
			var tstask_in = _.pick(tstask, _.keys(this.columns));
			new sqlUtils().insertOrIgnoreRow (tx, this.tableName, tstask_in);
		},
		deleteData: function(tx, dateTS, userid){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "date=? AND technicalOperatorId=?", whereValues: [dateTS, userid]});
		},
		saveData: function (tx, tstasks, dateTS, userid, TSProductiveDAO, TSResourceDAO) {
			sqlU = new sqlUtils();
			// update dels contadors
			var self = this,
				data, data_in;
			tstasks.each(function(tstask) {
				data = tstask.toJSON();
				data = _.extend(data, { date : dateTS,  technicalOperatorId: userid } );
				data_in = _.pick(_.omit(data,'tstaskid', 'tsresource', 'tsproductivetime'), _.keys(self.columns));
				data_in.asbestosCuts = parseInt(data_in.asbestosCuts, 10);
				data_in.asbestosDuration = parseInt(data_in.asbestosDuration, 10);
				data_in.asbestosExposition = parseInt(data_in.asbestosExposition, 10);

				sqlU.insertOrIgnoreRow (tx, self.tableName, data_in);

				//delets de les collection internes d tstask: resource i productive
				TSProductiveDAO.deleteData(tx, dateTS, tstask.get('taskId'), userid);
				TSResourceDAO.deleteData(tx, dateTS, tstask.get('taskId'), userid);
				TSProductiveDAO.saveData(tx, tstask.get('tsproductivetime'), dateTS, userid);
				TSResourceDAO.saveData(tx, tstask.get('tsresource'), dateTS, userid);
			});
		}
	});
	return TSTaskDAO;
});
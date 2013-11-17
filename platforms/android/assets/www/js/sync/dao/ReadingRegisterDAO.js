define(['underscore', 'sqlUtils', 'moment'], function(_, sqlUtils, moment){
	var ReadingRegisterDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.READINGREGISTER;
		this.columns = {
			readingregisterid : { type: TYPE.INT, notNull: true, pk: true },
			yearperiod: { type: TYPE.TEXT },
			readingdate: { type: TYPE.DATE },
			register: { type: TYPE.INT },
			consumed: { type: TYPE.FLOAT },
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid'}}
		};
	};

	_.extend(ReadingRegisterDAO.prototype, {
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},
		findByTask:function (taskid, callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " taskid=? ", whereValues: [taskid] }, callbacks);
		},
		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},
		// custom methods
		execOperation: function(tx, operation, data, taskID){
			switch(operation){
				case 'ADD':
					this.deleteRowByTask(tx, taskID); // temporal
					this.insertSyncData(tx, data, taskID);
					break;
				case 'DELETE':
					this.deleteRowByTask(tx, taskID);
					break;
				default:
					break;
			}
		},
		deleteRow: function(tx, taskID){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [taskID]});
		},
		deleteRowByTask: function(tx, taskID){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [taskID]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, readingRegister, taskID) {
			sqlU = new sqlUtils();
			var readreg_in;
			_.each(readingRegister, function(readreg) {
				readreg = _.extend(readreg, { taskid : taskID });
				readreg_in = _.pick(readreg, _.keys(this.columns));
				if(!_.isNull(readreg_in.register))
					readreg_in.register = parseInt(readreg_in.register, 10);
				if(!_.isNull(readreg_in.consumed))
					readreg_in.consumed = parseFloat(readreg_in.consumed);
				if(!_.isNull(readreg_in.readingdate))
					readreg_in.readingdate = new moment(readreg_in.readingdate).format("YYYY-MM-DDTHH:mm:ss");
				sqlU.insertOrIgnoreRow (tx, this.tableName, readreg_in);
			}, this);
		}
	});
	return ReadingRegisterDAO;
});
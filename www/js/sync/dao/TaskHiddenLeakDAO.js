define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TaskHiddenLeakDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TASKHIDDENLEAK;
		this.columns = {
			taskhiddenleakid: { type: TYPE.INT, notNull: true, pk: true },
			totalleaks: { type: TYPE.INT },
			distance: { type: TYPE.FLOAT },
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid'}}
		};
	};

	_.extend(TaskHiddenLeakDAO.prototype, {
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
		insertSyncData: function (tx, taskHiddenLeak, taskID) {
			var taskHiddenLeak_in;
			if(!_.isNull(taskHiddenLeak)){
				taskHiddenLeak = _.extend(taskHiddenLeak, { taskid : taskID });
				taskHiddenLeak_in = _.pick(taskHiddenLeak, _.keys(this.columns));
				if(!_.isNull(taskHiddenLeak_in.totalleaks))
					taskHiddenLeak_in.totalleaks = parseInt(taskHiddenLeak_in.totalleaks, 10);
				
				if(!_.isNull(taskHiddenLeak_in.distance)){
					taskHiddenLeak_in.distance = parseFloat(taskHiddenLeak_in.distance);
				}
				new sqlUtils().insertOrIgnoreRow (tx, this.tableName, taskHiddenLeak_in);
			}
		}
	});
	return TaskHiddenLeakDAO;
});
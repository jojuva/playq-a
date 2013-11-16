define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TaskCommercialDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TASKCOMMERCIAL;
		this.columns = {
			taskcommercialid: { type: TYPE.INT, notNull: true, pk: true },
			reclaimedbill: { type: TYPE.INT },
			customertotaldebt: { type: TYPE.FLOAT }, /*four decimals number*/
			amountreplacementsupply: { type: TYPE.FLOAT }, /* four decimals number*/
			amountgiventoaccount: { type: TYPE.FLOAT }, /*four decimals number*/
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid'}}
		};
	};

	_.extend(TaskCommercialDAO.prototype, {
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
		insertSyncData: function (tx, taskCommercial, taskID) {
			sqlU = new sqlUtils();
			var taskCommeracial_in;
				if(!_.isNull(taskCommercial)){
				taskCommercial = _.extend(taskCommercial, { taskid : taskID });
				taskCommercial_in = _.pick(taskCommercial, _.keys(this.columns));
				if(!_.isNull(taskCommercial_in.reclaimedbill))
					taskCommercial_in.reclaimedbill = parseInt(taskCommercial_in.reclaimedbill, 10);
				if(!_.isNull(taskCommercial_in.customertotaldebt)){
					taskCommercial_in.customertotaldebt = parseFloat(taskCommercial_in.customertotaldebt);
				}
				if(!_.isNull(taskCommercial_in.amountreplacementsupply)){
					taskCommercial_in.amountreplacementsupply = parseFloat(taskCommercial_in.amountreplacementsupply);
				}
				if(!_.isNull(taskCommercial_in.amountgiventoaccount))
					taskCommercial_in.amountgiventoaccount = parseFloat(taskCommercial_in.amountgiventoaccount);
				sqlU.insertOrIgnoreRow (tx, this.tableName, taskCommercial_in);
			}
		}
	});
	return TaskCommercialDAO;
});
define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TaskHydraulicDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TASKHYDRAULIC;
		this.columns = {
			TaskHydraulicID : { type: TYPE.INT, notNull: true, pk: true },
			InitialDateHydraulic: { type: TYPE.DATE },
			FinalDateHydraulic: { type: TYPE.DATE },
			ChlorineTest: { type: TYPE.FLOAT },
			HydraulicComments: { type: TYPE.TEXT },
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid'}}
		};
	};

	_.extend(TaskHydraulicDAO.prototype, {
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},
		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},
		execOperation: function(tx, operation, data, taskID){
			switch(operation){
				case 'ADD':
					this.deleteRow(tx, taskID); // temporal
					this.insertSyncData(tx, data, taskID);
					break;
				case 'DELETE':
					this.deleteRow(tx, taskID);
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
		insertSyncData: function (tx, taskHydraulic, taskID) {
			sqlU = new sqlUtils();

			taskHydraulic.ChlorineTest = parseFloat(taskHydraulic.ChlorineTest);
			sqlU.insertOrIgnoreRow (tx, this.tableName, _.extend(taskHydraulic, { taskid : taskID }));
		}
	});
	return TaskHydraulicDAO;
});
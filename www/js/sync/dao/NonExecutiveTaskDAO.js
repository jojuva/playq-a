define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var NonExecutiveTaskDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.NONEXECUTIVETASK;
		this.columns = {
			nonexecutiontaskid: { type: TYPE.INT, notNull: true, pk: true },
			id: { type: TYPE.TEXT },/*, notNull: true, fk: {table: TABLEDB.NONEXECUTIVEMOTIVE, columns: 'nonexecutivemotiveid'} },*/
			taskid : { type: TYPE.TEXT, notNull: true, fk: { table: TABLEDB.TASK, columns: 'taskid'}},
			nonexecutionmotivedescription : { type: TYPE.TEXT }
		};
	};

	_.extend(NonExecutiveTaskDAO.prototype, {

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
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, nonExecutiveData, taskID) {
			sqlU = new sqlUtils();
			var nonExecutive_in;
			_.each(nonExecutiveData, function(nonExecutive) {
				nonExecutive = _.extend(nonExecutive, { taskid : taskID });
				nonExecutive_in = _.pick(nonExecutive, _.keys(this.columns));
				sqlU.insertOrIgnoreRow (tx, this.tableName, nonExecutive_in);
			}, this);
		},
		deleteRow: function(tx, taskID){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [taskID]});
		},
		deleteRowByTask: function(tx, taskID){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [taskID]});
		},
		findByTaskJoinMotive: function (taskID, callbacks){
			var whereValues = [],
            whereCond = [];

			whereCond = " net.taskid=? ";
			whereValues = taskID;

			new sqlUtils().globalFindAllJoin({
				db: this.db,
				tableName: TABLEDB.NONEXECUTIVETASK + " as net ",
				joinTableName: TABLEDB.NONEXECUTIVEMOTIVE + " as nem ",
				columns: ["net.nonexecutiontaskid as nonexecutiontaskid, net.id as nonexecutionmtiveid", "net.taskid as taskid", "nem.nonexecutivemotivedescription as nonexecutionmotivedescription"],
				whereCond: whereCond,
				whereValues: whereValues,
				onCond: " net.id = nem.nonexecutivemotiveid",
				orderBy: ["nem.nonexecutivemotivedescription"]//,
				//onValues: []
			}, callbacks);
		}
	});
	return NonExecutiveTaskDAO;
});
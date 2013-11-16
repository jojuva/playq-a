define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TaskStatusDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TASKSTATUS;
		this.columns = {
			StatusID: { type: TYPE.TEXT, notNull: true, pk: true },
			Value : { type: TYPE.TEXT }
		};
	};

	_.extend(TaskStatusDAO.prototype, {

		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
			sqlU.insertOrIgnoreRow (tx, this.tableName, {StatusID: TASKSTATUS.PENDIENTE, value:'Pendiente'});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {StatusID: TASKSTATUS.EXECUTIVE, value:'Executive'});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {StatusID: TASKSTATUS.NONEXECUTIVE, value:'NonExecutive'});
		}
	});
	return TaskStatusDAO;
});
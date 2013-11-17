define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TaskStatusSyncDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TASKSTATUSSYNC;
		this.columns = {
			StatusID: { type: TYPE.TEXT, notNull: true, pk: true },
			Value : { type: TYPE.TEXT }
		};
	};

	_.extend(TaskStatusSyncDAO.prototype, {

		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
			sqlU.insertOrIgnoreRow (tx, this.tableName, {StatusID: TASKSTATUSSYNC.PENDIENTE, value:'Pendiente'});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {StatusID: TASKSTATUSSYNC.GUARDADA, value:'Guardada'});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {StatusID: TASKSTATUSSYNC.FINALIZADA, value:'Finalizada'});
		}
	});
	return TaskStatusSyncDAO;
});
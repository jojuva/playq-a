define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TimeSheetStatusDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TIMESHEETSTATUS;
		this.columns = {
			id: { type: TYPE.INT, notNull: true, pk: true },
			value : { type: TYPE.TEXT }
		};
	};

	_.extend(TimeSheetStatusDAO.prototype, {

		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
			sqlU.insertOrIgnoreRow (tx, this.tableName, {id: parseInt(TIMESHEETSTATUS.ABIERTO, 10), value:'Abierto'});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {id: parseInt(TIMESHEETSTATUS.FINALIZADO, 10), value:'Finalizado'});
			}
	});
	return TimeSheetStatusDAO;
});
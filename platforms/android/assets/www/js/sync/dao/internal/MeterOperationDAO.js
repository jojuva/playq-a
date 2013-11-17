define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var MeterOperationDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.METEROPERATION;
		this.columns = {
			MeterOperationID: { type: TYPE.INT, notNull: true, pk: true },
			Value : { type: TYPE.TEXT }
		};
	};

	_.extend(MeterOperationDAO.prototype, {

		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
			sqlU.insertOrIgnoreRow (tx, this.tableName, {MeterOperationID: parseInt(METEROPERATION.RETIRAR, 10), value:'Retirar'});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {MeterOperationID: parseInt(METEROPERATION.INSTALAR, 10), value:'Instalar'});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {MeterOperationID: parseInt(METEROPERATION.REVISAR, 10), value:'Revisar'});
		}
	});
	return MeterOperationDAO;
});
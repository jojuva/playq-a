define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var GaugeDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.GAUGE;
		this.columns = {
			gaugeid: { type: TYPE.TEXT, notNull: true, pk: true },
			gaugevalue: { type: TYPE.FLOAT },
			isdelete: { type: TYPE.BOOLEAN }
		};
	};

	_.extend(GaugeDAO.prototype, {

		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
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
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, orderBy: ['gaugevalue'] }, callbacks);
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		deleteRow: function (tx, data){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "gaugeid=?", whereValues: [data.gaugeid]});
		},
		insertSyncData: function (tx, gauge) {
			sqlU = new sqlUtils();
			sqlU.insertOrIgnoreRow (tx, this.tableName, gauge);
		},
		updateSyncData: function (tx, gauge) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: gauge, whereCond: " gaugeid=? ", whereValues: [gauge.gaugeid] });
		}
	});
	return GaugeDAO;
});
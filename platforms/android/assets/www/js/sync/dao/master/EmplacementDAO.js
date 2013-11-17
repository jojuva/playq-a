define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var EmplacementDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.EMPLACEMENT;
		this.columns = {
			emplacementcode: { type: TYPE.TEXT, notNull: true, pk: true },
			emplacementdescription: { type: TYPE.TEXT },
			isdelete: { type: TYPE.BOOLEAN }
		};
	};

	_.extend(EmplacementDAO.prototype, {
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
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, orderBy: ['emplacementdescription'] }, callbacks);
		},
		deleteRow: function (tx, data){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "emplacementcode=?", whereValues: [data.emplacementcode]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, emplacement) {
			sqlU = new sqlUtils();
			sqlU.insertOrIgnoreRow (tx, this.tableName, emplacement);
		},
		updateSyncData: function (tx, emplacement) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: emplacement, whereCond: " emplacementcode=? ", whereValues: [emplacement.emplacementcode] });
		}
	});
	return EmplacementDAO;
});
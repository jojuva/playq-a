define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var ResourceDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.RESOURCE;
		this.columns = {
			resourceid: { type: TYPE.INT, notNull: true, pk: true },
			resourcedescription: { type: TYPE.TEXT },
			protectiontype: { type: TYPE.BOOLAN },
			resourcetypedescription: { type: TYPE.TEXT },
			resourcetypeid:  { type: TYPE.TEXT }
		};
	};

	_.extend(ResourceDAO.prototype, {
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
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},
		findProtection: function(callbacks){
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond : " protectiontype = ?", whereValues: ["true"], orderBy: ['resourcedescription'] }, callbacks);
		},
		deleteRow: function (tx, data){
			//new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "=?", whereValues: [data.]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, resource) {
			var resource_in = _.pick(resource, _.keys(this.columns));
			new sqlUtils().insertOrIgnoreRow (tx, this.tableName, resource_in);
		},
		updateSyncData: function (tx, resource) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: resource, whereCond: " resourceid=? ", whereValues: [resource.resourceid] });
		}
	});
	return ResourceDAO;
});
define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var ModelDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.MODEL;
		this.columns = {
			id: { type: TYPE.TEXT, notNull: true, pk: true },
			modelid: { type: TYPE.TEXT },
			brandid : { type: TYPE.TEXT },
			modeldescription : { type: TYPE.TEXT },
			digitsnumber: { type: TYPE.TEXT },
			isdelete: { type: TYPE.BOOLEAN }
		};
	};

	_.extend(ModelDAO.prototype, {

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
		_setIds: function(data){
			var dataparse = data,
			modelid= data.id.modelid,
			brandid= data.id.brandid,
			id=data.id.brandid+"|"+data.id.modelid;
			_.extend(dataparse, {modelid : modelid, brandid: brandid, id: id});
			return dataparse;
		},
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, orderBy: ['modeldescription'] }, callbacks);
		},
		deleteRow: function (tx, data){
			data = this._setIds(data);
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "id=?", whereValues: [data.id]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, model) {
			sqlU = new sqlUtils();
			model = this._setIds(model);
			sqlU.insertOrIgnoreRow (tx, this.tableName, model);
		},
		updateSyncData: function (tx, model) {
			model = this._setIds(model);
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: model, whereCond: " id=? ", whereValues: [model.id] });
		}
	});
	return ModelDAO;
});
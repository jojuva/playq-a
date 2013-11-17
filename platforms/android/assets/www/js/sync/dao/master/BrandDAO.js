define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var BrandDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.BRAND;
		this.columns = {
			brandid: { type: TYPE.TEXT, notNull: true, pk: true },
			branddescription: { type: TYPE.TEXT },
			isdelete: { type: TYPE.BOOLEAN }
		};
	};

	_.extend(BrandDAO.prototype, {
		// Populate ambit table with sample data
		populate:function (tx) {
			new sqlUtils().createTable (tx, this.tableName, this.columns);
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
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, orderBy: ['branddescription'] }, callbacks);
		},
		deleteRow: function (tx, data){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "brandid=?", whereValues: [data.brandid]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		/*insertSyncData: function (tx, brandModelData) {
			sqlU = new sqlUtils();

			var brands = [];
			_.each(brandModelData, function(brand) {
				if (_.isUndefined(_.findWhere(brands, {brandid: brand.brandid})))
					brands.push(_.pick(brand, 'brandid', 'branddescription'));
			});

			_.each(brands, function(brand) {
				sqlU.insertRow (tx, this.tableName, brand);
			}, this);
		},*/
		insertSyncData: function (tx, brand) {
			sqlU = new sqlUtils();
			sqlU.insertOrIgnoreRow (tx, this.tableName, brand);
		},
		updateSyncData: function (tx, brand) {
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: brand, whereCond: " brandid=? ", whereValues: [brand.brandid] });
		}
	});

	return BrandDAO;
});
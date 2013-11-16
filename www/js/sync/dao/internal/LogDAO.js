define(['underscore', 'sqlUtils', 'moment', 'models/master/configuracionTM'], function(_, sqlUtils, moment, ConfiguracionTM){
	var LogDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.LOG;
		this.columns = {
			LogID: { type: TYPE.INT, notNull: true, pk: true },
			Date: { type: TYPE.TEXT }, //DATE
			Operation: { type: TYPE.TEXT },
			Description: { type: TYPE.TEXT },
			Uuid: { type: TYPE.TEXT },
			Nivel: { type: TYPE.TEXT },
			SOVersio: { type: TYPE.TEXT }
		};
	};

	_.extend(LogDAO.prototype, {

		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, orderBy: ["Date DESC"] }, callbacks);
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		create: function (model, callbacks) {
			var data = model.toJSON(),
			self = this,
			logActive = false;

			sqlU = new sqlUtils();
			var config = new ConfiguracionTM({ConfiguracionID: 1});
			config.fetch({
				success: function (config) {
					if(config.get('logActive') === "true"){
						this.db.transaction(
							function (tx) {
								sqlU.insertOrIgnoreRow(tx, self.tableName, data);
							},
							function (error) {
								alert("Transaction Error: " + error.code + error.message);
							},
							function() { callbacks(model.toJSON()); }
						);
					}
				},
				error: function(){
					callbacks.error();
				}
			});

		}
	});
	return LogDAO;
});
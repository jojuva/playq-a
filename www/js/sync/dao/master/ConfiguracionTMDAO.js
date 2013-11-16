define(['underscore', 'sqlUtils', 'uuidUtils', 'utils'], function(_, sqlUtils, UUIDUtils){
	var ConfiguracionTMDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.CONFIGURACIONTM;
		this.columns = {
			ValueID : { type: TYPE.TEXT, notNull: true, pk: true },
			Value : { type: TYPE.TEXT }
		};
	};

	_.extend(ConfiguracionTMDAO.prototype, {

		populate:function (tx) {
			var self = this;
				sqlU = new sqlUtils();
				sqlU.createTable (tx, this.tableName, this.columns);

			sqlU.insertOrIgnoreRow (tx, this.tableName, {ValueID: "UID", Value:  new UUIDUtils().getUUID() });
			sqlU.insertOrIgnoreRow (tx, this.tableName, {ValueID: "aliasTM", Value : ''});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {ValueID: "wsSync", Value : INIT_URL_SERVICES});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {ValueID: "imagesPath", Value : window.localStorage.getItem(LS_FPATH) });
			sqlU.insertOrIgnoreRow (tx, this.tableName, {ValueID: "timeIntervalSync", Value : '10'});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {ValueID: "logActive", Value: false});
			sqlU.insertOrIgnoreRow (tx, this.tableName, {ValueID: "pushId", Value: ''});
			// TODO temporal
			var base_url = window.localStorage.getItem(LS_URL_WS);
			if (_.isNull(base_url)) {
				window.localStorage.setItem(LS_URL_WS, INIT_URL_SERVICES);
			}
			//FI TODO temporal

		},
		find:function (model, callbacks) {
			//model - configuracionTM
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, {
					success: function(result){
						//Tenim els valors de cada fila ValueID i Value
						//Ho passem a un sol objecte
						var data = {};
						_.each(result, function(config) {
							data[config.ValueID] = config.Value;
						});
						callbacks.success(data);
					},
					error: function(){
						//TODO Error
					}
			});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, aliasTMModelData) {
			sqlU = new sqlUtils();


			sqlU.insertRow (tx, this.tableName, {});
		},

		update:function (model, callback) {
			var data = model.toJSON();
				self = this;
			this.db.transaction(
				function (tx) {
						data = _.omit(data, 'ConfiguracionID', 'aliasTM', 'UID', 'timeIntervalSync', 'imagesPath', 'pushId');
						_.each(data, function(value, valueID){
							var config = {};
							config["Value"] = value;
							new sqlUtils().updateRow(tx, {tableName: self.tableName, columnsData: config, whereCond: " ValueID=? ", whereValues: [valueID] });

							//TODO Temporal
							if(valueID === 'wsSync'){
								//ens guardem el valor a LS_URL_WS
								window.localStorage.setItem(LS_URL_WS, value);
							}
						});
				},
				function (error) {
					//alert("Transaction Error: " + error.code + error.message);
				},
				function() {
					callback(model.toJSON());
				}
			);
		},

		setPushId: function (pushId, callbacks) {
			var self = this;
			this.db.transaction(
				function (tx) {
					new sqlUtils().updateRow(tx, {tableName: self.tableName, columnsData: {Value: pushId}, whereCond: " ValueID=? ", whereValues: ['pushId'] });
				},
				function (error) {
					//alert("Transaction Error: " + error.code + error.message);
					if (callbacks && callbacks.error) callbacks.error();
				},
				function() {
					if (callbacks && callbacks.success) callbacks.success();
				}
			);
		},

		getPushId: function (callbacks) {
			var self = this,
				pushId = '';
			this.db.transaction(
				function (tx) {
					new sqlUtils().selectRow(tx, {
						tableName: self.tableName,
						columns: ['Value'],
						whereCond: " ValueID=? ",
						whereValues: ['pushId']
					}, function (tx, results) {
						if (results.rows.length > 0) {
							pushId = results.rows.item(0).Value;
						}
					});
				},
				function (error) {
					//alert("Transaction Error: " + error.code + error.message);
					if (callbacks.error) callbacks.error();
				},
				function() {
					if (callbacks.success) callbacks.success(pushId);
				}
			);
		}
	});
	return ConfiguracionTMDAO;
});
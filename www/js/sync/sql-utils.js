define(["underscore"], function(_) {
/* SQL util functions */

	var sqlUtils = function () {};

	_.extend(sqlUtils.prototype, {

			/* check if table exists */
			/** @tx: transaction,
			 *  @tableName: table name
			*/
		checkIfTableExists: function(tx, tableName, callback) {

			if  (_.isUndefined(tx) || _.isUndefined(tableName))
				return;

			//console.log("check if " + tableName + " exists");
			tx.executeSql("SELECT count(*) as cont FROM sqlite_master WHERE type=? AND name=?", ['table', tableName], function (tx, results) {
				if (results.rows.length > 0 && results.rows.item(0).cont === 1)
					callback(true);
				else
					callback(false);
			});
		},


		/* create new Table */
		/** @tx: transaction,
		 *  @tableName: table name,
		 *  @columns: object with columns that must be created
		 */
		createTable: function(tx, tableName, columns) {

			if (_.isUndefined(tx) || _.isUndefined(tableName) || _.isEmpty(columns))
				return;

			//console.log('Creating ' + tableName);
			var sql = "CREATE TABLE IF NOT EXISTS " + tableName + "( " +
					this._prepareCreateColumns (columns) +
					" );";
			tx.executeSql(sql);
		},

		/* private method to prepare columns that must be created */
		_prepareCreateColumns: function (columns) {

			var columnNames = _.keys(columns),
				columnAttr = _.values(columns),
				sqlStr = [],
				pkColumns = [],
				fkStr = [];

			for (var i=0, len=columnNames.length; i < len; i++) {
				var columnNameAct = columnNames[i],
					columnAttrAct = columnAttr[i];

				var sql = columnNameAct + " ";

				sql += (!_.isUndefined(type = columnAttrAct.type)) ? type.value + " " : "";
				sql += (!_.isUndefined(columnAttrAct.notNull) && columnAttrAct.notNull === true) ? " NOT NULL " : "";
				sql += (!_.isUndefined(def = columnAttrAct.default)) ? " DEFAULT '" + def + "'" : "";

				sqlStr.push(sql);

				if (!_.isUndefined(columnAttrAct.pk) && columnAttrAct.pk === true)
					pkColumns.push(columnNameAct);

				if (!_.isUndefined(objectFk = columnAttrAct.fk) && !_.isEmpty(objectFk)) {
					cascade = (!_.isUndefined(columnAttrAct.cascade) && columnAttrAct.cascade === true) ? " ON DELETE CASCADE " : "";
					fkStr.push("FOREIGN KEY (" + columnNameAct + ") REFERENCES " + objectFk.table + " (" + objectFk.columns + ") " + cascade);
				}
			}

			return sqlStr.concat(["primary key ( " + pkColumns.join(", ") + " )"], fkStr).join(", ");
		},

		/* drop a Table */
		/** @tx: transaction,
		 *  @tableName: table name
		 */
		dropTable: function (tx, tableName) {
			if (_.isUndefined(tx) || _.isUndefined(tableName)) {
				return;
			}

			//console.log('Dropping ' + tableName + ' table');
			tx.executeSql('DROP TABLE IF EXISTS ' + tableName);
		},

		/* insert new row */
		/** @tx: transaction,
		 *  @tableName: table name,
		 *  @values: object with values that must be inserted
		 */
		insertRow: function (tx, tableName, values, ignore) {
			if (_.isUndefined(tx) || _.isUndefined(tableName) || _.isEmpty(values))
				return;

			var insertSql = (!_.isUndefined(ignore) && ignore === true) ? "INSERT OR IGNORE INTO " : "INSERT INTO ",
				valuesArray = _.values(values),
				prepareVal = [];

			for (var i = 0, len = valuesArray.length; i < len; i++) {
				prepareVal.push("?");
			}

			//console.log('Inserting rows in' + tableName);
			insertSql +=  tableName + " (" + _.keys(values).join(", ") + ") VALUES (" + prepareVal.join(", ") + ")";

			tx.executeSql(insertSql, valuesArray);
		},

		insertOrIgnoreRow:function (tx, tableName, values) {
			this.insertRow(tx, tableName, values, true);
		},

		updateRow: function (tx, params) {
			if (_.isUndefined(tx) || _.isUndefined(params.tableName))
				return;

			var sql = "UPDATE " + params.tableName + " SET ",
				columns = [],
				whereValues = (!_.isUndefined(params.whereValues)) ? params.whereValues : [];

			_.each(_.keys(params.columnsData), function(key) {
				columns.push(key + "= ?");
			});
			sql += columns.join(", ");

			if (!_.isUndefined(params.whereCond) && !_.isEmpty(params.whereCond)) {
				sql += " WHERE " + params.whereCond;
			}

			var valuesArray = _.values(params.columnsData).concat(whereValues);

			tx.executeSql(sql, valuesArray);
		},

		/* select row */
		/** @tx: transaction,
		 *  @tableName: table name,
		 *  @columns: array with columns that you want to select,
		 *  @whereCond: object with where conditions,
		 *	@whereValues: values used in whereCond,
		 *  @orderBy: array with columns that you want to sort,
		 *  @functionResult: callback function
		 */
		selectRow: function (tx, params, functionResult) {

			if (_.isUndefined(tx) || _.isUndefined(params.tableName))
				return;

			var columns = (!_.isUndefined(params.columns)) ? params.columns : ["*"],
				whereValues = (!_.isUndefined(params.whereValues)) ? params.whereValues : [],

				sql = "SELECT " + columns.join(", ") + " FROM " + params.tableName + " ";

			if (!_.isUndefined(params.whereCond) && !_.isEmpty(params.whereCond)) {
				sql += " WHERE " + params.whereCond;
			}

			if (!_.isUndefined(params.orderBy) && !_.isEmpty(params.orderBy)) {
				sql += " ORDER BY " + params.orderBy.join(", ") + " ";
			}

			tx.executeSql(sql, whereValues, functionResult);
		},

		/* join select */
		/** @tx: transaction,
		 *  @tableName: table name,
		 *	@joinTableName: join table name,
		 *  @columns: array with columns that you want to select,
		 *  @onCond: object with "on" conditions,
		 *	@onValues: values used in onCond,
		 *  @functionResult: callback function
		 */
		joinSelect: function (tx, params, functionResult) {

			if (_.isUndefined(tx) || _.isUndefined(params.tableName) || _.isUndefined(params.joinTableName))
				return;

			var columns = (!_.isUndefined(params.columns)) ? params.columns : ["*"],
				onValues = (!_.isUndefined(params.onValues)) ? params.onValues : [],
				whereValues = (!_.isUndefined(params.whereValues)) ? params.whereValues : [],
				joinType = (!_.isUndefined(params.joinType)) ? params.joinType : " JOIN ",
				sql = "SELECT " + columns.join(", ") + " FROM " + params.tableName + joinType + params.joinTableName;

			if (!_.isUndefined(params.onCond) && !_.isEmpty(params.onCond)) {
				sql += " ON " + params.onCond;
			}

			if (!_.isUndefined(params.whereCond) && !_.isEmpty(params.whereCond)) {
				sql += " WHERE " + params.whereCond;
			}

			if (!_.isUndefined(params.orderBy) && !_.isEmpty(params.orderBy)) {
				sql += " ORDER BY " + params.orderBy.join(", ") + " ";
			}

			tx.executeSql(sql, onValues.concat(whereValues), functionResult);
		},

		deleteRows: function (tx, params) {
			if (_.isUndefined(tx) || _.isUndefined(params.tableName))
				return;

			var sql = "DELETE FROM " + params.tableName + " ",
				whereValues = (!_.isUndefined(params.whereValues)) ? params.whereValues : [];

			if (!_.isUndefined(params.whereCond) && !_.isEmpty(params.whereCond)) {
				sql += " WHERE " + params.whereCond;
			}

			tx.executeSql(sql, whereValues);
		},

		// global functions
		globalFindAll: function (params, callbacks) {
			var result = [], self = this;
			params.db.transaction(
				function (tx) {
					self.selectRow(tx, params, function (tx, results) {
						for (var i = 0, len = results.rows.length; i < len; i++) {
							result[i] = results.rows.item(i);
						}
					});
				},
				function (error) {
					alert("Transaction Error: " + error.code + error.message);
					if (callbacks.error) callbacks.error(error);
				},
				function () {
					if (callbacks.success) callbacks.success(result);
				}
			);
		},

		globalFind: function (params, callbacks) {
			var result, self = this;
			params.db.transaction(
				function (tx) {
					new self.selectRow(tx, params, function (tx, results) {
						if (results.rows.length > 0) {
							result = results.rows.item(0);
						}
					});
				},
				function (error) {
					alert("Transaction Error: " + error.code + error.message);
					if (callbacks.error) callbacks.error(error);
				},
				function () {
					if (callbacks.success) callbacks.success(result);
				}
			);
		},

		globalFindAllJoin: function (params, callbacks) {
			var result = [], self = this;
			params.db.transaction(
				function (tx) {
					new self.joinSelect(tx, params, function (tx, results) {
						for (var i = 0, len = results.rows.length; i < len; i++) {
							result[i] = results.rows.item(i);
						}
					});
				},
				function (error) {
					alert("Transaction Error: " + error.code + error.message);
					if (callbacks.error) callbacks.error(error);
				},
				function () {
					if (callbacks.success) callbacks.success(result);
				}
			);
		},

		globalFindJoin: function (params, callbacks) {
			var result = [];
			params.db.transaction(
				function (tx) {
					new sqlUtils().joinSelect(tx, params, function (tx, results) {
						if (results.rows.length > 0) {
							result = results.rows.item(0);
						}
					});
				},
				function (error) {
					alert("Transaction Error: " + error.code + error.message);
					if (callbacks.error) callbacks.error(error);
				},
				function () {
					if (callbacks.success) callbacks.success(result);
				}
			);
		}
	});

	return sqlUtils;

});
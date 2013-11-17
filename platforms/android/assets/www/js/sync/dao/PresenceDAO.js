define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var PresenceDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.PRESENCE;
		this.columns = {
			presenceid : { type: TYPE.INT, notNull: true, pk: true },
			pdausertechnicaloperator: { type: TYPE.TEXT },
			technicaloperatorid: { type: TYPE.TEXT },
			starttime: { type: TYPE.DATE },
			endtime: { type: TYPE.DATE },
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid'}}
		};
	};

	_.extend(PresenceDAO.prototype, {

		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},
		saveData: function (tx, presences, taskid) {
			sqlU = new sqlUtils();
			// inserir nuevas duraciones - presence
			var self = this;
			//netegem el que hi havia abans
			sqlU.deleteRows(tx, {tableName: self.tableName, whereCond: " taskid=? ", whereValues: [taskid] });

            presences.each(function(presence) {
                data = _.omit(presence.toJSON(), "presenceid");
                sqlU.insertRow(tx, self.tableName, data);
            });

		},
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},
		findByTask:function (taskid, callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " taskid=? ", whereValues: [taskid] }, callbacks);
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		deleteRowByTask: function(tx, taskID){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [taskID]});
		}
	});
	return PresenceDAO;
});
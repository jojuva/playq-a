define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var FormDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.FORM;
		this.columns = {
			listformid: { type: TYPE.INT, notNull: true, pk: true },
			formid: { type: TYPE.TEXT },
			formcode: { type: TYPE.TEXT },
			formdescription: { type: TYPE.TEXT },
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid' }},
			edited: { type: TYPE.BOOLEAN, default: false }
		};
	};

	_.extend(FormDAO.prototype, {
	// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},
		findByTask:function (taskid, callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " taskid=? ", whereValues: [taskid] }, callbacks);
		},
		execOperation: function(tx, operation, data, taskID){
			switch(operation){
				case 'ADD':
					this.deleteRowByTask(tx, taskID); // temporal
					this.insertSyncData(tx, data, taskID);
					break;
				case 'DELETE':
					this.deleteRowByTask(tx, taskID);
					break;
				default:
					break;
			}
		},
		deleteRow: function(tx, taskID){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [taskID]});
		},
		deleteRowByTask: function(tx, taskID){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [taskID]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, formModelData, taskID) {
			sqlU = new sqlUtils();
			var form_in;
			_.each(formModelData, function(form) {
				form = _.extend(form, { taskid : taskID });
				form_in = _.pick(form, _.keys(this.columns));
				sqlU.insertOrIgnoreRow (tx, this.tableName, form_in);
			}, this);
		},
		saveData: function (tx, forms) {
			var sqlU = new sqlUtils(), self = this;
			
            forms.each(function(form) {
                data = { edited: form.get('edited') };
                sqlU.updateRow(tx, {
					tableName: self.tableName,
					columnsData: data,
					whereCond: " taskid=? AND listformid=? ",
					whereValues: [form.get('taskid'), form.get('listformid')]
                });
            });

		}
	});
return FormDAO;
});
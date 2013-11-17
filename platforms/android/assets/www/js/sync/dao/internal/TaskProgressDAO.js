define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TaskProgressDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TASKPROGRESS;
		this.columns = {
			taskprogressid: { type: TYPE.INT, notNull: true, pk: true },
			taskid: { type: TYPE.INT },
			datetimedegreeprogress: { type: TYPE.DATE },
			degreeprogress: { type: TYPE.INT },
			textobservationdegreeprogress: { type: TYPE.TEXT }
		};
	};

	_.extend(TaskProgressDAO.prototype, {
		execOperation: function(tx, operation, data, taskID){
			switch(operation){
				case 'ADD':
					this.insertSyncData(tx, data, taskID);
					break;
				case 'DELETE':
					this.deleteData(tx, taskID);
					break;
				default:
					break;
			}
		},
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},

		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},

		findByTask: function(taskId, callbacks){
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " taskid=?", whereValues: [taskId] }, callbacks);
		},

		deleteRow: function (tx, data){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskprogressid=?", whereValues: [data.taskprogressid]});
		},

		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},

		insertSyncData: function (tx, progress, taskID) {
			var progress_in = _.pick(progress, _.keys(this.columns));

			progress_in = _.extend(progress_in, { taskid : taskID });
			progress_in.degreeprogress = parseInt(progress_in.degreeprogress, 10);
			new sqlUtils().insertOrIgnoreRow (tx, this.tableName, progress_in);
		},

		deleteData: function(tx, taskid){
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: " taskid=? ", whereValues: [taskid]});
		},

		saveData: function(tx, progresscol) {
			sqlU = new sqlUtils();
			// inserir nuevos avances - progress
			var self = this;

            progresscol.each(function(progress) {
                data = _.omit(progress.toJSON(), "taskprogressid");
                sqlU.insertRow(tx, self.tableName, data);
            });

		}
	});
	return TaskProgressDAO;
});
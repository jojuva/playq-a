define(['underscore', 'sqlUtils', 'moment'], function(_, sqlUtils, moment){
	var CommentDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.COMMENT;
		this.columns = {
			commentid: { type: TYPE.TEXT, notNull: true, pk: true },
			datetimeobservation: { type: TYPE.DATE },
			textobservation: { type: TYPE.TEXT },
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid'}}
		};
	};

	_.extend(CommentDAO.prototype, {
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},
		findByTask:function (taskid, callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " taskid=? ", whereValues: [taskid] }, callbacks);
		},
		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
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
		insertSyncData: function (tx, comments, taskID) {
			sqlU = new sqlUtils();
			var comment_in;
			_.each(comments, function(comment){
				comment = _.extend(comment, { taskid : taskID });
				comment_in = _.pick(comment, _.keys(this.columns));
				if(!_.isNull(comment_in.datetimeobservation))
					comment_in.datetimeobservation = new moment(comment_in.datetimeobservation).format("YYYY-MM-DDTHH:mm:ss");
				sqlU.insertOrIgnoreRow (tx, this.tableName, comment_in);
			}, this);
		}
	});
	return CommentDAO;
});
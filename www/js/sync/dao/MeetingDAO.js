define(['underscore', 'sqlUtils', 'moment'], function(_, sqlUtils, moment){
	var MeetingDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.MEETING;
		this.columns = {
			meetingid: { type: TYPE.TEXT, notNull: true, pk: true },
			fromdatetime: { type: TYPE.DATE },
			untildatetime: { type: TYPE.DATE },
			textcomment: { type: TYPE.TEXT },
			activemeeting: { type: TYPE.BOOLEAN },
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid'}}
		};
	};

	_.extend(MeetingDAO.prototype, {
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
		// custom methods
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
		insertSyncData: function (tx, meetings, taskID) {
			sqlU = new sqlUtils();
			var meeting_in;
			_.each(meetings, function(meeting){
				meeting = _.extend(meeting, { taskid : taskID });
				meeting_in = _.pick(meeting, _.keys(this.columns));
				if(!_.isNull(meeting_in.fromdatetime))
					meeting_in.fromdatetime = new moment(meeting_in.fromdatetime).format("YYYY-MM-DDTHH:mm:ss");
				if(!_.isNull(meeting_in.untildatetime))
					meeting_in.untildatetime = new moment(meeting_in.untildatetime).format("YYYY-MM-DDTHH:mm:ss");
				sqlU.insertOrIgnoreRow (tx, this.tableName, meeting_in);
			}, this);
		},
		insertSData: function (tx, meetings, taskID) {
			sqlU = new sqlUtils();
		}
	});
	return MeetingDAO;
});
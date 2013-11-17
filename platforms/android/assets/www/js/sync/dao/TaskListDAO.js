define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TaskListDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TASKLIST;
		this.columns = {
			tasklistid: { type: TYPE.TEXT, notNull: true, pk: true },
			taskid: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASK, columns: 'taskid'} },
			taskdescription: { type: TYPE.TEXT },
			sort: { type: TYPE.TEXT },
			gauge: { type: TYPE.INT },
			predicteddate: { type: TYPE.DATE },
			priority: { type: TYPE.INT },
			completeaddress: { type: TYPE.TEXT },
			initialdatereal: { type: TYPE.DATE },
			ottypedesc: { type: TYPE.TEXT },
			status: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASKSTATUS, columns: 'StatusID'}},
			tmstatus: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASKSTATUSSYNC, columns: 'StatusID'}},
			tasktypedesc : { type: TYPE.TEXT },
			originid : { type: TYPE.TEXT }

		};
		this.tableTaskName = TABLEDB.TASK;
		this.tableMeterName = TABLEDB.METER;
		this.tableGaugeName = TABLEDB.GAUGE;
	};

	_.extend(TaskListDAO.prototype, {
		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},
		getData: function(callbacks){
			var sqlU = new sqlUtils(),
			self = this,
			data = [];
			//busquem totes les tasques
			this.db.transaction(
				function (tx) {
					sqlU.selectRow(tx, {tableName: TABLEDB.TASK, columns: ["taskid, taskdescription, sort, predicteddate, priority, completeaddress, ottypedesc, initialdatereal, status, tmstatus, tasktypedesc"] }, function (tx, results) {
						if (results.rows.length > 0) {
							//per cada tasca fem una query del seu meter
							for (var i = 0, len = results.rows.length; i < len; i++) {
								data[i] = results.rows.item(i);
							}
						}
				});
			},
            function (error) {
				//TODO ERROR
				console.log("ERROR "+error);
                execError(ERROR.ERROR_FETCH_DATA, 'TaskListDAO:getData; Transaction error ' + error.code + ' ' + error.message);
            },
            function(){
				self.db.transaction(
				function (tx) {
					_.each(data, function(item){
						sqlU.joinSelect(tx,
									{
									db: self.db,
									tableName: self.tableMeterName + " as tblMeter ",
									joinTableName: self.tableGaugeName + " as tblGauge ",
									columns: ["tblGauge.gaugevalue as gauge"],
									onCond: " tblMeter.taskid = ? AND tblMeter.gaugeid = tblGauge.gaugeid AND (tblMeter.operation="+METEROPERATION.RETIRAR+" OR tblMeter.operation="+METEROPERATION.REVISAR+")",
									onValues: [item.taskid]
									},function(tx, resultsJoin){
										if (resultsJoin.rows.length > 0) {
												_.extend(item, {gauge : resultsJoin.rows.item(0).gauge});
										}
									}
									);
					});
				},
				function (error) {
					 execError(ERROR.ERROR_FETCH_DATA, 'TaskListDAO:getData; Transaction error ' + error.code + ' ' + error.message);
            	},
				function(){
					callbacks.success(data);
				}
				);
            }
			);
		}
	});
	return TaskListDAO;
});
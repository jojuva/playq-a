define(['underscore', 'sqlUtils'], function(_, sqlUtils){
	var TaskDAO = function (db) {
		this.db = db;
		this.tableName = TABLEDB.TASK;
		this.columns = {
			taskid: { type: TYPE.TEXT, notNull: true, pk: true },
			taskseqid : { type: TYPE.TEXT },
			taskdescription: { type: TYPE.TEXT },
			status: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASKSTATUS, columns: 'StatusID'}},
			synchrostatus: { type: TYPE.TEXT },
			tmstatus: { type: TYPE.TEXT, notNull: true, fk: {table: TABLEDB.TASKSTATUSSYNC, columns: 'StatusID'}},
			tmid:{ type: TYPE.INT },
			originid: { type: TYPE.TEXT },
			priority: { type: TYPE.INT },
			requestdate: { type: TYPE.DATE },
			predicteddate: { type: TYPE.DATE },
			initialdateplanned: { type: TYPE.DATE },
			finaldateplanned: { type: TYPE.DATE },
			initialdatereal: { type: TYPE.DATE },
			finaldatereal: { type: TYPE.DATE },
			customername: { type: TYPE.TEXT },
			completeaddress: { type: TYPE.TEXT },
			location: { type: TYPE.TEXT },
			geographicalcriterion: { type: TYPE.TEXT },
			contacttelephone1: { type: TYPE.TEXT },
			contacttelephone2: { type: TYPE.TEXT },
			emplacement: { type: TYPE.TEXT },
			addresscomplement: { type: TYPE.TEXT },
			statusorigin: { type: TYPE.INT },
			incidencetype: { type: TYPE.INT },
			installation : { type: TYPE.TEXT },
			taskduration: { type: TYPE.INT },
			elementcomment : { type: TYPE.TEXT },
			sort: { type: TYPE.TEXT },
			timeslotdescription: { type: TYPE.TEXT },
			gauge: { type: TYPE.INT },
			startdatereplytask: { type: TYPE.DATE },
			finaldatereplytask: { type: TYPE.DATE },
			creationuser : { type: TYPE.TEXT },
			existatachmentfromtm: { type: TYPE.BOOLEAN },
			leaktypeid: { type: TYPE.INT },
			failuretypeid : { type: TYPE.INT },
			isintm: { type: TYPE.BOOLEAN },
			meterserialnumber: { type: TYPE.TEXT },
			meterreading: { type: TYPE.FLOAT },
			chlorinereading: { type: TYPE.FLOAT },
			isusedbasicresources: { type: TYPE.BOOLEAN },
			nonexecutivemotiveid: { type: TYPE.TEXT },
			operationalsite : { type: TYPE.TEXT },
			tasktypeid : { type: TYPE.TEXT },
			tasktypedesc : { type: TYPE.TEXT },
			ottypeid : { type: TYPE.TEXT },
			classcode: { type: TYPE.INT },
			isfailure: { type: TYPE.BOOLEAN },
			ottypedesc : { type: TYPE.TEXT },
			systemorigin : { type: TYPE.TEXT },
			commentstechnicaloperator : { type: TYPE.TEXT },
			operatorid : { type: TYPE.TEXT }
		};
	};

	_.extend(TaskDAO.prototype, {

		findAll:function (callbacks) {
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName }, callbacks);
		},
		find:function (model, callbacks) {
			new sqlUtils().globalFind({ db: this.db, tableName: this.tableName, whereCond: " taskid=? ", whereValues: [model.id] }, callbacks);
		},
		findAnswered: function(callbacks){
			new sqlUtils().globalFindAll({ db: this.db, tableName: this.tableName, whereCond: " tmstatus=? ", whereValues: [TASKSTATUSSYNC.FINALIZADA] }, callbacks);
		},
		// Populate ambit table with sample data
		populate:function (tx) {
			sqlU = new sqlUtils();
			sqlU.createTable (tx, this.tableName, this.columns);
		},
		// custom methods
		execOperation: function(tx, operation, data){
			switch(operation){
				case 'ADD':
					this.deleteRow(tx, data); // temporal
					this.insertSyncData(tx, data);
					break;
				case 'DELETE':
					this.deleteRow(tx, data);
					break;
				default:
					break;
			}
		},
		saveData: function (tx, task) {
			var data = task.toJSON();
			data = _.omit(data, "taskid", 'readingregister', 'taskcommercial', 'taskmeter', 'meeting', 'comment', 'otform', 'nonexecutivemotive');
			new sqlUtils().updateRow(tx, {tableName: this.tableName, columnsData: data, whereCond: " taskid=? ", whereValues: [task.id] });
		},
		deleteRow: function(tx, task){
			var id = null;
			if(!_.isUndefined(task.id)){
				id = task.id;
			}else{
				id = task.taskid;
			}
			new sqlUtils().deleteRows(tx, {tableName: this.tableName, whereCond: "taskid=?", whereValues: [id]});
		},
		deleteAllRows: function (tx) {
			new sqlUtils().deleteRows(tx, {tableName: this.tableName});
		},
		insertSyncData: function (tx, task) {
			sqlU = new sqlUtils();
			var task_in;
			task = _.omit(task, 'readingregister', 'taskcommercial', 'taskmeter', 'meeting', 'comment', 'otform', 'nonexecutivemotive', 'taskseqid');

			task_in = _.pick(task, _.keys(this.columns));

			if((_.isNull(task_in.tmstatus)) || (_.isUndefined(task_in.tmstatus)))
				task_in.tmstatus = TASKSTATUSSYNC.PENDIENTE;
			if((_.isNull(task_in.status)) || (_.isUndefined(task_in.status)))
				task_in.status = TASKSTATUS.PENDIENTE;
			if(!_.isNull(task_in.tmid))
				task_in.tmid = parseInt(task_in.tmid, 10);
			if(!_.isNull(task_in.priority))
				task_in.priority = parseInt(task_in.priority, 10);
			if(!_.isNull(task_in.statusorigin))
				task_in.statusorigin = parseInt(task_in.statusorigin, 10);
			if(!_.isNull(task_in.incidencetype))
				task_in.incidencetype = parseInt(task_in.incidencetype, 10);
			if(!_.isNull(task_in.taskduration))
				task_in.taskduration = parseInt(task_in.taskduration, 10);
			if(!_.isNull(task_in.gauge))
				task_in.gauge = parseInt(task_in.gauge, 10);
			if(!_.isNull(task_in.leaktypeid))
				task_in.leaktypeid = parseInt(task_in.leaktypeid, 10);
			if(!_.isNull(task_in.failuretypeid))
				task_in.failuretypeid = parseInt(task_in.failuretypeid, 10);
			if(!_.isNull(task_in.meterreading))
				task_in.meterreading = parseFloat(task_in.meterreading);
			if(!_.isNull(task_in.chlorinereading))
				task_in.chlorinereading = parseFloat(task_in.chlorinereading).toFixed(2);
			if(!_.isNull(task_in.classcode))
				task_in.classcode = parseInt(task_in.classcode, 10);

			//atribut per saber si està pendent o contestada la tasca, al inici - pendent
			//task_in.pending = PENDINGSTATUS.PENDIENTE;
			sqlU.insertOrIgnoreRow (tx, this.tableName, task_in);
		}
	});
	return TaskDAO;
});
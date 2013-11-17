define(['underscore', 'backbone', 'models/global/queueGlobal', 'sync/dao/master/BrandDAO', 'sync/dao/master/ConfiguracionTMDAO', 'sync/dao/master/EmplacementDAO',
	'sync/dao/master/GaugeDAO', 'sync/dao/master/ModelDAO', 'sync/dao/master/NonExecutiveMotiveDAO' , 'sync/dao/master/OperatorDAO', 'sync/dao/master/FailureTypeDAO',
	'sync/dao/TaskDAO', 'sync/dao/MeetingDAO', 'sync/dao/ReadingRegisterDAO', 'sync/dao/PresenceDAO', 'sync/dao/CommentDAO', 'sync/dao/TaskCommercialDAO', 'sync/dao/MeterDAO', 'sync/dao/TaskHydraulicDAO', 'sync/dao/NonExecutiveTaskDAO', 'sync/dao/OperatorTaskDAO', 'sync/dao/FormDAO', 'sync/dao/OperatorTaskDAO', 'sync/dao/PresenceDAO', 'sync/dao/master/ResourceDAO', 'sync/dao/master/TimeSheetHourTypeDAO', 'sync/dao/master/TimeSheetWorkDateTypeDAO', 'sync/dao/internal/TaskProgressDAO', 'sync/dao/TaskHiddenLeakDAO'],
	function(_, Backbone, QueueGlobal, BrandDAO, ConfiguracionTMDAO, EmplacementDAO, GaugeDAO, ModelDAO, NonExecutiveMotiveDAO, OperatorDAO, FailureTypeDAO,
		TaskDAO, MeetingDAO, ReadingRegisterDAO, PresenceDAO, CommentDAO, TaskCommercialDAO, MeterDAO, TaskHydraulicDAO, NonExecutiveTaskDAO, OperatorTaskDAO, FormDAO, OperatorTaskDAO, PresenceDAO, ResourceDAO, TimeSheetHourTypeDAO, TimeSheetWorkDateTypeDAO, ProgressTaskDAO, TaskHiddenLeakDAO){

	var QueueGlobalCollection = Backbone.Collection.extend({
		model: QueueGlobal,

		comparator: function( model ){
			return parseInt(model.get('id'), 10);
		},

		runOp: function(callbacks) {

			var self= this,
			entity = '',
			data = '',
			operation = '',
			//masters
			brandDAO = new BrandDAO(window.db),
			operatorDAO = new OperatorDAO(window.db),
			nonexecutiveDAO = new NonExecutiveMotiveDAO(window.db),
			gaugeDAO = new GaugeDAO(window.db),
			modelDAO = new ModelDAO(window.db),
			emplacementDAO = new EmplacementDAO(window.db),
			resourceDAO = new ResourceDAO(window.db),
			timeSheetHourTypeDAO = new TimeSheetHourTypeDAO(window.db),
			timeSheetWorkDateTypeDAO = new TimeSheetWorkDateTypeDAO(window.db),
			failuretypeDAO = new FailureTypeDAO(window.db),
			//taks
			taskDAO = new TaskDAO(window.db),
			meetingDAO = new MeetingDAO(window.db),
			readingRegisterDAO = new ReadingRegisterDAO(window.db),
			commentDAO = new CommentDAO(window.db),
			taskCommercialDAO = new TaskCommercialDAO(window.db),
			meterDAO = new MeterDAO(window.db),
			taskHydraulicDAO = new TaskHydraulicDAO(window.db),
			nonExecutiveTaskDAO = new NonExecutiveTaskDAO(window.db),
			operatorTaskDAO = new OperatorTaskDAO(window.db),
			formDAO = new FormDAO(window.db),
			progressTaskDAO = new ProgressTaskDAO(window.db),
			taskHiddenLeakDAO = new TaskHiddenLeakDAO(window.db),
			presenceDAO = new PresenceDAO(window.db);

			window.db.transaction(
				function (tx) {
					_.each(self.models, function(model) {
						entity = model.get('entity');
						data = model.get('data');
						operation = model.get('op');
						switch(entity){
							case 'Operator':
								operatorDAO.execOperation(tx, operation, data);
								break;
							case 'NonExecutiveMotive':
								nonexecutiveDAO.execOperation(tx, operation, data);
								break;
							case 'Brand':
								brandDAO.execOperation(tx, operation, data);
								break;
							case 'Model':
								modelDAO.execOperation(tx, operation, data);
								break;
							case 'Gauge':
								gaugeDAO.execOperation(tx, operation, data);
								break;
							case 'Emplacement':
								emplacementDAO.execOperation(tx, operation, data);
								break;
							case 'Resource' :
								resourceDAO.execOperation(tx, operation, data);
								break;
							case 'HourType' :
								timeSheetHourTypeDAO.execOperation(tx, operation, data);
								break;
							case 'WorkDateType' :
								timeSheetWorkDateTypeDAO.execOperation(tx, operation, data);
								break;
							case 'FailureType' :
								failuretypeDAO.execOperation(tx, operation, data);
								break;
							case 'Task':
								// temporal taules que es creen a la tablet
								operatorTaskDAO.deleteAllRows(tx);
								presenceDAO.deleteAllRows(tx);

								//si la operation es DELETE, borrem primer les raules relacionades i al final la task - repectar les fk
								if(operation === 'DELETE'){
									meetingDAO.execOperation(tx, operation, data.meeting, data.taskid);
									readingRegisterDAO.execOperation(tx, operation, data.readingregister, data.taskid);
									commentDAO.execOperation(tx, operation, data.comment, data.taskid);
									taskCommercialDAO.execOperation(tx, operation, data.taskcommercial, data.taskid);
									meterDAO.execOperation(tx, operation, data.taskmeter, data.taskid);
									formDAO.execOperation(tx, operation, data.otform, data.taskid);
									nonExecutiveTaskDAO.execOperation(tx, operation, data.nonexecutivemotive, data.taskid);
									progressTaskDAO.execOperation(tx, operation, data.progresstask, data.taskid);
									if(!_.isUndefined(data.taskhiddenleak)){
										taskHiddenLeakDAO.execOperation(tx, operation, data.taskhiddenleak, data.taskid);
									}
									taskDAO.execOperation(tx, operation, data);
								}else{
									taskDAO.execOperation(tx, operation, data);
									meetingDAO.execOperation(tx, operation, data.meeting, data.taskid);
									readingRegisterDAO.execOperation(tx, operation, data.readingregister, data.taskid);
									commentDAO.execOperation(tx, operation, data.comment, data.taskid);
									taskCommercialDAO.execOperation(tx, operation, data.taskcommercial, data.taskid);
									meterDAO.execOperation(tx, operation, data.taskmeter, data.taskid);
									formDAO.execOperation(tx, operation, data.otform, data.taskid);
									nonExecutiveTaskDAO.execOperation(tx, operation, data.nonexecutivemotive, data.taskid);
									if(!_.isUndefined(data.taskhiddenleak)){
										taskHiddenLeakDAO.execOperation(tx, operation, data.taskhiddenleak, data.taskid);
									}

									var taskProgCol = data.progresstask;
									//neteja de progressTask que hi havia
									progressTaskDAO.deleteData(tx, data.taskid);
									_.each( taskProgCol, function (taskprogress) {
										progressTaskDAO.execOperation(tx, operation, taskprogress, data.taskid);
									}, this);
								}
								break;
							default:
								break;
						}
					});
				},
				function (error) { console.log(JSON.stringify(error));callbacks.error(error.code); },
				function () { callbacks.success(); }
			);
		}

	});
	return QueueGlobalCollection;
});
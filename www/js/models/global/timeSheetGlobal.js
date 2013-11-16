define(['jquery', 'underscore.extend', 'backbone.extend', 'backbone.stickit.extend', 'utils','uuidUtils', "models/timesheet/timeSheet", "collections/timesheet/TSProductiveCollections", "collections/timesheet/TSNoProductiveCollections", "collections/timesheet/TSResourceCollections", "collections/timesheet/TSTaskCollections","sync/dao/timesheet/TSProductiveDAO","sync/dao/timesheet/TSResourceDAO"],
	function($, _, Backbone, stickit, utils, UUIDUtils, TimeSheet, TSProductiveCollections, TSNoProductiveCollections, TSResourceCollections, TSTaskCollections, TSProductiveDAO, TSResourceDAO) {

		var TimeSheetGlobal = Backbone.Model.extend({
			url: URL_SET_PARTES,
			defaults: {
				timeSheet: null,
				tsNoProductive: null,
				tsTaskWS: null,
				tsTask: null
			},

			_getData: function(options){
				var attrs = this.attributes,
				self = this,
				dataLoaded = _.after(2, function () {
					attrs.tsTaskWS.sort();
					self._getTasks({
						success: function(){ options.success();},
						error: function(){ }
					});
					
				});
				loadCallbacks = {
					success: function () { dataLoaded(); },
					error: options.error
				};

				if(!_.isNull(attrs.timeSheet) && !_.isNull(userid = attrs.timeSheet.userid) && !_.isNull(timesheetdate = attrs.timeSheet.timesheetdate)){
					attrs.timeSheet.fetch({
						success: function (model) {
							//No productive
							attrs.tsNoProductive = new TSNoProductiveCollections();
							attrs.tsNoProductive.findByTimeSheet(model, loadCallbacks);

							//TSTaskWS contindrà totes les tasques del timesheet
							attrs.tsTaskWS = new TSTaskCollections();
							attrs.tsTaskWS.findByTimeSheet(model, loadCallbacks);
							//TSTask contrindra les tasques que no se solapen del timesheet
							attrs.tsTask = new TSTaskCollections();
						},
						error: options.error
					});
				}
			},

			_saveData: function(callbacks) {
				var attrs = this.attributes,
					self = this,
					timeSheetDAO= new attrs.timeSheet.dao(window.db),
					tsNoProductiveDAO = new attrs.tsNoProductive.dao(window.db),
					tsTaskDAO = new attrs.tsTask.dao(window.db),
					tsTaskWSDAO = new attrs.tsTaskWS.dao(window.db),
					tsProductiveDAO = new TSProductiveDAO(window.db),
					tsResourceDAO = new TSResourceDAO(window.db);

				window.db.transaction(
					function (tx) {
						timeSheetDAO.saveData(tx, attrs.timeSheet);
						if (!_.isNull(tsNoProductiveDAO)) {
							tsNoProductiveDAO.deleteData(tx, attrs.timeSheet.get('date'), attrs.timeSheet.get('technicalOperatorId'));
							tsNoProductiveDAO.saveData(tx, attrs.tsNoProductive, attrs.timeSheet.get('date'), attrs.timeSheet.get('technicalOperatorId'));
						}
						if(!_.isNull(tsTaskDAO)){
							_.each(attrs.tsTaskWS.models, function(tstask) {
								self._deleteTaskRelated(tx, tstask, attrs.timeSheet.get('date'), attrs.timeSheet.get('technicalOperatorId'));
							}, this);
							tsTaskDAO.deleteData(tx, attrs.timeSheet.get('date'), attrs.timeSheet.get('technicalOperatorId'));
							tsTaskDAO.saveData(tx, attrs.tsTask, attrs.timeSheet.get('date'), attrs.timeSheet.get('technicalOperatorId'), tsProductiveDAO, tsResourceDAO);
						
						}
					},
					function (error) { callbacks.error(error.code); },
					function () { callbacks.success(); }
				);
			},

			save: function(options) {
				var options = options || {},
					self = this;

				this._saveData({
					success: function() {
						options.success();
					},
					error: function () {
						execError(ERROR.ERROR_SAVE_DATA);
						options.error(ERROR.ERROR_SAVE_DATA);
					}
				});
			},

			fetch: function(options) {
				var self = this;
				this._getData({
					success: function() {
						//self.trigger("dataFetch");
						if(options && options.success) options.success();
					},
					error: function () {
						if(options && options.error) options.error();
					}
				});
			},

			deleteData: function(callbacks) {
				var attrs = this.attributes,
					self = this,
					timeSheetDAO= new attrs.timeSheet.dao(window.db),
					tsNoProductiveDAO = new attrs.tsNoProductive.dao(window.db),
					tsTaskDAO = new attrs.tsTask.dao(window.db),
					date = attrs.timeSheet.get('date'),
					technicalOp = attrs.timeSheet.get('technicalOperatorId');
					//Eliminem tota la tasca i els registres de les taules relacionades
					window.db.transaction(
					function (tx) {
						tsNoProductiveDAO.deleteData(tx, date, technicalOp);

						_.each(attrs.tsTask.models, function(tstask) {
							//tsProductiveDAO.deleteData(tx, date, tstask.get('taskId'), technicalOp);
							//tsResourceDAO.deleteData(tx, date, tstask.get('taskId'), technicalOp);
							self._deleteTaskRelated(tx, tstask, date, technicalOp);
						}, this);
						tsTaskDAO.deleteData(tx, date, technicalOp);
						timeSheetDAO.deleteRow(tx, attrs.timeSheet);
					},
					function (error) { callbacks.error(error.code); },
					function () { callbacks.success(); }
				);

			},

			_deleteTaskRelated: function(tx, tstask, date, technicalOp){
				var tsProductiveDAO = new TSProductiveDAO(window.db),
					tsResourceDAO = new TSResourceDAO(window.db);

				tsProductiveDAO.deleteData(tx, date, tstask.get('taskId'), technicalOp);
				tsResourceDAO.deleteData(tx, date, tstask.get('taskId'), technicalOp);
			},

			_getTasks: function(callbacks){
				var attrs = this.attributes,
					self = this;

				_.each(attrs.tsTaskWS.models, function(tstask){
					var result;
					attrs.tsTask.add(tstask);
					//console.log(JSON.stringify(tstask)+' '+result);
				}, this);
				callbacks.success();
			},

			getDeletedTasks: function(){
				var self = this,
					nonOverlap = this.get('tsTask'),
					deletedTasks = new TSTaskCollections();

				_.each(this.get('tsTaskWS').models, function(task){
					if((_.contains(nonOverlap.models, task)) === false){
						task.set(_.extend(task.attributes, {label : task.get('taskDescription')+' - '+task.get('realAddress')}));
						deletedTasks.add(task);
					}
				});
				return deletedTasks;
			},

			checkFinalTS: function(listProductive, minutes, success){
				var total_prod = null,
					total_no_prod = null,
					total_ts_minutes = null,
					missatge = null,
					successCallback = success;
				total_prod = listProductive.getTotal();
				total_no_prod = this.get('tsNoProductive').getTotal();
				total_ts_minutes = (total_prod + total_no_prod)/1000/60;
				total_jor = minutes.get('totalminutes');
				missatge = $.t('timesheet.missatge_parteOK');

				if(total_ts_minutes > total_jor){
					missatge = $.t('timesheet.missatge_major');
				}
				if(total_ts_minutes < total_jor){
					missatge = $.t('timesheet.missatge_menor');
				}
				successCallback.success(missatge);
				successCallback = null;
			},

			comprovarOverlap: function(listIntervals, callbacks){
				var attrs = this.attributes,
					allIntervals = listIntervals.models.concat(attrs.tsNoProductive.models),
					overlapTaks = [];
				for(var i=0, length=allIntervals.length; i < length; i++) {
					var intActual = allIntervals[i];
					var otherIntervals = _.without(allIntervals, intActual);
					//result = comprobarIntervalosTarea(attrs.tsTask, otherIntervals, tstask);
					result = comprobarIntervaloPresencias(attrs.tsTask, otherIntervals, intActual.get('startDate'), intActual.get('endDate'));
					if(result !== null){
						var tarea =  attrs.tsTask.findWhere({taskId:intActual.get('taskId')}),
							deskTask = '';
						if(!_.isUndefined(tarea)){
							deskTask = tarea.get('taskDescription');
						}
						overlapTaks.push({text: "error.solapaminto", parameter: deskTask});
						
					}
				}
				if(_.isEmpty(overlapTaks)){
					callbacks.success();
				}else{
					callbacks.error(overlapTaks);
				}
			},

			prepareData: function(operation, options){
				var attrs = {},
					self = this,
					fotos = 0;
				attrs.tm = new UUIDUtils().getUUID();
				attrs.data = _.pick(this.toJSON(), 'timeSheet','tsNoProductive','tsTask');
				attrs.data = JSON.stringify(attrs.data);
				attrs.op = operation;
			
				options.success(attrs);
			},
		});
	return TimeSheetGlobal;
});
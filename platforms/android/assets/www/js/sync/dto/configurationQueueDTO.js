define(['underscore', 'backbone', 'uuidUtils', 'collections/global/QueueGlobalCollections'],
	function(_, Backbone, UUIDUtils, QueueGlobalCollections){
	var ConfigurationQueueDTO = Backbone.Model.extend({

		url: URL_GET_QUEUE,
		//url: baseUrl + 'jsonv4' + sufixUrl,
		local: false,
		syncro: true,
		defaults: {
			queueCollection: null
		},

		initialize: function(){
			var uuid = new UUIDUtils().getUUID();
			this.url = this.url + "?tm=" + uuid + '&empty='+window.localStorage.getItem(LS_EMPTY_BD);
		},

		parse: function (result) {
			//console.log("result queue: "+JSON.stringify(result.queue));
			this.queueCollection = new QueueGlobalCollections(result.queue);
			return {};
		},

		fetch: function(options) {
			var self = this,
				successCallback = options.success,
				errorCallback = options.error;
			options = options ? _.clone(options) : {};
			options.success = function(model, resp, options) {
				if(self.queueCollection.size() > 0){
					self.queueCollection.runOp({
						success: function () {
							if (successCallback) {
								//Enviem un OK de confimació al sincronitzador per POST
								var attrs = {};
								attrs.tm = new UUIDUtils().getUUID();

								Backbone.sync("create", self, {
									attrs: attrs,
									url: URL_CONFIRM_TM,
									type: "POST",
									success: function() {
											//TODO TEMPORAL - ja s'ha omplert la BD
											window.localStorage.setItem(LS_EMPTY_BD, "0");
											successCallback();
									},
									error: function () {
										execError(ERROR.SINCRO_ERROR);
										//TODO : mirar com fer això -> tot i que hi hagi error de confirmació, q no pari l'app
										window.localStorage.setItem(LS_EMPTY_BD, "0");
										successCallback();
									}
								});
							}
						},
						error: function(error){
							errorCallback();
						}
					});
				}else{
					successCallback();
				}
			};

			return Backbone.Model.prototype.fetch.call(this, options);
		},
		_deleteDataTasks: function(callbacks){
			require(['sync/dao/TaskDAO', 'sync/dao/MeetingDAO', 'sync/dao/ReadingRegisterDAO', 'sync/dao/PresenceDAO', 'sync/dao/CommentDAO', 'sync/dao/TaskCommercialDAO', 'sync/dao/MeterDAO', 'sync/dao/TaskHydraulicDAO', 'sync/dao/NonExecutiveTaskDAO', 'sync/dao/OperatorTaskDAO', 'sync/dao/FormDAO'],
			function(TaskDAO, MeetingDAO, ReadingRegisterDAO, PresenceDAO, CommentDAO, TaskCommercialDAO, MeterDAO, TaskHydraulicDAO, NonExecutiveTaskDAO, OperatorTaskDAO, FormDAO){

			var taskDAO = new TaskDAO(window.db),
			meetingDAO = new MeetingDAO(window.db),
			readingRegisterDAO = new ReadingRegisterDAO(window.db),
			commentDAO = new CommentDAO(window.db),
			taskCommercialDAO = new TaskCommercialDAO(window.db),
			meterDAO = new MeterDAO(window.db),
			taskHydraulicDAO = new TaskHydraulicDAO(window.db),
			nonExecutiveTaskDAO = new NonExecutiveTaskDAO(window.db),
			operatorTaskDAO = new OperatorTaskDAO(window.db),
			formDAO = new FormDAO(window.db);
			presenceDAO = new PresenceDAO(window.db);
			window.db.transaction(
				function (tx) {
					formDAO.deleteAllRows(tx);
					operatorTaskDAO.deleteAllRows(tx);
					nonExecutiveTaskDAO.deleteAllRows(tx);
					taskHydraulicDAO.deleteAllRows(tx);
					meterDAO.deleteAllRows(tx);
					taskCommercialDAO.deleteAllRows(tx);
					commentDAO.deleteAllRows(tx);
					readingRegisterDAO.deleteAllRows(tx);
					meetingDAO.deleteAllRows(tx);
					presenceDAO.deleteAllRows(tx);
					taskDAO.deleteAllRows(tx);
					},
				function (error) { console.log(JSON.stringify(error));callbacks.error(error.code); },
				function () { callbacks.success(); }
			);
		});
		},
		deleteTasks: function(options){
			this._deleteDataTasks({
				success: function() {
					if(options.success) options.success();
				},
				error: function () {
					if(options.error) options.error();
				}
			});
		},
		_deleteDataMaster: function(callbacks){
			require(['sync/dao/master/BrandDAO', 'sync/dao/master/EmplacementDAO', 'sync/dao/master/GaugeDAO', 'sync/dao/master/ModelDAO', 'sync/dao/master/NonExecutiveMotiveDAO' , 'sync/dao/master/OperatorDAO'],
			function(BrandDAO, EmplacementDAO, GaugeDAO, ModelDAO, NonExecutiveMotiveDAO, OperatorDAO){

				var brandDAO = new BrandDAO(window.db),
					emplacementDAO = new EmplacementDAO(window.db),
					gaugeDAO = new GaugeDAO(window.db),
					modelDAO = new ModelDAO(window.db),
					nonExecutiveMotiveDAO = new NonExecutiveMotiveDAO(window.db);
					operatorDAO = new OperatorDAO(window.db);
				window.db.transaction(
					function (tx) {
						brandDAO.deleteAllRows(tx);
						modelDAO.deleteAllRows(tx);
						emplacementDAO.deleteAllRows(tx);
						operatorDAO.deleteAllRows(tx);
						gaugeDAO.deleteAllRows(tx);
						nonExecutiveMotiveDAO.deleteAllRows(tx);
						},
					function (error) { console.log(JSON.stringify(error));callbacks.error(error.code); },
					function () { callbacks.success(); }
				);
			});
		},
		deleteMasters: function(options){
			this._deleteDataMaster({
				success: function() {
					if(options.success) options.success();
				},
				error: function () {
					if(options.error) options.error();
				}
			});
		}

	});
	return ConfigurationQueueDTO;
});
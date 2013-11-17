define(['underscore', 'backbone', 'sync/dao/timesheet/TSTaskDAO', 'sync/dao/timesheet/TimeSheetDAO' , 'sync/dao/timesheet/TSProductiveDAO', 'sync/dao/timesheet/TSResourceDAO', 'sync/dao/timesheet/TSNoProductiveDAO'],
	function(_, Backbone, tsTaskDAO, TimeSheetDAO, tsProductiveDAO, tsResourceDAO, tsNoProductiveDAO){
	var ConfigurationPartesQueueDTO = Backbone.Model.extend({

		defaults: {
			chargeTM:null,
			hasErrors:null,
			error:null
		},
		initialize: function(){
			//this.url = this.url + "?tm=" + window.localStorage.getItem(LS_UUID);
		},

		_saveTsTasks: function (tx, presenceDataEntry, date, technicalOp) {
			var TSTaskDAO = new tsTaskDAO(window.db),
				TSProductiveDAO = new tsProductiveDAO(window.db),
				TSResourceDAO = new tsResourceDAO(window.db);

			_.each(presenceDataEntry, function(tstask) {
				tstask.asbestosCuts = parseInt(tstask.asbestosCuts, 10);
				tstask.asbestosDuration = parseInt(tstask.asbestosDuration, 10);
				tstask.asbestosExposition = parseInt(tstask.asbestosExposition, 10);
				TSTaskDAO.insertSyncData(tx, _.extend(tstask, {
					date : date,
					technicalOperatorId: technicalOp
				}));

				var presenceOperator = tstask.presenceOperatorMO.presenceOperatorMO;
				_.each(presenceOperator, function(presence) {
					presence = _.extend(presence, { date : date,  taskId: tstask.taskId, technicalOperatorId: technicalOp });
					TSProductiveDAO.insertSyncData(tx, presence);
				});

				var usedResources = tstask.presenceUsedResourceMO.presenceUsedResourceMO;
				_.each(usedResources, function(resource) {
					resource = _.extend(resource, { date : date,  taskId: tstask.taskId, technicalOperatorId: technicalOp });
					TSResourceDAO.insertSyncData(tx, resource);
				});
			}, this);
		},

		_saveNotProductives: function (tx, notProductives, date, tenchnicalOp) {
			var TSNoProductiveDAO = new tsNoProductiveDAO(window.db);
			_.each(notProductives, function(noprod) {
				noprod = _.extend(noprod, { date : date,  technicalOperatorId: tenchnicalOp });
				TSNoProductiveDAO.insertSyncData(tx, noprod);
			});
		},

		_saveData: function( data, callbacks ){
			var self = this,
				timeSheetDAO = new TimeSheetDAO(window.db);

			if(data.hasErrors === false) {
				var charge = data.chargeTM;

				window.db.transaction(
					function (tx) {
						timeSheetDAO.insertSyncData(tx, charge);
						self._saveTsTasks(tx, charge.presenceDataEntryMO.presenceDataEntryMO, charge.date, charge.technicalOperatorId);
						self._saveNotProductives(tx, charge.chargeNotProdIntervalMO.chargeNotProdIntervalMO, charge.date, charge.technicalOperatorId);
					},
					function (error) {
						console.log(JSON.stringify(error));
						execError(ERROR.ERROR_SAVE_DATA, 'configurationPartesQueueDTO:_saveData; Transaction error ' + error.code);
						callbacks.error(error.code);
					},
					function () {
						callbacks.success();
					}
				);
			} else {
				callbacks.error(data.error.description);
			}
		},

		saveToDB: function(data, options) {
			var self = this,
				successCallback = options.success,
				errorCallback = options.error;
			self._saveData(data, {
				success: function () {
					if (successCallback) {
						successCallback();
					}
				},
				error: function(error){
					errorCallback(error);
				}
			});

			//return Backbone.Model.prototype.fetch.call(this, options);
		}
	});
	return ConfigurationPartesQueueDTO;
});
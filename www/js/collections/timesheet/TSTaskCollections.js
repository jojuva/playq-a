define(['underscore', 'backbone', 'moment', 'models/timesheet/TSTask', 'sync/dao/timesheet/TSTaskDAO', 'collections/timesheet/TSProductiveCollections', 'collections/timesheet/TSResourceCollections'], function(_, Backbone, model, TSTask, TSTaskDAO, TSProductiveCollections, TSResourceCollections){
	var TSTaskCollection = Backbone.Collection.extend({
		model: TSTask,
		dao: TSTaskDAO,

		comparator: function(model){
			return model.getStartDate();
		},

		findByTimeSheet: function(timeSheet, callbacks) {
			var self = this;

			new this.dao(window.db).findByTimeSheet(timeSheet, {
				success: function (TsTask, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(TsTask);
					if (self.size() === 0) {
						if (callbacks.success) callbacks.success();
					} else {
						self._setProductiveAndResources(callbacks);
					}
				},
				error: callbacks.error
			});
		},

		_setProductiveAndResources: function(callbacks){
			var numSuccess = this.size()*2; //per productive i resource
			var loadProdRec =_.after(numSuccess, function () {
				if (callbacks.success) callbacks.success();
			});
            var prodCallbacks = {
                success: function () { loadProdRec(); },
                error: callbacks.error
            };

            this.each(function(tstask) {
				tstask.set({ tsproductivetime: new TSProductiveCollections() });
				tstask.get('tsproductivetime').getProdByTask(tstask.get('taskId'), tstask.get('date'), prodCallbacks);
				tstask.set({ tsresource: new TSResourceCollections() });
				tstask.get('tsresource').getResourceByTask(tstask.get('taskId'), tstask.get('date'), prodCallbacks);
			});
		}
	});
	return TSTaskCollection;
});
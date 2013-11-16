define(['underscore', 'backbone', 'models/timesheet/TSResource', 'sync/dao/timesheet/TSResourceDAO'], function(_, Backbone, TSResource, TSResourceDAO){
	var TSResourceCollection = Backbone.Collection.extend({
		model: TSResource,
		dao: TSResourceDAO,
		getResourceByTask: function(taskId, date, callbacks) {
			var self = this;

			new this.dao(window.db).findByTask(taskId, date, {
				success: function (tsresource, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(tsresource);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return TSResourceCollection;
});
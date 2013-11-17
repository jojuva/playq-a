define(['underscore', 'backbone', 'models/taskCommercial', 'sync/dao/TaskCommercialDAO'], function(_, Backbone, TaskCommercial, TaskCommercialDAO){
	var TaskCommercialCollection = Backbone.Collection.extend({
		model: TaskCommercial,
		dao: TaskCommercialDAO,

		findByTask: function(taskid, callbacks) {
			var self = this;
			new this.dao(window.db).findByTask(taskid, {
				success: function (commercial, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(commercial);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return TaskCommercialCollection;
});
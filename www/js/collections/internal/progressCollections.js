define(['underscore', 'backbone', 'models/internal/taskProgress', 'sync/dao/internal/TaskProgressDAO'],
	function(_, Backbone, TaskProgress, TaskProgressDAO){

	var TaskProgressCollection = Backbone.Collection.extend({
		model: TaskProgress,
		dao: TaskProgressDAO,

		comparator: function(model) {
			return model.get('datetimedegreeprogress');
		},

		findByTask: function(taskid, callbacks) {
			var self = this;
			new this.dao(window.db).findByTask(taskid, {
				success: function (progress, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(progress);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return TaskProgressCollection;
});
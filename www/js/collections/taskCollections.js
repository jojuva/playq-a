define(['underscore', 'backbone', 'models/task', 'sync/dao/TaskDAO'], function(_, Backbone, Task, TaskDAO){
	var TaskCollection = Backbone.Collection.extend({
		model: Task,
		dao: TaskDAO,

			findAnswered: function(callbacks) {
				var self = this;
				new this.dao(window.db).findAnswered({
					success: function (task, error) {
						if (!_.isUndefined(error)) {
								callbacks.error(error);
							return;
						}
						self.add(task);
						callbacks.success();
					},
					error: callbacks.error
				});
			}
	});
	return TaskCollection;
});
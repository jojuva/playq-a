define(['underscore', 'backbone', 'models/operatorTask', 'sync/dao/OperatorTaskDAO'], function(_, Backbone, OperatorTask, OperatorTaskDAO){
	var OperatorTaskCollection = Backbone.Collection.extend({
		model: OperatorTask,
		dao: OperatorTaskDAO,

		findByTask: function(taskid, callbacks) {
			var self = this;
			new this.dao(window.db).findByTask(taskid, {
				success: function (operatorTask, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(operatorTask);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return OperatorTaskCollection;
});
define(['underscore', 'backbone', 'models/nonExecutiveTask', 'sync/dao/NonExecutiveTaskDAO'], function(_, Backbone, NonExecutiveTask, NonExecutiveTaskDAO){
	var NonExecutiveCollection = Backbone.Collection.extend({
		model: NonExecutiveTask,
		dao: NonExecutiveTaskDAO,

		findByTask: function(taskid, callbacks) {
			var self = this;
			new this.dao(window.db).findByTaskJoinMotive(taskid, {
				success: function (nonExecutive, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(nonExecutive);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return NonExecutiveCollection;
});
define(['underscore', 'backbone', 'models/readingRegister', 'sync/dao/ReadingRegisterDAO'], function(_, Backbone, ReadingRegister, ReadingRegisterDAO){
	var ReadingRegisterCollection = Backbone.Collection.extend({
		model: ReadingRegister,
		dao: ReadingRegisterDAO,

		findByTask: function(taskid, callbacks) {
			var self = this;
			new this.dao(window.db).findByTask(taskid, {
				success: function (reading, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(reading);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return ReadingRegisterCollection;
});
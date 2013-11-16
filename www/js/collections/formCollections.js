define(['underscore', 'backbone', 'models/form', 'sync/dao/FormDAO'], function(_, Backbone, Form, FormDAO){
	var FormCollection = Backbone.Collection.extend({
		model: Form,
		dao: FormDAO,

		findByTask: function(taskid, callbacks) {
			var self = this;
			new this.dao(window.db).findByTask(taskid, {
				success: function (form, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(form);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return FormCollection;
});
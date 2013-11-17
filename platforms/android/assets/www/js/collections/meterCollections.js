define(['underscore', 'backbone', 'models/meter', 'sync/dao/MeterDAO'], function(_, Backbone, Meter, MeterDAO){
	var MeterCollection = Backbone.Collection.extend({
		model: Meter,
		dao: MeterDAO,

		findByTask: function(taskid, callbacks) {
			var self = this;
			new this.dao(window.db).findByTask(taskid, {
				success: function (meter, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(meter);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return MeterCollection;
});
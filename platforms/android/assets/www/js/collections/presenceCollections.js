define(['underscore', 'backbone', 'models/presence', 'sync/dao/PresenceDAO'], function(_, Backbone, Presence, PresenceDAO){
	var PresenceCollection = Backbone.Collection.extend({
		model: Presence,
		dao: PresenceDAO,

		comparator: function(model) {
			return model.get('starttime');
		},
		findByTask: function(taskid, callbacks) {
			var self = this;
			new this.dao(window.db).findByTask(taskid, {
				success: function (presence, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(presence);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return PresenceCollection;
});
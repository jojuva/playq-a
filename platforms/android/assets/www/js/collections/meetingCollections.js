define(['underscore', 'backbone', 'models/meeting', 'sync/dao/MeetingDAO'], function(_, Backbone, Meeting, MeetingDAO){
	var MeetingCollection = Backbone.Collection.extend({
		model: Meeting,
		dao: MeetingDAO,

		findByTask: function(taskid, callbacks) {
			var self = this;
			new this.dao(window.db).findByTask(taskid, {
				success: function (meeting, error) {
					if (!_.isUndefined(error)) {
							callbacks.error(error);
						return;
					}
					self.add(meeting);
					callbacks.success();
				},
				error: callbacks.error
			});
		}
	});
	return MeetingCollection;
});
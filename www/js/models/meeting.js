define(['underscore', 'backbone', 'sync/dao/MeetingDAO'], function(_, Backbone, MeetingDAO ){
	var Meeting = Backbone.Model.extend({

		dao: MeetingDAO,
		idAttribute: 'meetingid',

		defaults: {
			meetingid : null,
			fromdatetime : null,
			untildatetime : null,
			textcomment : null,
			activemeeting : null,
			taskid : null
		}
	});
	return Meeting;
});
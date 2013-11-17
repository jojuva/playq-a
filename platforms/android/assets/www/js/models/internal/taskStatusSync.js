define(['underscore', 'backbone', 'sync/dao/internal/TaskStatusSyncDAO'], function(_, Backbone, TaskStatusSyncDAO){
	var TaskStatusSync = Backbone.Model.extend({

		dao: TaskStatusSyncDAO,
		idAttribute: 'StatusID',

		defaults: {
			StatusID : null,
			Value : null
		}
	});
	return TaskStatusSync;
});
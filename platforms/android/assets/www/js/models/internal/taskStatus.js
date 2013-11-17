define(['underscore', 'backbone', 'sync/dao/internal/TaskStatusDAO'], function(_, Backbone, TaskStatusDAO){
	var TaskStatus = Backbone.Model.extend({

		dao: TaskStatusDAO,
		idAttribute: 'StatusID',

		defaults: {
			StatusID : null,
			Value : null
		}
	});
	return TaskStatus;
});
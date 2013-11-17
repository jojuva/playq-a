define(['underscore', 'backbone', 'sync/dao/TaskListDAO'], function(_, Backbone, TaskListDAO){
	var TaskList = Backbone.Model.extend({

		dao: TaskListDAO,
		idAttribute: 'tasklistid',

		defaults: {
			tasklistid : null,
			taskid : null,
			taskdescription : null,
			sort : null,
			gauge : null,
			predicteddate : null,
			priority : null,
			completeaddress : null,
			initialdatereal : null,
			ottypedesc : null,
			status : null,
			tmstatus : null,
			tasktypedesc : null,
			originid : null
		}
	});
	return TaskList;
});
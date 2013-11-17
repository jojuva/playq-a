define(['underscore', 'backbone', 'sync/dao/NonExecutiveTaskDAO'], function(_, Backbone, NonExecutiveTaskDAO){
	var NonExecutiveTask = Backbone.Model.extend({

		dao: NonExecutiveTaskDAO,
		idAttribute: 'nonexecutiontaskid',

		defaults: {
			nonexecutiontaskid : null,
			id : null,
			taskid : null,
			nonexecutionmotivedescription : null
		}
	});
	return NonExecutiveTask;
});
define(['underscore', 'backbone', 'sync/dao/master/NonExecutiveMotiveDAO'], function(_, Backbone, NonExecutiveMotiveDAO){
	var NonExecutiveMotive = Backbone.Model.extend({

		dao: NonExecutiveMotiveDAO,
		idAttribute: 'nonexecutivemotiveid',

		defaults: {
			nonexecutivemotiveid : null,
			nonexecutivemotivedescription : null,
			isdelete : null
		}
	});
	return NonExecutiveMotive;
});
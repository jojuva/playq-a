define(['underscore', 'backbone', 'sync/dao/TaskHiddenLeakDAO'], function(_, Backbone, TaskHiddenLeakDAO){
	var TaskHiddenLeak = Backbone.Model.extend({

		dao: TaskHiddenLeakDAO,
		idAttribute: 'taskhiddenleakid',

		defaults: {
			taskhiddenleakid : null,
			totalleaks : null,
			distance : null,
			taskid : null
		},

		validation: {
			totalleaks: [
				{ pattern:  /^[0-9]{1,5}?$/, msg: 'error.validation.totalleaks.format' },
			],
			distance: [
				{ pattern: /^(\d{1,8})|(\d{1,5}(\.|\,)?\d{1,2})$/, msg: 'error.validation.distance.format' }
			]
		}
	});
	return TaskHiddenLeak;
});
define(['underscore', 'backbone', 'sync/dao/internal/TaskProgressDAO'], function(_, Backbone, TaskProgressDAO){
	var TaskProgress = Backbone.Model.extend({

		dao: TaskProgressDAO,
		idAttribute: 'taskprogressid',

		defaults: {
			taskprogressid : null,
			datetimedegreeprogress : null,
			degreeprogress : null,
			textobservationdegreeprogress : null,
			taskid : null
		},
		validation: {
			datetimedegreeprogress: { required: true, msg: 'error.validation.date_progress.required' },
			degreeprogress: [
				{ pattern: 'number', msg: 'error.validation.progress.required' },
				{ min: 0, msg: 'error.validation.progress.required' },
				{ max: 100, msg: 'error.validation.progress.required' }
			]
		}
	});
	return TaskProgress;
});
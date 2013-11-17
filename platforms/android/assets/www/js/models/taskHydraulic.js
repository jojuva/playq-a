define(['underscore', 'backbone', 'sync/dao/TaskHydraulicDAO'], function(_, Backbone, TaskHydraulicDAO){
	var TaskHydraulic = Backbone.Model.extend({

		dao: TaskHydraulicDAO,
		idAttribute: 'TaskHydraulicID',

		defaults: {
			TaskHydraulicID : null,
			InitialDateHydraulic : null,
			FinalDateHydraulic : null,
			ChlorineTest : null,
			HydraulicComments : null,
			taskid : null
		}
	});
	return TaskHydraulic;
});
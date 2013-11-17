define(['underscore', 'backbone', 'sync/dao/timesheet/TimeSheetDAO'], function(_, Backbone, TimeSheetDAO){
	var TimeSheet = Backbone.Model.extend({
		dao: TimeSheetDAO,
		idAttribute: 'timesheetid',

		defaults: {
			timesheetid : null,
			technicalOperatorId: null,
			date: null,
			operatorUnitId: null,
			workDateTypeForOUId: null,
			vehicleRegistration: null,
			observation: null,
			expenses: null,
			status: null
		},
		validation: {
			date: { required: true, msg: 'error.validation.dateTS.required' },
			workDateTypeForOUId: { required: true, msg: 'error.validation.workDateTypeForOUId.required' }
		}

	});
	return TimeSheet;
});
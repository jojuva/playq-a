define(['underscore', 'backbone', 'sync/dao/timesheet/DAO'], function(_, Backbone, DAO){
	var TimeControl = Backbone.Model.extend({
		dao: DAO,
		idAttribute: 'timecontrolid',

		defaults: {
			timecontrolid : null,
			datetimeinitialworkday: null,
			technicaloperatorid: null,
			normalhours: null,
			extrahours: null,
			guardhours: null,
			retention: null,
			diets: null,
			fromtime: null,
			untiltime: null
		}

	});
	return TimeControl;
});
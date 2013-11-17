define(['underscore', 'backbone', 'sync/dao/master/TimeSheetHourTypeDAO'], function(_, Backbone, TimeSheetHourTypeDAO){
	var TimeSheetHourType = Backbone.Model.extend({
		dao: TimeSheetHourTypeDAO,
		idAttribute: 'id',

		defaults: {
			id: null,
			description: null,
			productive: null,
			normal: null
		}

	});
	return TimeSheetHourType;
});
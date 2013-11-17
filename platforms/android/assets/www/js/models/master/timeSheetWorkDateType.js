define(['underscore', 'backbone', 'sync/dao/master/TimeSheetWorkDateTypeDAO'], function(_, Backbone, TimeSheetWorkDateTypeDAO){
	var TimeSheetWorkDateType = Backbone.Model.extend({
		dao: TimeSheetWorkDateTypeDAO,
		idAttribute: 'id',

		defaults: {
			id: null,
			description: null,
			totalminutes: null
		}

	});
	return TimeSheetWorkDateType;
});
define(['underscore', 'backbone', 'models/master/timeSheetHourType', 'sync/dao/master/TimeSheetHourTypeDAO'], function(_, Backbone, TimeSheetHourType, TimeSheetHourTypeDAO){
	var TimeSheetHourTypeCollection = Backbone.Collection.extend({
		model: TimeSheetHourType,
		dao: TimeSheetHourTypeDAO
	});
	return TimeSheetHourTypeCollection;
});
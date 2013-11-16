define(['underscore', 'backbone', 'models/master/timeSheetWorkDateType', 'sync/dao/master/TimeSheetWorkDateTypeDAO'], function(_, Backbone, TimeSheetWorkDateType, TimeSheetWorkDateTypeDAO){
	var TimeSheetWorkDateTypeCollection = Backbone.Collection.extend({
		model: TimeSheetWorkDateType,
		dao: TimeSheetWorkDateTypeDAO
	});
	return TimeSheetWorkDateTypeCollection;
});
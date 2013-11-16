define(['underscore', 'backbone', 'sync/dao/timesheet/TSResourceDAO'], function(_, Backbone, TSResourceDAO){
	var TSResource = Backbone.Model.extend({
		dao: TSResourceDAO,
		idAttribute: 'tsresourceid',

		defaults: {
			tsresourceid: null,
			resourceId: null,
			date: null,
			technicalOperatorId: null,
			usage: null,
			taskId: null
		},
		validation: {
			resourceId: { required: true },
			usage: [{ required: true }, { min: 1 }]
		}

	});
	return TSResource;
});
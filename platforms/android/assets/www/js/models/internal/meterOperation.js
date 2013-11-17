define(['underscore', 'backbone', 'sync/dao/internal/MeterOperationDAO'], function(_, Backbone, MeterOperationDAO){
	var MeterOperation = Backbone.Model.extend({

		dao: MeterOperationDAO,
		idAttribute: 'MeterOperationID',

		defaults: {
			MeterOperationID : null,
			Value : null
		}
	});
	return MeterOperation;
});
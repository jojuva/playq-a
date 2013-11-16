define(['underscore', 'backbone', 'models/internal/meterOperation', 'sync/dao/internal/MeterOperationDAO'],
	function(_, Backbone, MeterOperation, MeterOperationDAO){

	var MeterOperationCollection = Backbone.Collection.extend({
		model: MeterOperation,
		dao: MeterOperationDAO
	});
	return MeterOperationCollection;
});
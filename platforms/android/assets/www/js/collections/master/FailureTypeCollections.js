define(['underscore', 'backbone', 'models/master/failureType', 'sync/dao/master/FailureTypeDAO'], function(_, Backbone, FailureType, FailureTypeDAO){
	var FailureTypeCollection = Backbone.Collection.extend({
		Gauge: FailureType,
		dao: FailureTypeDAO
	});
	return FailureTypeCollection;
});
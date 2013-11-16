define(['underscore', 'backbone', 'sync/dao/master/FailureTypeDAO'], function(_, Backbone, FailureTypeDAO){
	var FailureType = Backbone.Model.extend({

		dao: FailureTypeDAO,
		idAttribute: 'failuretypeid',

		defaults: {
			failuretypeid : null,
			description : null
		}
	});
	return FailureType;
});
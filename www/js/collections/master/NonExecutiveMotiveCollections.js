define(['underscore', 'backbone', 'models/master/nonExecutiveMotive', 'sync/dao/master/NonExecutiveMotiveDAO'], function(_, Backbone, NonExecutiveMotive, NonExecutiveMotiveDAO){
	var NonExecutiveMotiveCollection = Backbone.Collection.extend({
		model: NonExecutiveMotive,
		dao: NonExecutiveMotiveDAO
	});
	return NonExecutiveMotiveCollection;
});
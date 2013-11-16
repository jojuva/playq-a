define(['underscore', 'backbone', 'models/master/emplacement', 'sync/dao/master/EmplacementDAO'], function(_, Backbone, Emplacement, EmplacementDAO){
	var EmplacementCollection = Backbone.Collection.extend({
		model: Emplacement,
		dao: EmplacementDAO
	});
	return EmplacementCollection;
});
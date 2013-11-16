define(['underscore', 'backbone', 'models/master/model', 'sync/dao/master/ModelDAO'], function(_, Backbone, Model, ModelDAO){
	var ModelCollection = Backbone.Collection.extend({
		model: Model,
		dao: ModelDAO,
		comparator: function( model ){
			//ordenat alfabeticament
			return (model.get('modeldescription'));
		}
	});
	return ModelCollection;
});
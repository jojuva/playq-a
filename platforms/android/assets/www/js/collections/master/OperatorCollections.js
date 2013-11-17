define(['underscore', 'backbone', 'models/master/operator', 'sync/dao/master/OperatorDAO'], function(_, Backbone, Operator, OperatorDAO){
	var OperatorCollection = Backbone.Collection.extend({
		model: Operator,
		dao: OperatorDAO,
		comparator: function( model ){
			//ordenat alfabeticament
			return (model.get('name'));
		}
	});
	return OperatorCollection;
});
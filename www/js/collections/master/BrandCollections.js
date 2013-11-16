define(['underscore', 'backbone', 'models/master/brand', 'sync/dao/master/BrandDAO'], function(_, Backbone, Brand, BrandDAO){
	var BrandCollection = Backbone.Collection.extend({
		model: Brand,
		dao: BrandDAO,
		comparator: function( model ){
			//ordenat alfabeticament
			return (model.get('branddescription'));
		}
	});
	return BrandCollection;
});